const db = require('../models');
const hashPassword = require("../utils/hashPassword.js");
const Users = db.Users;

const userController = {
    registerUser: async (req, res) => {
        const { name, email, password } = req.body;

        await Users.create({
            name,
            email,
            password: hashPassword(password),
        })
    },
}

module.exports = userController;