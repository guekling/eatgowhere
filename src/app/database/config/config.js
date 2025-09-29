// created by Sequelize CLI

module.exports = {
  development: {
    username: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'eatgowhere',
    host: 'localhost',
    dialect: process.env.DB_DIALECT || 'postgres',
    port: process.env.DB_PORT || 5432,
  },
  test: {
    username: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'eatgowhere_test',
    host: 'localhost',
    dialect: process.env.DB_DIALECT || 'postgres',
    port: process.env.DB_PORT || 5433,
  },
};
