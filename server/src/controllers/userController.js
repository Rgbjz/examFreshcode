const jwt = require('jsonwebtoken');
const CONSTANTS = require('../constants');
const bd = require('../db/models');
const NotUniqueEmail = require('../errors/NotUniqueEmail');
const moment = require('moment');
const { v4: uuid } = require('uuid');
const controller = require('../socketInit');
const userQueries = require('./queries/userQueries');
const bankQueries = require('./queries/bankQueries');
const ratingQueries = require('./queries/ratingQueries');

module.exports.login = async (req, res, next) => {
    try {
        const foundUser = await userQueries.findUser({ email: req.body.email });
        await userQueries.passwordCompare(
            req.body.password,
            foundUser.password
        );

        const accessToken = jwt.sign(
            {
                firstName: foundUser.firstName,
                userId: foundUser.id,
                role: foundUser.role,
                lastName: foundUser.lastName,
                avatar: foundUser.avatar,
                displayName: foundUser.displayName,
                balance: foundUser.balance,
                email: foundUser.email,
                rating: foundUser.rating,
            },
            CONSTANTS.JWT_SECRET,
            { expiresIn: CONSTANTS.ACCESS_TOKEN_TIME }
        );

        const refreshToken = jwt.sign(
            { userId: foundUser.id },
            CONSTANTS.JWT_REFRESH_SECRET,
            { expiresIn: CONSTANTS.REFRESH_TOKEN_TIME || '30d' }
        );

        await userQueries.updateUser(
            { accessToken, refreshToken },
            foundUser.id
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.send({ token: accessToken });
    } catch (err) {
        next(err);
    }
};

module.exports.registration = async (req, res, next) => {
    try {
        const newUser = await userQueries.userCreation(
            Object.assign(req.body, { password: req.hashPass })
        );

        const accessToken = jwt.sign(
            {
                firstName: newUser.firstName,
                userId: newUser.id,
                role: newUser.role,
                lastName: newUser.lastName,
                avatar: newUser.avatar,
                displayName: newUser.displayName,
                balance: newUser.balance,
                email: newUser.email,
                rating: newUser.rating,
            },
            CONSTANTS.JWT_SECRET,
            { expiresIn: CONSTANTS.ACCESS_TOKEN_TIME }
        );

        const refreshToken = jwt.sign(
            { userId: newUser.id },
            CONSTANTS.JWT_REFRESH_SECRET,
            { expiresIn: CONSTANTS.REFRESH_TOKEN_TIME || '30d' }
        );

        await userQueries.updateUser({ accessToken, refreshToken }, newUser.id);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.send({ token: accessToken });
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            next(new NotUniqueEmail());
        } else {
            next(err);
        }
    }
};

module.exports.logout = async (req, res, next) => {
    try {
        const userId = req.tokenData.userId;

        await userQueries.updateUser({ refreshToken: null }, userId);

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });

        res.send({ message: 'Logged out successfully' });
    } catch (err) {
        next(err);
    }
};

function getQuery (offerId, userId, mark, isFirst, transaction) {
    const getCreateQuery = () =>
        ratingQueries.createRating(
            {
                offerId,
                mark,
                userId,
            },
            transaction
        );
    const getUpdateQuery = () =>
        ratingQueries.updateRating({ mark }, { offerId, userId }, transaction);
    return isFirst ? getCreateQuery : getUpdateQuery;
}

module.exports.changeMark = async (req, res, next) => {
    let sum = 0;
    let avg = 0;
    let transaction;
    const { isFirst, offerId, mark, creatorId } = req.body;
    const userId = req.tokenData.userId;
    try {
        transaction = await bd.sequelize.transaction({
            isolationLevel:
                bd.Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
        });
        const query = getQuery(offerId, userId, mark, isFirst, transaction);
        await query();
        const offersArray = await bd.Ratings.findAll({
            include: [
                {
                    model: bd.Offers,
                    required: true,
                    where: { userId: creatorId },
                },
            ],
            transaction,
        });
        for (let i = 0; i < offersArray.length; i++) {
            sum += offersArray[i].dataValues.mark;
        }
        avg = sum / offersArray.length;

        await userQueries.updateUser({ rating: avg }, creatorId, transaction);
        transaction.commit();
        controller.getNotificationController().emitChangeMark(creatorId);
        res.send({ userId: creatorId, rating: avg });
    } catch (err) {
        transaction.rollback();
        next(err);
    }
};

module.exports.updateUser = async (req, res, next) => {
    try {
        if (req.file) {
            req.body.avatar = req.file.filename;
        }
        const updatedUser = await userQueries.updateUser(
            req.body,
            req.tokenData.userId
        );
        res.send({
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            displayName: updatedUser.displayName,
            avatar: updatedUser.avatar,
            email: updatedUser.email,
            balance: updatedUser.balance,
            role: updatedUser.role,
            id: updatedUser.id,
        });
    } catch (err) {
        next(err);
    }
};
