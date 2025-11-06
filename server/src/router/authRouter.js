const { Router } = require('express');
const validators = require('../middlewares/validators');
const hashPass = require('../middlewares/hashPassMiddle');
const userController = require('../controllers/userController');
const refreshController = require('../controllers/refreshController');
const checkToken = require('../middlewares/checkToken');
const authRouter = Router();

authRouter.post(
    '/registration',
    validators.validateRegistrationData,
    hashPass,
    userController.registration
);

authRouter.post('/login', validators.validateLogin, userController.login);

authRouter.post('/refresh', refreshController.refresh);

authRouter.post('/logout', checkToken.checkToken, userController.logout);

module.exports = authRouter;
