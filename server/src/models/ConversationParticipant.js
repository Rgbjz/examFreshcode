module.exports = (sequelize, DataTypes) => {
    const ConversationParticipant = sequelize.define(
        'ConversationParticipant',
        {
            conversation_id: { type: DataTypes.INTEGER, primaryKey: true },
            user_id: { type: DataTypes.INTEGER, primaryKey: true },
            is_blacklisted: { type: DataTypes.BOOLEAN, defaultValue: false },
            is_favorite: { type: DataTypes.BOOLEAN, defaultValue: false },
        },
        {
            tableName: 'conversation_participants',
            timestamps: false,
        }
    );

    return ConversationParticipant;
};
