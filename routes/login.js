const express = require('express');
const router = express.Router();
const userController = require("../controllers/user")

/* POST register user. */
router.post('/',async  (req, res, next) => {
    await userController.loginUser(req, res)
});

module.exports = router;
