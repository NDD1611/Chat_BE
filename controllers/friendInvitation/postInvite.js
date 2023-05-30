const User = require('../../models/user')
const FriendInvitation = require('../../models/friendInvitation')
const friendsUpdates = require('../../socketHandler/updates/friends')

const postInvite = async (req, res) => {
    const { targetMailAddress } = req.body

    const { userId, mail } = req.user

    if (targetMailAddress.toLowerCase() === mail.toLowerCase()) {
        return res.status(409).send('Sorry. You  can not become friend with yourself')
    }

    const targetUser = await User.findOne({
        mail: targetMailAddress.toLowerCase()
    })
    if (!targetUser) {
        return res.status(404).send(`Friend of ${targetMailAddress} have not been found. Please check mail address.`)
    }

    const invitationAlreadyReceived = await FriendInvitation.findOne({
        senderId: userId,
        receiverId: targetUser._id,
    })
    if (invitationAlreadyReceived) {
        return res.status(409).send('Invitation has been already sent')
    }

    const usersAlreadyFriends = targetUser.friends.find((friendId) => {
        return friendId.toString() === userId.toString()
    })
    if (usersAlreadyFriends) {
        return res.status(409).send('Friend already added. Please check friend list.')
    }

    const newInvitation = await FriendInvitation.create({
        senderId: userId,
        receiverId: targetUser._id
    })


    friendsUpdates.updateFriendsPendingInvitations(targetUser._id.toString())

    return res.status(200).send('Initation has been sent')
}

module.exports = postInvite