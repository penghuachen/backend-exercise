require('dotenv').config();

module.exports = {
    [process.env.node_env]: {
        "username": process.env.database_username,
        "password": process.env.database_password,
        "database": process.env.database_name,
        "host": process.env.database_host,
        "dialect": process.env.database_dialect
    },
}