const fs = require('fs');
const path = require('path');
const { LOG_FILE } = require('./logger');

const ARCHIVE_DIR = path.join(__dirname, '..', 'logs', 'archive');

async function archiveLogs () {
    try {
        if (!fs.existsSync(ARCHIVE_DIR)) {
            fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
        }

        if (!fs.existsSync(LOG_FILE)) {
            console.log('[ARCHIVER] Лог-файл отсутствует — пропуск.');
            return;
        }

        const data = await fs.promises.readFile(LOG_FILE, 'utf8');
        if (!data.trim()) {
            console.log('[ARCHIVER] Лог пуст — пропуск.');
            return;
        }

        const lines = data
            .split('\n')
            .filter(Boolean)
            .map(line => {
                try {
                    const obj = JSON.parse(line);
                    return {
                        message: obj.message,
                        code: obj.code,
                        time: obj.time,
                    };
                } catch (e) {
                    return { message: line, code: 500, time: Date.now() };
                }
            });

        const fileName = `log_${new Date().toISOString().slice(0, 10)}.json`;
        const filePath = path.join(ARCHIVE_DIR, fileName);

        await fs.promises.writeFile(filePath, JSON.stringify(lines, null, 2));

        await fs.promises.writeFile(LOG_FILE, '', 'utf8');

        console.log(`[ARCHIVER] Архивация завершена → ${filePath}`);
    } catch (err) {
        console.error('[ARCHIVER] Ошибка архивации:', err);
    }
}

module.exports = { archiveLogs };
