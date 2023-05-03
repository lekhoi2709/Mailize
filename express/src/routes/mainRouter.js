const express = require("express");
const router = express.Router();
const AuthRouter = require("./auth/index.js");
const EmailRouter = require('./mail/index.js');

router.use("/auth", AuthRouter);
router.use("/email", EmailRouter)

module.exports = router;
