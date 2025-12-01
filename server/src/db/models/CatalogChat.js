module.exports = (sequelize, DataTypes) => {
    const CatalogChat = sequelize.define(
        'CatalogChat',
        {
            catalog_id: { type: DataTypes.INTEGER, primaryKey: true },
            conversation_id: { type: DataTypes.INTEGER, primaryKey: true },
        },
        {
            tableName: 'catalog_chats',
            timestamps: false,
        }
    );

    return CatalogChat;
};
