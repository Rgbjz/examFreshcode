'use strict';

module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable('messages', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            sender: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            body: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            conversation_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'conversations',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('NOW()'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('NOW()'),
            },
        });
    },

    async down (queryInterface) {
        await queryInterface.dropTable('messages');
    },
};
