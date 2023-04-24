const mongoose = require("mongoose")

const emailSchema = mongoose.Schema({
   from: {
      type: String,
      required: true
   },

   to: {
      receiver: [{
         type: String,
         default: null
      }],
      cc: [{
         type: String,
         default: null
      }],
      bcc: [{
         type: String,
         default: null
      }],
   },

   content: {
      title: String,
      content: {
         type: String,
         required: true
      },
      attachment: [{
         type: String,
         default: null
      }]
   },

   starred: {
      type: Boolean,
      default: false
   },

   trash: {
      type: Boolean,
      default: false
   },

   draft: {
      type: Boolean,
   }
})

const Email = mongoose.model('Email', emailSchema)
module.exports = Email