const mongoose = require("mongoose")

const sentToSchema = mongoose.Schema({
   receiver: [String],
   cc: { type: [String], default: null },
   bcc: { type: [String], default: null },
})

const contentSchema = mongoose.Schema({
   title: {
      type: String,
      default: "(no subject)"
   },
   text: String,
   attachment: { type: [String], default: null }
})

const emailSchema = mongoose.Schema({
   from: {
      type: String,
      required: true
   },

   to: sentToSchema,

   content: contentSchema,

   createAt: {
      type: Date,
      default: Date.now
   },

   starred: {
      type: Boolean,
      default: false
   },

   trash: {
      type: Boolean,
      default: false
   },

   read: {
      type: Boolean,
      default: false
   },

   draft: {
      type: Boolean,
   }
})

emailSchema.index({ '$**': "text" })

const Email = mongoose.model('Email', emailSchema)
module.exports = Email