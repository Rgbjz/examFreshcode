module.exports = (sequelize, DataTypes) => {
    const Catalog = sequelize.define(
        'Catalog',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: { type: DataTypes.INTEGER, allowNull: false },
            catalogName: { type: DataTypes.TEXT, allowNull: false },
        },
        {
            tableName: 'catalogs',
            timestamps: false,
        }
    );

    Catalog.associate = models => {
        Catalog.belongsTo(models.Users, {
            foreignKey: 'userId',
            as: 'user',
        });

        Catalog.belongsToMany(models.Conversation, {
            through: models.CatalogChat,
            foreignKey: 'catalog_id',
            otherKey: 'conversation_id',
            as: 'conversations',
        });
    };

    return Catalog;
};
