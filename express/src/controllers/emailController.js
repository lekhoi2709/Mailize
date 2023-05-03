const Email = require('../models/email')

module.exports = {
   inbox: async (req, res) => {
      const { from } = req.body
      try {
         await Email.find({ from: from })
            .then(email => {
               if (!email) {
                  return res.status(502).json({ code: 201, msg: "Empty Inbox" })
               }
               return res.status(200).json({ code: 200, inbox: email })
            })
      } catch (err) {
         return res.status(503).json({ code: 202, msg: err })
      }
   },

   sent: async (req, res) => {
      const { from, to, content } = req.body
      try {
         const email = await Email.create({
            from: from,
            to: to,
            content: content,
         })
         return res.status(200).json({ code: 200, email: email })
      } catch (err) {
         return res.status(503).json({ code: 202, msg: err })
      }
   }
}