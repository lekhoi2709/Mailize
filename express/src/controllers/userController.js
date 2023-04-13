const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/user")

module.exports = {
   login: (req, res) => {
      const { username, password } = req.body

      User.findOne({ username: username }).then(user => {
         if (!user) {
            return res.status(401).json({ code: 3, msg: "Username not found" })
         }

         bcrypt.compare(password, user.password, (err, result) => {
            if (err || !result) {
               return res.status(401).json({ code: 3, msg: "Incorrect password" })
            }

            jwt.sign({ username: user.username }, process.env.SECRET, { expiresIn: "1h" }, (err, token) => {
               if (err) {
                  return res.status(401).json({ code: 2, err: err })
               }
               req.session.token = token
               return res.status(200).json({ code: 0, msg: "Login successfully", token })
            })
         })
      }).catch(e => res.status(401).json({ code: 2, err: e }))
   },

   register: (req, res) => {
      const { username, email, phone, password } = req.body;
      try {
         bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
               return res.status(401).json({ code: 2, msg: err })
            }

            const user = await User.create({ username: username, email: email, phone: phone, password: hash })
            return res.status(200).json({ code: 0, user, msg: "Register Successful" })
         })
      } catch (e) {
         return res.status(401).json({ code: 2, msg: e })
      }
   }
}