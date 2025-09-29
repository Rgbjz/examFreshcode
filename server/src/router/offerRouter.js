const { Router } = require('express');
const checkToken = require('../middlewares/checkToken');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const offerController = require('../controllers/offerController');
const upload = require('../utils/fileUpload');

const offerRouter = Router();

offerRouter.post(
    '/setNewOffer',
    checkToken.checkToken,
    upload.uploadLogoFiles,
    basicMiddlewares.canSendOffer,
    offerController.setNewOffer
);

offerRouter.get(
    '/',
    checkToken.checkToken,
    basicMiddlewares.onlyForModerator,
    offerController.getAllOffersForModerator
);

offerRouter.patch(
    '/setOfferStatus',
    checkToken.checkToken,
    basicMiddlewares.onlyForCustomerWhoCreateContest,
    offerController.setOfferStatus
);

offerRouter.get(
    '/my',
    checkToken.checkToken,
    basicMiddlewares.onlyForCreative,
    offerController.getMyOffers
);

module.exports = offerRouter;
