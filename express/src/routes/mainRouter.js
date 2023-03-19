const express = require("express");
const router = express.Router();
const AuthRouter = require("./auth/index.js");

router.use("/auth", AuthRouter);

router.get("/", (req, res) => {
  return res.send("Home Page.");
});

module.exports = router;
