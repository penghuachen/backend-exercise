const express = require('express');
const router = express.Router();
const productsController = require("../controllers/products")

/* POST product */
router.post('/',async  (req, res, next) => {
  await productsController.createProduct(req, res)
});

/* GET products list */
router.get('/',async  (req, res, next) => {
  await productsController.getProductsList(req, res)
});

module.exports = router;