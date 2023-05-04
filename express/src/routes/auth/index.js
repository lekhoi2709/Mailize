const express = require("express");
const router = express.Router();
const controller = require("../../controllers/userController.js")
const auth = require("../../middleware/authenticate.js")

// Login
router.post("/login", controller.login);

// Register
router.post("/register", controller.register);

// Forgot password
router.put("/forgot", controller.forgot)

// Active change password
router.put("/change-pass", auth, controller.change_pass)

// Delete account
router.delete("/delete-account", auth, controller.delete)

module.exports = router;
