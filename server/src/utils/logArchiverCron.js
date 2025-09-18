const cron = require('node-cron');
const { archiveLogs } = require('./logArchiver');

function initLogArchiverCron () {
    cron.schedule('59 23 * * *', async () => {
        console.log('[CRON] Запуск архивации логов...');
        await archiveLogs();
    });
}

module.exports = initLogArchiverCron;
