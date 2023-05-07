const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/user")
const Email = require("../models/email")

module.exports = {
   login: async (req, res) => {
      const { email, password } = req.body

      await User.findOne({ username: email })
         .then(user => {
            if (!user) {
               return res.status(401).json({ code: 1, msg: "Email not found" })
            }

            bcrypt.compare(password, user.password, function (err, result) {
               if (err) {
                  res.status(401).json({ code: 2, msg: err })
               }

               if (!result) {
                  return res.status(401).json({ code: 1, msg: "Incorrect password" })
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
         .catch(e => res.status(502).json({ code: 2, msg: "Error" }))
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
            return res.status(502).json({ code: 2, msg: e })
         }
      })
   },

   forgot: (req, res) => {
      const { email, phone, password } = req.body

      bcrypt.hash(password, 10, async (err, hash) => {
         if (err) {
            return res.status(401).json({ code: 2, msg: err })
         }

         try {
            await User.findOneAndUpdate({ username: email, phone: phone }, { password: hash })
               .then(user => {
                  if (!user) {
                     return res.status(401).json({ code: 1, msg: "Email or Phone number not matched" })
                  }
                  return res.status(200).json({ code: 0, msg: "Changed Password Successfully" })
               })
         } catch (e) {
            return res.status(502).json({ code: 2, msg: e })
         }
      })
   },

   change_pass: async (req, res) => {
      const { email, old_password, password } = req.body

      await User.findOne({ username: email })
         .then(user => {
            if (!user) {
               return res.status(401).json({ code: 1, msg: "Error" })
            }

            bcrypt.compare(old_password, user.password, function (err, result) {
               if (err) {
                  res.status(401).json({ code: 2, msg: err })
               }

               if (!result) {
                  return res.status(401).json({ code: 1, msg: "Incorrect password" })
               }

               bcrypt.hash(password, 10, async (err, hash) => {
                  if (err) {
                     return res.status(401).json({ code: 2, msg: err })
                  }
                  user.password = hash
                  await user.save()
                  return res.status(200).json({ code: 0, msg: "Changed Password Successfully" })
               })
            })
         })
         .catch(e => res.status(502).json({ code: 2, msg: "Error" }))
   },

   delete: async (req, res) => {
      const { email, phone } = req.body

      await User.deleteOne({ username: email, phone: phone })
         .then(result => {
            return res.status(200).json({ code: 0, msg: "Deleted Successfully" })
         })
         .catch(e => res.status(502).json({ code: 2, msg: "Error" }))
   },

   get_admin: async (req, res) => {
      const { email } = req.params
      await User.findOne({ username: email, role: "Admin" })
         .then(user => {
            if (!user) {
               return res.status(401).json({ code: 1, msg: "Email not found" })
            } else {
               return user
            }
         })
         .then(async (user) => {
            await Email.find().then(email => {
               if (!email) {
                  return res.status(401).json({ code: 1, msg: "Empty" })
               }
               return res.status(200).json({ code: 0, data: email })
            })
         })
         .catch(e => res.status(502).json({ code: 2, msg: e }))
   }
}
