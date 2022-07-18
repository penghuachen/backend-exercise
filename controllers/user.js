const db = require('../models');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const hashPassword = require("../utils/hashPassword.js");
const validateFields = require("../utils/validateFields.js");
const sendResponseHandler = require("../utils/sendResponseHandler.js");
const Users = db.Users;

const userController = {
    registerUser: async (req, res) => {
        const { name, email, password, age } = req.body;

        const schema = Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            age: Joi.string(),
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
            age
        });

        res.send('register successfully!');
    },
    loginUser: async (req, res) => {
        const { email, password } = req.body;

        const schema = Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        });

        // fields validate
        const fieldsErrors = validateFields(schema, req.body);
        if (fieldsErrors) {
            res.status(422).send(fieldsErrors);
            return;
        }

        // business logic validate
        const { id, email: userEmail, password: dbHashPassword, name } = await Users.findOne({
            where: { email }
        });

        if (!id) {
            res.status(422).send('email is not exist!');
            return;
        }

        const isAuthenticated = await bcrypt.compare(password, dbHashPassword);

        const token = jwt.sign(
          { id, userEmail, name },
          process.env.jwt_secret_key,
          { expiresIn: 60 * 60 }
        );

        isAuthenticated
          ? sendResponseHandler(res, { token })
          : res.status(401).send('信箱或密碼錯誤');
    },
}

module.exports = userController;