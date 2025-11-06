const jwt = require('jsonwebtoken');
const CONSTANTS = require('../constants');
const TokenError = require('../errors/TokenError');
const userQueries = require('./queries/userQueries');

module.exports.refresh = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return next(new TokenError('no refresh token'));
        }

        let data;
        try {
            data = jwt.verify(token, CONSTANTS.JWT_REFRESH_SECRET);
        } catch (err) {
            return next(new TokenError('invalid refresh token'));
        }

        const user = await userQueries.findUser({ id: data.userId });
        if (!user || user.refreshToken !== token) {
            return next(new TokenError('refresh token not found'));
        }

        const newAccessToken = jwt.sign(
            {
                firstName: user.firstName,
                userId: user.id,
                role: user.role,
                lastName: user.lastName,
                avatar: user.avatar,
                displayName: user.displayName,
                balance: user.balance,
                email: user.email,
                rating: user.rating,
            },
            CONSTANTS.JWT_SECRET,
            { expiresIn: CONSTANTS.ACCESS_TOKEN_TIME }
        );

        const newRefreshToken = jwt.sign(
            { userId: user.id },
            CONSTANTS.JWT_REFRESH_SECRET,
            { expiresIn: CONSTANTS.REFRESH_TOKEN_TIME }
        );

        await userQueries.updateUser(
            { accessToken: newAccessToken, refreshToken: newRefreshToken },
            user.id
        );

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.send({ token: newAccessToken });
    } catch (err) {
        next(err);
    }
};
