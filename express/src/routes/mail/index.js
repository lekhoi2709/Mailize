const express = require('express')
const router = express.Router()
const controller = require('../../controllers/emailController.js')

router.get('/inbox', controller.inbox)