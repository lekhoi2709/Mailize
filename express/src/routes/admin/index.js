const express = require("express");
const router = express.Router();
const controller = require("../../controllers/userController.js")
const auth = require("../../middleware/authenticate.js")

router.get('/:email', auth, controller.get_admin)

module.exports = router;
