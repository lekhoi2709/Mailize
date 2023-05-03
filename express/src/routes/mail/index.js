const express = require('express')
const router = express.Router()
const controller = require('../../controllers/emailController.js')
const auth = require('../../middleware/authenticate.js')

router.get('/inbox', auth, controller.inbox)
router.post('/sent', auth, controller.sent)

module.exports = router