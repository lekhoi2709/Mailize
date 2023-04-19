const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
   username: {
      type: String,
      unique: true,
   },
   phone: {
      type: String,
      unique: true,
   },
   password: String,
   lastName: String,
   firstName: String,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
