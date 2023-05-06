const express = require('express')
const router = express.Router()
const controller = require('../../controllers/emailController.js')
const auth = require('../../middleware/authenticate.js')

//Count
router.get('/:email', auth, controller.unread)

//Inbox
router.get('/inbox/:email', auth, controller.inbox)

//Details
router.get('/id/:id', auth, controller.detail)

//Read
router.put('/inbox', auth, controller.read)

//Search
router.post('/search', auth, controller.search)

//Starred
router.put('/star', auth, controller.star)
router.get('/starred/:email', auth, controller.starred)

// Sent
router.post('/sent', auth, controller.sent)
router.get('/sent/:email', auth, controller.get_sent)

//Trash
router.get('/get-trash', auth, controller.get_trash)
router.put('/trash', auth, controller.trash)
router.put('/restore', auth, controller.restore)
router.delete('delete', auth, controller.delete)

module.exports = router