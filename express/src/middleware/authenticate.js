const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
   var authorization = req.header("Authorization")

   if (!authorization) {
      return res.status(401).json({ code: 101, msg: "Please provide Token" })
   }

   var token = authorization.split(' ')[1]

   if (!token) {
      return res.status(401).json({ code: 101, msg: "Invalid Token" })
   }

   jwt.verify(token, process.env.SECRET, (err, data) => {
      if (err) {
         return res.status(401).json({ code: 101, msg: "Invalid or Expired Token" })
      }

      req.session.user = data
      next()
   })
}