const Message = require('../models/mongoModels/Message');

module.exports.countParovozMessages = async (req, res, next) => {
    try {
        const result = await Message.aggregate([
            {
                $match: {
                    body: { $regex: /паровоз/i },
                },
            },
            {
                $count: 'parovozCount',
            },
        ]);

        res.send({
            count: result.length > 0 ? result[0].parovozCount : 0,
        });
    } catch (err) {
        next(err);
    }
};
