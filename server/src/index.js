const http = require('http');
require('dotenv').config();
const app = require('./app');
const controller = require('./socketInit');
const { logError } = require('./utils/logger');
const initLogArchiverCron = require('./utils/logArchiverCron');

const PORT = process.env.PORT || 3000;

process.on('uncaughtException', async err => {
    console.error('uncaughtException', err);
    await logError(err, 500, { fatal: true, source: 'uncaughtException' });
});

process.on('unhandledRejection', async reason => {
    console.error('unhandledRejection', reason);
    await logError(reason, 500, { fatal: true, source: 'unhandledRejection' });
});

initLogArchiverCron();

const server = http.createServer(app);
server.listen(PORT, () =>
    console.log(`Example app listening on port ${PORT}!`)
);
controller.createConnection(server);
