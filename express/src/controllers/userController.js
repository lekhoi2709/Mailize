const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/user")

module.exports = {
   login: async (req, res) => {
      const { email, password } = req.body

      await User.findOne({ username: email })
         .then(user => {
            if (!user) {
               return res.status(401).json({ code: 3, msg: "Username not found" })
            }

            bcrypt.compare(password, user.password, function (err, result) {
               if (err) {
                  res.status(401).json({ code: 2, msg: err })
               }

               if (!result) {
                  return res.status(401).json({ code: 3, msg: "Incorrect password" })
               }

               jwt.sign({ username: user.username }, process.env.SECRET, { expiresIn: "1h" }, (err, token) => {
                  if (err) {
                     return res.status(401).json({ code: 2, msg: err })
                  }
                  req.session.token = token
                  return res.status(200).json({
                     code: 0,
                     email: user.username,
                     phone: user.phone,
                     role: user.role,
                     lastName: user.lastName,
                     firstName: user.firstName,
                     accessToken: token
                  })
               })
            })
         })
         .catch(e => res.status(401).json({ code: 2, msg: "Error" }))
   },

   register: (req, res) => {
      const { lastName, firstName, email, phone, password } = req.body;
      bcrypt.hash(password, 10, async (err, hash) => {
         if (err) {
            return res.status(401).json({ code: 2, msg: err })
         }

         try {
            const user = await User.create({ username: email, phone: phone, password: hash, lastName: lastName, firstName: firstName })
            return res.status(200).json({ code: 0, user, msg: "Registered Successfully" })
         } catch (e) {
            return res.status(401).json({ code: 2, msg: e })
         }
      })
   }
}
