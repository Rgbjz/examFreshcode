module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define(
        'Message',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            sender: { type: DataTypes.INTEGER, allowNull: false },
            body: { type: DataTypes.TEXT, allowNull: false },
            conversation_id: { type: DataTypes.INTEGER, allowNull: false },
            createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
            updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        },
        {
            tableName: 'messages',
            timestamps: true,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        }
    );

    Message.associate = models => {
        Message.belongsTo(models.Conversation, {
            foreignKey: 'conversation_id',
        });
        Message.belongsTo(models.Users, {
            foreignKey: 'sender',
        });
    };

    return Message;
};
