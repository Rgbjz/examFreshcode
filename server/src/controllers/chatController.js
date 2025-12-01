const { sequelize } = require('../db/models');
const {
    Conversation,
    Message,
    Catalog,
    ConversationParticipant,
    CatalogChat,
    Users,
} = require('../db/models');
const controller = require('../socketInit');
const { Op, fn, col, literal } = require('sequelize');

module.exports.addMessage = async (req, res, next) => {
    const { userId, firstName, lastName, displayName, avatar, email } =
        req.tokenData;
    const { recipient, messageBody } = req.body;

    const participants = [userId, recipient].sort((a, b) => a - b);

    try {
        const conversationIds = await ConversationParticipant.findAll({
            where: { user_id: participants },
            attributes: ['conversation_id'],
            group: ['conversation_id'],
            having: literal(`COUNT(user_id) = ${participants.length}`),
            raw: true,
        });

        let conversation;
        if (conversationIds.length) {
            conversation = await Conversation.findByPk(
                conversationIds[0].conversation_id,
                {
                    include: [
                        {
                            model: Users,
                            as: 'participants',
                            attributes: [
                                'id',
                                'firstName',
                                'lastName',
                                'displayName',
                                'avatar',
                                'email',
                            ],
                        },
                    ],
                }
            );
        }

        if (!conversation) {
            conversation = await Conversation.create();
            for (let participantId of participants) {
                await ConversationParticipant.create({
                    conversation_id: conversation.id,
                    user_id: participantId,
                    is_blacklisted: false,
                    is_favorite: false,
                });
            }
            await conversation.reload({
                include: [
                    {
                        model: Users,
                        as: 'participants',
                        attributes: [
                            'id',
                            'firstName',
                            'lastName',
                            'displayName',
                            'avatar',
                            'email',
                        ],
                    },
                ],
            });
        }

        const message = await Message.create({
            sender: userId,
            body: messageBody,
            conversation_id: conversation.id,
        });

        const interlocutorId = participants.find(p => p !== userId);
        const preview = {
            id: conversation.id,
            sender: userId,
            text: messageBody,
            createAt: message.createdAt,
            participants: conversation.participants.map(p => p.id),
            blackList: conversation.participants.map(() => false),
            favoriteList: conversation.participants.map(() => false),
            interlocutor: conversation.participants.find(p => p.id === userId),
        };

        controller
            .getChatController()
            .emitNewMessage(interlocutorId, { message, preview });

        res.send({ message, preview });
    } catch (err) {
        next(err);
    }
};

module.exports.getChat = async (req, res, next) => {
    try {
        const userId = req.tokenData.userId;
        const interlocutorId = Number(req.params.interlocutorId);

        const conversationsForUsers = await ConversationParticipant.findAll({
            where: { user_id: { [Op.in]: [userId, interlocutorId] } },
            attributes: ['conversation_id'],
            group: ['conversation_id'],
            having: ConversationParticipant.sequelize.literal(
                `COUNT(DISTINCT "user_id") = 2`
            ),
        });

        let conversation;

        if (conversationsForUsers.length === 0) {
            conversation = await Conversation.create();

            await ConversationParticipant.bulkCreate([
                { conversation_id: conversation.id, user_id: userId },
                { conversation_id: conversation.id, user_id: interlocutorId },
            ]);
        } else {
            const conversationId = conversationsForUsers[0].conversation_id;
            conversation = await Conversation.findByPk(conversationId);
        }

        const participants = await ConversationParticipant.findAll({
            where: { conversation_id: conversation.id },
            order: [['user_id', 'ASC']],
        });

        const favoriteList = participants.map(p => p.is_favorite);
        const blackList = participants.map(p => p.is_blacklisted);

        const interlocutor = await Users.findByPk(interlocutorId, {
            attributes: [
                'id',
                'firstName',
                'lastName',
                'displayName',
                'avatar',
                'email',
            ],
        });

        const messages = await Message.findAll({
            where: { conversation_id: conversation.id },
            order: [['createdAt', 'ASC']],
        });

        res.json({
            conversationId: conversation.id,
            selfId: userId,
            favoriteList,
            blackList,
            interlocutor,
            messages,
        });
    } catch (err) {
        next(err);
    }
};

