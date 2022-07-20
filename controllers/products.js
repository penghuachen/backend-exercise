const db = require('../models');
const { Op } = require("sequelize");
const Joi = require('joi');
const validateFields = require("../utils/validateFields.js");
const validateToken = require("../utils/validateToken.js");
const sendResponseHandler = require("../utils/sendResponseHandler");
const getMatchedData = require("../utils/getMatchedData");
const generateMetaInformation = require("../utils/generateMetaInformation");
const getQueries = require("../utils/getQueries");
const Products = db.Products;
const Users = db.Users;

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
        const { page, size, product_name, product_price } = req.query;

        // validate token
        const isValid = validateToken(req, res);
        if (!isValid) return;

        // get matched list and  meta information
        const queriesSchema = {
            product_name: {
                [Op.eq]: product_name
            },
            product_price: {
                [Op.eq]: product_price
            },
        };

        const queries = getQueries(req.query, queriesSchema);

        const { data } = await getMatchedData({ db: Products, page, size, queries });
        const { meta } = generateMetaInformation({ total: data.length, page, size });

        const formattedData = Object.keys(data).map(key => {
            for (const dataKey in data[key].dataValues) {
                if (dataKey === 'product_update_records') {
                    data[key].dataValues[dataKey] = JSON.parse(data[key].dataValues[dataKey])
                    break;
                }
            }
            return data[key].dataValues
        });
        sendResponseHandler(res, {
            data: formattedData,
            meta
        })
    },
    getProduct: async(req, res) => {
        const { id } = req.params;

        // validate token
        const isValid = validateToken(req, res);
        if (!isValid) return;

        // get product
        const product = await Products.findOne({
            where: { id }
        });

        if (!product) {
            res.status(422).send('該商品不存在');
            return
        }

        for (const key in product.dataValues) {
            if (key === 'product_update_records') {
                product.dataValues[key] = JSON.parse(product.dataValues[key])
                break;
            }
        }

        sendResponseHandler(res, {
            data: product
        })
    },
    deleteProduct: async(req, res) => {
        const { id } = req.params;

        // validate token
        const isValid = validateToken(req, res);
        if (!isValid) return;

        // get product
        const product = await Products.findOne({
            where: { id }
        });

        if (!product) {
            res.status(422).send('該商品不存在');
            return
        }

        await Products.destroy({
            where: { id }
        });

        res.status(200).send('該商品已成功刪除');
    },
    updateProduct: async(req, res) => {
        const { id } = req.params;
        const { product_name, product_price, note  } = req.body;

        // validate token
        const decode = validateToken(req, res);
        if (!decode) return;

        // get user
        const user = await Users.findOne({
            where: { id: decode.id }
        });

        // get product
        const product = await Products.findOne({
            where: { id }
        });

        if (!product) {
            res.status(422).send('該商品不存在');
            return
        }

        function getUpdateRecords(user, product, req) {
            const translateFields = {
                product_name: '商品名稱',
                product_price: '商品價格',
                note: '備註'
            }
            return Object.keys(req.body)
              .filter(key => product[key])
              .map(key => {
                  if (product[key] === req.body[key]) return;
                  return `${ user.name } 編輯了 ${ translateFields[key] }，從 ${ product[key] } 改成 ${ req.body[key] }`;
              })
              .filter(record => record)
        }

        const newUpdateRecords = getUpdateRecords(user, product, req)

        await Products.update({
            product_name,
            product_price,
            note,
            product_update_records: JSON.stringify([...JSON.parse(product.product_update_records), ...newUpdateRecords ])
        }, {
            where: { id }
        });

        res.status(200).send('該商品更新成功');
    },
}

module.exports = productsController;