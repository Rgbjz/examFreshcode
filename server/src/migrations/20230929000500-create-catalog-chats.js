'use strict';

module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable('catalog_chats', {
            catalog_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'catalogs',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                primaryKey: true,
            },
            conversation_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'conversations',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                primaryKey: true,
            },
        });
    },

    async down (queryInterface) {
        await queryInterface.dropTable('catalog_chats');
    },
};