module.exports.getPreview = async (req, res, next) => {
    try {
        const userId = req.tokenData.userId;

        const conversations = await Conversation.findAll({
            include: [
                {
                    model: Message,
                    as: 'messages',
                    limit: 1,
                    separate: true,
                    order: [['createdAt', 'DESC']],
                },
                {
                    model: Users,
                    as: 'participants',
                    attributes: [
                        'id',
                        'firstName',
                        'lastName',
                        'displayName',
                        'avatar',
                    ],
                    through: { attributes: ['is_blacklisted', 'is_favorite'] },
                },
            ],
        });

        const filtered = conversations.filter(conv =>
            conv.participants.some(p => p.id === userId)
        );

        const map = new Map();

        filtered.forEach(conv => {
            const lastMessage = conv.messages[0];
            const otherParticipant = conv.participants.find(
                p => p.id !== userId
            );

            const blackListArr = conv.participants.map(
                p => p.ConversationParticipant?.is_blacklisted || false
            );
            const favoriteListArr = conv.participants.map(
                p => p.ConversationParticipant?.is_favorite || false
            );

            const preview = {
                id: conv.id,
                sender: lastMessage?.sender,
                text: lastMessage?.body,
                createAt: lastMessage?.createdAt,
                participants: conv.participants.map(p => p.id),
                blackList: blackListArr,
                favoriteList: favoriteListArr,
                interlocutor: otherParticipant
                    ? {
                          id: otherParticipant.id,
                          firstName: otherParticipant.firstName,
                          lastName: otherParticipant.lastName,
                          displayName: otherParticipant.displayName,
                          avatar: otherParticipant.avatar,
                      }
                    : null,
            };

            if (
                !map.has(conv.id) ||
                new Date(preview.createAt) > new Date(map.get(conv.id).createAt)
            ) {
                map.set(conv.id, preview);
            }
        });

        res.send(
            [...map.values()].sort(
                (a, b) => new Date(b.createAt) - new Date(a.createAt)
            )
        );
    } catch (err) {
        next(err);
    }
};

module.exports.blackList = async (req, res, next) => {
    const { participants, blackListFlag } = req.body;
    const { userId } = req.tokenData;

    try {
        const convIds = await ConversationParticipant.findAll({
            attributes: ['conversation_id'],
            where: {
                user_id: { [Op.in]: participants },
            },
            group: ['conversation_id'],
            having: sequelize.literal(
                `COUNT(DISTINCT "user_id") = ${participants.length}`
            ),
        });

        if (!convIds.length) {
            return res.status(404).send('Conversation not found');
        }

        const convId = convIds[0].conversation_id;

        await ConversationParticipant.update(
            { is_blacklisted: blackListFlag },
            { where: { conversation_id: convId, user_id: userId } }
        );

        const updatedParticipants = await ConversationParticipant.findAll({
            where: { conversation_id: convId },
            attributes: ['user_id', 'is_blacklisted', 'is_favorite'],
            raw: true,
        });

        const blackListArr = participants.map(
            id =>
                updatedParticipants.find(u => u.user_id === id)
                    ?.is_blacklisted || false
        );
        const favoriteListArr = participants.map(
            id =>
                updatedParticipants.find(u => u.user_id === id)?.is_favorite ||
                false
        );

        const response = {
            id: convId,
            participants,
            blackList: blackListArr,
            favoriteList: favoriteListArr,
        };

        res.send(response);

        const interlocutorId = participants.find(id => id !== userId);
        controller
            .getChatController()
            .emitChangeBlockStatus(interlocutorId, response);
    } catch (err) {
        next(err);
    }
};
module.exports.favoriteChat = async (req, res, next) => {
    const { participants, favoriteFlag } = req.body;
    const { userId } = req.tokenData;

    try {
        const convIds = await ConversationParticipant.findAll({
            attributes: ['conversation_id'],
            where: {
                user_id: { [Op.in]: participants },
            },
            group: ['conversation_id'],
            having: sequelize.literal(
                `COUNT(DISTINCT "user_id") = ${participants.length}`
            ),
        });

        if (!convIds.length) {
            return res.status(404).send('Conversation not found');
        }

        const convId = convIds[0].conversation_id;

        await ConversationParticipant.update(
            { is_favorite: favoriteFlag },
            { where: { conversation_id: convId, user_id: userId } }
        );

        const updatedParticipants = await ConversationParticipant.findAll({
            where: { conversation_id: convId },
            attributes: ['user_id', 'is_favorite', 'is_blacklisted'],
            raw: true,
        });

        const favoriteListArr = participants.map(
            id =>
                updatedParticipants.find(u => u.user_id === id)?.is_favorite ||
                false
        );

        const blackListArr = participants.map(
            id =>
                updatedParticipants.find(u => u.user_id === id)
                    ?.is_blacklisted || false
        );

        const response = {
            id: convId,
            participants,
            favoriteList: favoriteListArr,
            blackList: blackListArr,
        };

        res.send(response);

        const interlocutorId = participants.find(id => id !== userId);
        controller
            .getChatController()
            .emitChangeBlockStatus(interlocutorId, response);
    } catch (err) {
        next(err);
    }
};

