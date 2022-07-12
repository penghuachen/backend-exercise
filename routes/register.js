const express = require('express');
const router = express.Router();
const userController = require("../controllers/user")

/* POST register user. */
router.post('/',async  (req, res, next) => {
    await userController.registerUser(req, res)
});

module.exports = router;
