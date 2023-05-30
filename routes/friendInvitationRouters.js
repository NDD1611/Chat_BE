const express = require('express')
const router = express.Router()
const authControllers = require('../controllers/auth/authControllers')
const Joi = require('joi')
const validator = require('express-joi-validation').createValidator({})
const auth = require('../middleware/auth')
const friendInvitationController = require('../controllers/friendInvitation/friendInvitationControllers')

const postFriendInvitationSchema = Joi.object({
    targetMailAddress: Joi.string().email()
})


router.post('/invite',
    auth,
    validator.body(postFriendInvitationSchema),
    friendInvitationController.controllers.postInvite
)


module.exports = router