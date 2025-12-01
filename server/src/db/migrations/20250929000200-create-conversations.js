'use strict';

module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable('conversations', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
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
        await queryInterface.dropTable('conversations');
    },
};
