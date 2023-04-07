const express = require("express");
const router = express.Router();
const AuthRouter = require("./auth/index.js");

router.use("/auth", AuthRouter);
router.use("/", (req, res) => {
   return res.json(req.session)
})

module.exports = router;
