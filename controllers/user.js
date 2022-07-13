const db = require('../models');
const Joi = require('joi');
const hashPassword = require("../utils/hashPassword.js");
const validateFields = require("../utils/validateFields.js");
const Users = db.Users;

const userController = {
    registerUser: async (req, res) => {
        const { name, email, password } = req.body;

        const schema = Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required(),
        });

        // fields validate
        const fieldsErrors = validateFields(schema, req.body);
        if (fieldsErrors) {
            res.status(422).send(fieldsErrors);
            return;
        }

        // business logic validate
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