const fs = require('fs');
const path = require('path');

const LOG_FILE =
    process.env.LOG_FILE || path.join(__dirname, '..', 'logs', 'error.log');

const ensureLogDir = () => {
    const dir = path.dirname(LOG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const parseStack = stack => {
    if (!stack) return {};
    const lines = stack
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);
    return { frames: lines };
};

/**
 * Log error to file as one JSON object per line.
 * @param {Error|any} error - Error object (or any)
 * @param {number|string} [code] - optional numeric HTTP-like code
 * @param {object} [meta] - extra metadata to add
 */
async function logError (error, code = 500, meta = {}) {
    try {
        ensureLogDir();

        const message =
            (error && (error.message || String(error))) || String(error) || '';
        const stack = error && error.stack ? error.stack : undefined;

        const payload = {
            message,
            time: Date.now(),
            code: typeof code === 'number' ? code : Number(code) || 500,
            stackTrace: parseStack(stack),
            ...meta,
        };

        const line = JSON.stringify(payload) + '\n';
        await fs.promises.appendFile(LOG_FILE, line, 'utf8');
        return payload;
    } catch (err) {
        console.error('Failed to write log:', err);
        console.error('Original error:', error);
        return null;
    }
}

module.exports = {
    logError,
    LOG_FILE,
};
