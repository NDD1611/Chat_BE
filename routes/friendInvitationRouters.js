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
const inviteDecisionSchema = Joi.object({
    id: Joi.string().required(),
})


router.post('/invite',
    auth,
    validator.body(postFriendInvitationSchema),
    friendInvitationController.controllers.postInvite
)

router.post('/accept',
    auth,
    validator.body(inviteDecisionSchema),
    friendInvitationController.controllers.postAccept
)

router.post('/reject',
    auth,
    validator.body(inviteDecisionSchema),
    friendInvitationController.controllers.postReject
)

module.exports = router