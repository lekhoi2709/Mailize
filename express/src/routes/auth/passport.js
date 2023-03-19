const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../../models/user.js");

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findOne({ _id: id }).then((user) => {
    return user ? done(null, user) : done(null, null);
  }).catch((err) => done(err, null));
});

passport.use(
  new LocalStrategy(
    function (username, password, done) {
      User.findOne({ username: username }).then((user) => {
        if (!user) {
          return done(null, false, { message: "Invalid, user not found" });
        }
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) return done(err);
          if (!result) {
            return done(null, false, { message: "Invalid, wrong password" });
          }
          return done(null, user, { message: "Login Successful!" });
        });
      }).catch((err) => done(err));
    },
  ),
);
