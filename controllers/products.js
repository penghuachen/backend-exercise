const db = require('../models');
const Joi = require('joi');
const validateFields = require("../utils/validateFields.js");
const validateToken = require("../utils/validateToken.js");
const Products = db.Products;

const productsController = {
    createProduct: async (req, res) => {
        const { product_name, product_price, note  } = req.body;

        const schema = Joi.object().keys({
            product_name: Joi.string().required(),
            product_price: Joi.string().required(),
            note: Joi.string().required(),
        });

        // validate token
        validateToken(req, res);

        // validate fields
        const fieldsErrors = validateFields(schema, req.body);
        if (fieldsErrors) {
            res.status(422).send(fieldsErrors);
            return;
        }

        // business logic validate
        const product = await Products.findOne({
            where: { product_name }
        });

        if (product?.id) {
            res.status(422).send("商品名稱不可重複！");
            return;
        }

        Products.create({
            product_name,
            product_price,
            note,
            product_update_records: JSON.stringify([])
        })

        res.send('product created successfully!');
    },
}

module.exports = productsController;