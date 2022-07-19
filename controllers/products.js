const db = require('../models');
const { Op } = require("sequelize");
const Joi = require('joi');
const validateFields = require("../utils/validateFields.js");
const validateToken = require("../utils/validateToken.js");
const sendResponseHandler = require("../utils/sendResponseHandler");
const getMatchedData = require("../utils/getMatchedData");
const generateMetaInformation = require("../utils/generateMetaInformation");
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
    getProductsList: async(req, res) => {
        const { page, size, product_name } = req.query;

        // validate token
        validateToken(req, res);

        // get matched list and  meta information
        const queries = {
            product_name: {
                [Op.eq]: product_name
            }
        };

        const { data } = await getMatchedData({ db: Products, page, size, queries });
        const { meta } = generateMetaInformation({ total: data.length, page, size });

        const formattedData = Object.keys(data).map(key => data[key].dataValues);
        sendResponseHandler(res, {
            data: formattedData,
            meta
        })
    }
}

module.exports = productsController;