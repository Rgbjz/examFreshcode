const bd = require('../../models');
const ServerError = require('../../errors/ServerError');

module.exports.updateContest = async (data, predicate, transaction) => {
    const [updatedCount, [updatedContest]] = await bd.Contests.update(data, {
        where: predicate,
        returning: true,
        transaction,
    });
    if (updatedCount !== 1) {
        throw new ServerError('cannot update Contest');
    } else {
        return updatedContest.dataValues;
    }
};

module.exports.updateContestStatus = async (data, predicate, transaction) => {
    const updateResult = await bd.Contests.update(data, {
        where: predicate,
        returning: true,
        transaction,
    });
    if (updateResult[0] < 1) {
        throw new ServerError('cannot update Contest');
    } else {
        return updateResult[1][0].dataValues;
    }
};

module.exports.updateOffer = async (data, predicate, transaction) => {
    const [updatedCount, [updatedOffer]] = await bd.Offers.update(data, {
        where: predicate,
        returning: true,
        transaction,
    });
    if (updatedCount !== 1) {
        throw new ServerError('cannot update offer!');
    } else {
        return updatedOffer.dataValues;
    }
};

module.exports.updateOfferStatus = async (data, predicate, transaction) => {
    const [count, rows] = await bd.Offers.update(data, {
        where: predicate,
        returning: true,
        transaction,
    });

    return rows;
};

module.exports.createOffer = async data => {
    const result = await bd.Offers.create(data);
    if (!result) {
        throw new ServerError('cannot create new Offer');
    } else {
        return result.get({ plain: true });
    }
};
module.exports.getAllOffers = async ({ page = 1, limit = 10 }) => {
    try {
        page = Number(page);
        limit = Number(limit);
        if (Number.isNaN(page) || page < 1) page = 1;
        if (Number.isNaN(limit) || limit < 1) limit = 10;

        const offset = (page - 1) * limit;

        const { rows, count } = await bd.Offers.findAndCountAll({
            offset,
            limit,
            order: [['id', 'DESC']],
            attributes: [
                'id',
                'contestId',
                'text',
                'fileName',
                'originalFileName',
                'status',
            ],
            include: [
                {
                    model: bd.Contests,
                    as: 'Contest',
                    attributes: ['id', 'title'],
                },
            ],
        });

        return {
            offers: rows.map(offer => offer.get({ plain: true })),
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit),
            },
        };
    } catch (err) {
        throw new ServerError('Cannot fetch offers');
    }
};

module.exports.getOffersByUser = async userId => {
    try {
        const offers = await bd.Offers.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: bd.Contests,
                    as: 'Contest',
                    attributes: ['id', 'title', 'status'],
                },
            ],
        });
        return offers.map(o => o.get({ plain: true }));
    } catch (err) {
        throw new ServerError('cannot fetch user offers');
    }
};

module.exports.getOfferById = async id => {
    return await bd.Offers.findOne({
        where: { id },
        raw: true,
    });
};
