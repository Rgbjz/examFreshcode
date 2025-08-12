const { Router } = require('express');
const checkToken = require('../middlewares/checkToken');
const validators = require('../middlewares/validators');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const upload = require('../utils/fileUpload');
const userController = require('../controllers/userController');
const contestController = require('../controllers/contestController');
const contestRouter = Router();

contestRouter.post(
    '/',
    checkToken.checkToken,
    basicMiddlewares.onlyForCustomer,
    upload.uploadContestFiles,
    basicMiddlewares.parseBody,
    validators.validateContestCreation,
    userController.payment
);

contestRouter.get(
    '/',
    checkToken.checkToken,
    basicMiddlewares.onlyForCreative,
    contestController.getContests
);

contestRouter.get(
    '/byCustomer',
    checkToken.checkToken,
    contestController.getCustomersContests
);

contestRouter.get(
    '/:contestId',
    checkToken.checkToken,
    basicMiddlewares.canGetContest,
    contestController.getContestById
);

contestRouter.patch(
    '/:contestId',
    checkToken.checkToken,
    upload.updateContestFile,
    contestController.updateContest
);

contestRouter.post(
    '/dataForContest',
    checkToken.checkToken,
    contestController.dataForContest
);

contestRouter.get(
    '/downloadFile/:fileName',
    checkToken.checkToken,
    contestController.downloadFile
);

contestRouter.post(
    '/setNewOffer',
    checkToken.checkToken,
    upload.uploadLogoFiles,
    basicMiddlewares.canSendOffer,
    contestController.setNewOffer
);

contestRouter.patch(
    '/setOfferStatus',
    checkToken.checkToken,
    basicMiddlewares.onlyForCustomerWhoCreateContest,
    contestController.setOfferStatus
);

module.exports = contestRouter;
