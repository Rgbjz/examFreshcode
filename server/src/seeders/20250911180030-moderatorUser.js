const bcrypt = require('bcrypt');
const { MODERATOR, SALT_ROUNDS } = require('../constants');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            'Users',
            [
                {
                    firstName: 'modfn',
                    lastName: 'modln',
                    displayName: 'moddn',
                    password: bcrypt.hashSync('123456', SALT_ROUNDS),
                    email: 'moderator@gmail.com',
                    role: MODERATOR,
                },
            ],
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {},
};
