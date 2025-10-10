module.exports = (sequelize, DataTypes) => {
    const Conversation = sequelize.define(
        'Conversation',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.literal('NOW()'),
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.literal('NOW()'),
            },
        },
        {
            tableName: 'conversations', // 👈 таблица в БД
            timestamps: true,
            updatedAt: 'updatedAt',
            createdAt: 'createdAt',
        }
    );

    Conversation.associate = models => {
        Conversation.hasMany(models.Message, {
            foreignKey: 'conversation_id',
            as: 'messages',
        });

        Conversation.belongsToMany(models.Users, {
            through: models.ConversationParticipant,
            foreignKey: 'conversation_id',
            otherKey: 'user_id',
            as: 'participants',
        });

        Conversation.belongsToMany(models.Catalog, {
            through: models.CatalogChat,
            foreignKey: 'conversation_id',
            otherKey: 'catalog_id',
            as: 'catalogs',
        });
    };

    return Conversation;
};
