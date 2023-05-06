const mongoose = require('mongoose')
const Email = require('../models/email')
const User = require('../models/user')

module.exports = {
   unread: async (req, res) => {
      const { email } = req.params
      try {
         await Email.find({ 'to.receiver': [`${email}`], "trash": false, "read": false })
            .then(email => {
               if (!email) {
                  return res.status(400).json({ code: 201, msg: "Empty" })
               }
               return res.status(200).json({ code: 200, count: email.length })
            })
      } catch (err) {
         return res.status(502).json({ code: 202, msg: err })
      }
   },

   inbox: async (req, res) => {
      const { email } = req.body
      try {
         await Email.find({ 'to.receiver': [`${email}`], "trash": false }).sort({ createAt: -1 })
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

   detail: async (req, res) => {
      const { id } = req.params
      await Email.find({ _id: id })
         .then(email => {
            if (!email) {
               return res.status(400).json({ code: 201, msg: "Email not found" })
            }
            return res.status(200).json({ code: 200, msg: "Successfully", email: email })
         })
         .catch(e => res.status(502).json({ code: 202, msg: e }))
   },

   sent: async (req, res) => {
      const { from, to, content } = req.body
      try {
         await User.findOne({ username: from.email })
            .then((user) => {
               if (!user) {
                  return res.status(502).json({ code: 201, msg: "Cannot find user" })
               }

               const email = Email.create({
                  from: from,
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

   star: async (req, res) => {
      const { id, starred } = req.body
      await Email.findOneAndUpdate({ _id: id }, { starred: starred })
         .then(result => {
            if (!res) {
               return res.status(400).json({ code: 201, msg: "Incorrect Id" })
            }
            return res.status(200).json({ code: 200, msg: "Starred" })
         })
         .catch(e => res.status(502).json({ code: 202, msg: e }))
   },

   starred: async (req, res) => {
      const { email } = req.body
      try {
         await Email.find({ 'to.receiver': [`${email}`], 'starred': true, trash: false }).sort({ createAt: -1 })
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


   search: async (req, res) => {
      const { email, searchResult } = req.body

      await Email.find({ $text: { $search: searchResult }, "to.receiver": [`${email}`] })
         .then(email => {
            if (!email) {
               return res.status(400).json({ code: 201, msg: "Empty" })
            }
            return res.status(200).json({ code: 200, result: email })
         })
         .catch(e => res.status(502).json({ code: 202, msg: e }))
   },

   trash: async (req, res) => {
      const { id } = req.body
      await Email.findOneAndUpdate({ _id: id }, { trash: true })
         .then(result => {
            if (!res) {
               return res.status(400).json({ code: 201, msg: "Incorrect Id" })
            }
            return res.status(200).json({ code: 200, msg: "Moved to trash" })
         })
         .catch(e => res.status(502).json({ code: 202, msg: e }))
   },

   get_trash: async (req, res) => {
      const { email } = req.body
      try {
         await Email.find({ 'to.receiver': [`${email}`], trash: true }).sort({ createAt: -1 })
            .then(email => {
               if (!email) {
                  return res.status(400).json({ code: 201, msg: "Empty" })
               }
               return res.status(200).json({ code: 200, trash: email })
            })
      } catch (err) {
         return res.status(502).json({ code: 202, msg: err })
      }
   },

   restore: async (req, res) => {
      const { id } = req.body
      await Email.findOneAndUpdate({ _id: id }, { trash: false })
         .then(result => {
            if (!res) {
               return res.status(400).json({ code: 201, msg: "Incorrect Id" })
            }
            return res.status(200).json({ code: 200, msg: "Restored" })
         })
         .catch(e => res.status(502).json({ code: 202, msg: e }))
   },

   delete: async (req, res) => {
      const { id } = req.body

      await Email.deleteOne({ _id: id })
         .then(result => {
            return res.status(200).json({ code: 0, msg: "Deleted Successfully" })
         })
         .catch(e => res.status(502).json({ code: 2, msg: "Error" }))
   },
}