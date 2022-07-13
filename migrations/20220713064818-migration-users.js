'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
        'Users',
        'petName',
        {
          type: Sequelize.DataTypes.STRING,
        },
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'petName', );
  }
};
