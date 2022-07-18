'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Users',
      'age',
      {
        type: Sequelize.DataTypes.STRING,
      },
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'age', );
  }
};
