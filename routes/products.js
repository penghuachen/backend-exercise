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

/* GET product */
router.get('/:id',async  (req, res, next) => {
  await productsController.getProduct(req, res)
});

module.exports = router;
