const { logError } = require('../utils/logger');

module.exports = async (err, req, res, next) => {
    console.log(err);
    if (
        err.message ===
            'new row for relation "Banks" violates check constraint "Banks_balance_ck"' ||
        err.message ===
            'new row for relation "Users" violates check constraint "Users_balance_ck"'
    ) {
        err.message = 'Not Enough money';
        err.code = 406;
    }
    await logError(err, err.code, {
        url: req.originalUrl,
        method: req.method,
        body: req.body,
    });

    if (!err.message || !err.code) {
        res.status(500).send('Server Error');
    } else {
        res.status(err.code).send(err.message);
    }
};
