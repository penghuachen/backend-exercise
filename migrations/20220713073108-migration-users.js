'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('ALTER TABLE Users DROP PRIMARY KEY')
    await queryInterface.changeColumn(
        'Users',
        'email',
        {
          primaryKey: true,
          type: Sequelize.DataTypes.STRING,
        },
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('ALTER TABLE Users DROP PRIMARY KEY')
    await queryInterface.changeColumn(
        'Users',
        'id',
        {
          primaryKey: true,
          type: Sequelize.DataTypes.STRING,
        },
    );
  }
};
