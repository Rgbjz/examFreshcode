'use strict';

module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable('conversation_participants', {
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
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                primaryKey: true,
            },
            is_blacklisted: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            is_favorite: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        });
    },

    async down (queryInterface) {
        await queryInterface.dropTable('conversation_participants');
    },
};
