const { Router } = require('express');
const checkToken = require('../middlewares/checkToken');
const userController = require('../controllers/userController');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const upload = require('../utils/fileUpload');

const userRouter = Router();

userRouter.patch(
    '/changeMark',
    checkToken.checkToken,
    basicMiddlewares.onlyForCustomer,
    userController.changeMark
);

userRouter.patch(
    '/updateUser',
    checkToken.checkToken,
    upload.uploadAvatar,
    userController.updateUser
);

userRouter.post(
    '/cashout',
    checkToken.checkToken,
    basicMiddlewares.onlyForCreative,
    userController.cashout
);

userRouter.get('/getUser', checkToken.checkAuth);

module.exports = userRouter;
