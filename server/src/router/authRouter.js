const { Router } = require('express');
const validators = require('../middlewares/validators');
const hashPass = require('../middlewares/hashPassMiddle');
const userController = require('../controllers/userController');

const authRouter = Router();

authRouter.post(
    '/registration',
    validators.validateRegistrationData,
    hashPass,
    userController.registration
);

authRouter.post('/login', validators.validateLogin, userController.login);

module.exports = authRouter;
