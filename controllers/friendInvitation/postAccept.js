const FriendInvitation = require('../../models/friendInvitation')
const User = require('../../models/user')
const friendUpdates = require('../../socketHandler/updates/friends')

const postAccept = async (req, res) => {
    try {
        const { id } = req.body

        const invitation = await FriendInvitation.findById(id)

        if (!invitation) {
            return res.status(401).send('Error occured. Please try again')
        }

        const { senderId, receiverId } = invitation

        // add friend to both users
        const senderUser = await User.findById(senderId)
        senderUser.friends = [...senderUser.friends, receiverId]

        const receiverUser = await User.findById(receiverId)
        receiverUser.friends = [...receiverUser.friends, senderId]

        await senderUser.save()
        await receiverUser.save()

        await FriendInvitation.findByIdAndDelete(id)

        // update list of the friend if the users are online
        friendUpdates.updateFriends(senderId.toString())
        friendUpdates.updateFriends(receiverId.toString())

        //update list of friend pending invitations
        friendUpdates.updateFriendsPendingInvitations(receiverId.toString())

        return res.status(200).send("Invitation successfully accepted")

    } catch (err) {
        console.log(err)
        return res.status(500).send("Something went wrong. Please try again")
    }
}

module.exports = postAccept;