
const FriendInvitation = require('../../models/friendInvitation')
const friendUpdates = require('../../socketHandler/updates/friends')

const postReject = async (req, res) => {
    try {
        const { id } = req.body
        const { userId } = req.user

        //remove invitatiov from friend invitations collection
        const invitationExists = FriendInvitation.exists({ _id: id })

        if (invitationExists) {
            await FriendInvitation.findByIdAndDelete(id)
        }

        // update pending invitation list at client  
        friendUpdates.updateFriendsPendingInvitations(userId)

        return res.status(200).send("Invitation successfully rejected")

    } catch (err) {
        console.log(err)
        return res.status(500).send('Something went wrong. Please try again')
    }
}

module.exports = postReject;