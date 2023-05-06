const mongoose = require('mongoose')
const Email = require('../models/email')
const User = require('../models/user')

module.exports = {
   inbox: async (req, res) => {
      const { email } = req.body
      try {
         await Email.find().all('to.receiver', [`${email}`]).sort({ createAt: -1 })
            .then(email => {
               if (!email) {
                  return res.status(400).json({ code: 201, msg: "Empty" })
               }
               return res.status(200).json({ code: 200, inbox: email })
            })
      } catch (err) {
         return res.status(502).json({ code: 202, msg: err })
      }
   },

   sent: async (req, res) => {
      const { from, to, content } = req.body
      try {
         await User.findOne({ username: from })
            .then((user) => {
               if (!user) {
                  return res.status(502).json({ code: 201, msg: "Cannot find user" })
               }

               const name = user.lastName + ' ' + user.firstName
               const email = Email.create({
                  from: name,
                  to: to,
                  content: content,
               })
               return res.status(200).json({ code: 200, msg: "Sent Successfully" })
            })
            .catch(e => res.status(502).json({ code: 202, msg: e }))
      } catch (err) {
         return res.status(502).json({ code: 202, msg: err })
      }
   },

   read: async (req, res) => {
      const { id } = req.body
      await Email.findOneAndUpdate({ _id: id }, { read: true })
         .then(result => {
            if (!res) {
               return res.status(400).json({ code: 201, msg: "Incorrect Id" })
            }
            return res.status(200).json({ code: 200, msg: "Read" })
         })
         .catch(e => res.status(502).json({ code: 202, msg: e }))
   },

   search: async (req, res) => {
      const { email, searchResult } = req.body

      await Email.find({ $text: { $search: searchResult } })
         .then(email => {
            if (!email) {
               return res.status(400).json({ code: 201, msg: "Empty" })
            }
            return res.status(200).json({ code: 200, result: email })
         })
         .catch(e => res.status(502).json({ code: 202, msg: e }))
   }
}