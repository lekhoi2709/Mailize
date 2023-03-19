const express = require("express");
const router = express.Router();
const User = require("../../models/user.js");
const passport = require("passport");

router.get("/login", (req, res) => {
  return res.send(req.session);
});

router.post(
  "/login",
  passport.authenticate("local", {
    successFlash: true,
    failureFlash: true,
    failureRedirect: "login",
  }),
  (_req, res) => {
    return res.redirect("/api/auth/");
  },
);

// Register
router.get("/register", (_req, res) => {
  return res.send("Register Page.");
});

router.post("/register", (req, res) => {
  const { username, email, phone, password, confirmPass } = req.body;
  const hash = bcrypt.hashSync(password, 10);

  const newUser = new User({
    username: username,
    email: email,
    phone: phone,
    password: hash,
  });

  newUser
    .save()
    .then((doc) => {
      console.log(doc);
      return res.send(doc);
    })
    .catch((err) => res.send(err));

  return res.send("Successful");
});

router.get("/", (req, res) => {
  return res.send(req.session);
});

module.exports = router;
