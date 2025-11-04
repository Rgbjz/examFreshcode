const { Router } = require('express');
const checkToken = require('../middlewares/checkToken');
const paymentController = require('../controllers/paymentController');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const upload = require('../utils/fileUpload');
const validators = require('../middlewares/validators');

const paymentRouter = Router();

paymentRouter.post(
    '/cashout',
    checkToken.checkToken,
    basicMiddlewares.onlyForCreative,
    paymentController.cashout
);

paymentRouter.post(
    '/',
    checkToken.checkToken,
    basicMiddlewares.onlyForCustomer,
    upload.uploadContestFiles,
    basicMiddlewares.parseBody,
    validators.validateContestCreation,
    paymentController.payment
);

module.exports = paymentRouter;
