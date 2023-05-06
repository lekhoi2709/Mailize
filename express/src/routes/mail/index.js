const express = require('express')
const router = express.Router()
const controller = require('../../controllers/emailController.js')
const auth = require('../../middleware/authenticate.js')

//Inbox
router.post('/inbox', auth, controller.inbox)

//Read
router.put('/inbox', auth, controller.read)

//Search
router.post('/search', auth, controller.search)

// Sent
router.post('/sent', auth, controller.sent)

module.exports = router