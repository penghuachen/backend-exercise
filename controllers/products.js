const db = require('../models');

const productsController = {
    createProduct: async (req, res) => {

        res.send('product created successfully!');
    },
}

module.exports = productsController;