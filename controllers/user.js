const db = require('../models');
const hashPassword = require("../utils/hashPassword.js");
const Users = db.Users;

const userController = {
    registerUser: async (req, res) => {
        const { name, email, password } = req.body;

        const isExisted = await Users.findOne({
            where: { email }
        });

        if (isExisted) {
            res.status(422).send('email has already existed!');
            return;
        }

        await Users.create({
            name,
            email,
            password: hashPassword(password),
        });

        res.send('register successfully!');
    },
}

module.exports = userController;