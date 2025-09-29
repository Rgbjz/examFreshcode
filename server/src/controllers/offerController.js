const db = require('../models');
const { Op } = require('sequelize');
const ServerError = require('../errors/ServerError');
const contestQueries = require('./queries/contestQueries');
const userQueries = require('./queries/userQueries');
const controller = require('../socketInit');
const { sendEmail } = require('../utils/mailService');
const CONSTANTS = require('../constants');


const setNewOffer = async (req, res, next) => {
    const obj = {};
    if (req.body.contestType === CONSTANTS.LOGO_CONTEST) {
        obj.fileName = req.file.filename;
        obj.originalFileName = req.file.originalname;
    } else {
        obj.text = req.body.offerData;
    }
    obj.userId = req.tokenData.userId;
    obj.contestId = req.body.contestId;
    try {
        const result = await contestQueries.createOffer(obj);
        delete result.contestId;
        delete result.userId;
        controller
            .getNotificationController()
            .emitEntryCreated(req.body.customerId);
        const User = { ...req.tokenData, id: req.tokenData.userId };
        res.send({ ...result, User });
    } catch (e) {
        next(new ServerError());
    }
};

const getAllOffersForModerator = async (req, res, next) => {
    try {
        if (req.tokenData.role !== CONSTANTS.MODERATOR) {
            return res.status(403).send({ message: 'Access denied' });
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { rows: offers, count: total } = await db.Offers.findAndCountAll({
            where: { status: CONSTANTS.OFFER_STATUS_PENDING },
            include: [
                {
                    model: db.Contests,
                    as: 'Contest',
                    attributes: ['id', 'title', 'status'],
                },
            ],
            limit,
            offset,
            order: [['id', 'DESC']],
        });

        res.status(200).send({
            offers: offers.map(o => o.get({ plain: true })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

const getMyOffers = async (req, res, next) => {
    try {
        const offers = await contestQueries.getOffersByUser(
            req.tokenData.userId
        );
        res.send(offers);
    } catch (err) {
        next(err);
    }
};

const setOfferStatus = async (req, res, next) => {
    let transaction;
    try {
        const { role } = req.tokenData;

        if (role === CONSTANTS.MODERATOR) {
            const { id, status } = req.body;

            const offer = await contestQueries.updateOffer({ status }, { id });
            const fullOffer = await contestQueries.getOfferById(id);

            if (fullOffer && fullOffer.userId) {
                const [user, contest] = await Promise.all([
                    userQueries.findUser({ id: fullOffer.userId }),
                    db.Contests.findOne({
                        where: { id: fullOffer.contestId },
                        attributes: ['title'],
                    }),
                ]);

                if (user && user.email) {
                    let subject, message;
                    const contestName =
                        contest?.title || `#${fullOffer.contestId}`;

                    if (status === CONSTANTS.OFFER_STATUS_APPROVED) {
                        subject = 'Your offer was approved';
                        message = `<p>Your offer for contest <strong>${contestName}</strong> was approved by the moderator and is now visible to the buyer.</p>`;
                    } else if (status === CONSTANTS.OFFER_STATUS_DECLINED) {
                        subject = 'Your offer was declined';
                        message = `<p>Your offer for contest <strong>${contestName}</strong> was declined by the moderator.</p>`;
                    }

                    if (subject && message) {
                        await sendEmail(user.email, subject, message);
                    }
                }
            }

            return res.send(offer);
        }

        if (req.body.command === 'reject') {
            const offer = await rejectOffer(
                req.body.offerId,
                req.body.creatorId,
                req.body.contestId
            );
            return res.send(offer);
        }

        if (req.body.command === 'resolve') {
            transaction = await db.sequelize.transaction();
            const winningOffer = await resolveOffer(
                req.body.contestId,
                req.body.creatorId,
                req.body.orderId,
                req.body.offerId,
                req.body.priority,
                transaction
            );
            await transaction.commit();
            return res.send(winningOffer);
        }
    } catch (err) {
        if (transaction) await transaction.rollback();
        next(err);
    }
};

const rejectOffer = async (offerId, creatorId, contestId) => {
    const [rejectedOffer, contest] = await Promise.all([
        contestQueries.updateOffer(
            { status: CONSTANTS.OFFER_STATUS_REJECTED },
            { id: offerId }
        ),
        db.Contests.findOne({
            where: { id: contestId },
            attributes: ['title'],
        }),
    ]);

    const user = await userQueries.findUser({ id: creatorId });
    if (user && user.email) {
        await sendEmail(
            user.email,
            'Your offer was rejected',
            `<p>Your offer for contest <strong>${
                contest?.title || `#${contestId}`
            }</strong> was rejected by the buyer.</p>`
        );
    }

    return rejectedOffer;
};

const resolveOffer = async (
    contestId,
    creatorId,
    orderId,
    offerId,
    priority,
    transaction
) => {
    const contest = await db.Contests.findOne({
        where: { id: contestId },
        attributes: ['title'],
    });

    const finishedContest = await contestQueries.updateContest(
        { status: CONSTANTS.CONTEST_STATUS_FINISHED },
        { id: contestId },
        transaction
    );

    await userQueries.updateUser(
        { balance: db.sequelize.literal('balance + ' + finishedContest.prize) },
        creatorId,
        transaction
    );

    const winner = await contestQueries.updateOffer(
        { status: CONSTANTS.OFFER_STATUS_WON },
        { id: offerId },
        transaction
    );

    const rejectedOffers = await contestQueries.updateOfferStatus(
        { status: CONSTANTS.OFFER_STATUS_REJECTED },
        { contestId, id: { [Op.ne]: offerId } },
        transaction
    );

    for (const offer of rejectedOffers) {
        const user = await userQueries.findUser({ id: offer.userId });
        if (user && user.email) {
            await sendEmail(
                user.email,
                'Your offer was rejected',
                `<p>Your offer for contest <strong>${
                    contest?.title || `#${contestId}`
                }</strong> was rejected.</p>`
            );
        }
    }

    const winnerUser = await userQueries.findUser({ id: creatorId });
    if (winnerUser && winnerUser.email) {
        await sendEmail(
            winnerUser.email,
            'Your offer won!',
            `<p>Congratulations! Your offer for contest <strong>${
                contest?.title || `#${contestId}`
            }</strong> was selected as the winner.</p>`
        );
    }

    return winner;
};

module.exports = {
    setNewOffer,
    getAllOffersForModerator,
    getMyOffers,
    setOfferStatus,
};
