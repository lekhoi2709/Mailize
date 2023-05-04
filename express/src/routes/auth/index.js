const express = require("express");
const router = express.Router();
const controller = require("../../controllers/userController.js")

// Login
router.post("/login", controller.login);

// Register
router.post("/register", controller.register);

// Forgot password
router.put("/forgot", controller.forgot)

// Active change password
router.put("/change-pass", controller.change_pass)

module.exports = router;
