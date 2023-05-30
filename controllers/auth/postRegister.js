
const User = require('../../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

let postRegister = async (req, res) => {
    try {
        const { username, mail, password } = req.body

        const userExist = await User.exists({ mail: mail.toLowerCase() })
        if (userExist) {
            return res.status(409).send("Email already in use.")
        }

        const encryptPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            username: username,
            mail: mail.toLowerCase(),
            password: encryptPassword
        })

        const token = jwt.sign(
            {
                userId: user._id,
                mail: user.mail
            },
            process.env.JWT_KEY,
            {
                expiresIn: "1h"
            }
        )

        return res.status(201).json({
            userDetails: {
                mail: user.mail,
                token: token,
                username: user.username
            }
        })

    } catch (err) {
        return res.status(500).send('Error occured. Please try again')
    }
}

module.exports = postRegister