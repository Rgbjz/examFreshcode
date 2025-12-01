'use strict';

module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable('catalogs', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            catalogName: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
        });
    },

    async down (queryInterface) {
        await queryInterface.dropTable('catalogs');
    },
};