module.exports.createCatalog = async (req, res, next) => {
    try {
        const catalog = await Catalog.create({
            userId: req.tokenData.userId,
            catalogName: req.body.catalogName,
        });

        if (req.body.chatId) {
            await CatalogChat.create({
                catalog_id: catalog.id,
                conversation_id: req.body.chatId,
            });
        }

        res.send(catalog);
    } catch (err) {
        next(err);
    }
};

module.exports.updateNameCatalog = async (req, res, next) => {
    try {
        const { catalogId, catalogName } = req.body;

        if (!catalogId) return res.status(400).send('catalogId is required');

        const [updated] = await Catalog.update(
            { catalogName },
            {
                where: { id: catalogId, userId: req.tokenData.userId },
                returning: true,
            }
        );

        if (updated === 0) return res.status(404).send('Catalog not found');

        const catalog = await Catalog.findOne({ where: { id: catalogId } });
        res.send(catalog);
    } catch (err) {
        next(err);
    }
};

module.exports.addNewChatToCatalog = async (req, res, next) => {
    try {
        const { catalogId, chatId } = req.body;
        const { userId } = req.tokenData;

        const catalog = await Catalog.findOne({
            where: { id: catalogId, userId },
        });

        if (!catalog) {
            return res.status(404).send({ message: 'Каталог не найден' });
        }

        const exists = await CatalogChat.findOne({
            where: { catalog_id: catalogId, conversation_id: chatId },
        });

        if (exists) {
            return res.status(200).send({ message: 'Чат уже в этом каталоге' });
        }

        await CatalogChat.create({
            catalog_id: catalogId,
            conversation_id: chatId,
        });

        const updatedCatalog = await Catalog.findByPk(catalogId, {
            include: [
                {
                    model: Conversation,
                    as: 'conversations',
                    through: { attributes: [] },
                    attributes: ['id', 'createdAt', 'updatedAt'],
                },
            ],
        });

        if (!updatedCatalog) {
            return res
                .status(404)
                .send({ message: 'Каталог не найден после обновления' });
        }

        const result = updatedCatalog.toJSON();
        result.chats = (result.conversations || []).map(conv => conv.id);
        delete result.conversations;

        return res.status(201).send(result);
    } catch (error) {
        console.error('Ошибка при добавлении чата в каталог:', error);
        next(error);
    }
};

module.exports.removeChatFromCatalog = async (req, res, next) => {
    try {
        await CatalogChat.destroy({
            where: {
                catalog_id: req.params.catalogId,
                conversation_id: req.params.chatId,
            },
        });

        const catalog = await Catalog.findByPk(req.params.catalogId, {
            include: { model: Conversation, as: 'conversations' },
        });

        res.send(catalog);
    } catch (err) {
        next(err);
    }
};

module.exports.deleteCatalog = async (req, res, next) => {
    try {
        const deletedCount = await Catalog.destroy({
            where: {
                id: req.params.catalogId,
                userId: req.tokenData.userId,
            },
        });

        if (deletedCount === 0) {
            return res
                .status(404)
                .send({ message: 'Catalog not found or access denied' });
        }

        res.end();
    } catch (err) {
        next(err);
    }
};
module.exports.getCatalogs = async (req, res, next) => {
    try {
        const catalogs = await Catalog.findAll({
            where: { userId: req.tokenData.userId },
            attributes: ['id', 'catalogName'],
            include: [
                {
                    model: Conversation,
                    as: 'conversations',
                    attributes: ['id', 'createdAt', 'updatedAt'],
                    through: { attributes: [] },
                },
            ],
        });

        const result = catalogs.map(catalog => ({
            id: catalog.id,
            catalogName: catalog.catalogName,
            chats: catalog.conversations || [],
        }));

        res.send(result);
    } catch (err) {
        next(err);
    }
};
