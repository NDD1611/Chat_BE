
const User = require('../../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

let postLogin = async (req, res) => {
    try {
        const { mail, password } = req.body
        const user = await User.findOne({ mail: mail.toLowerCase() })

        if (user) {
            var check = await bcrypt.compare(password, user.password)
            if (check) {
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

                return res.status(200).json({
                    userDetails: {
                        mail: user.mail,
                        token: token,
                        username: user.username
                    }
                })
            }
        }

        return res.status(400).send('Inalid credentials. Please try again.')
    } catch (err) {
        return res.status(500).send("Server error. Please try again.")
    }
}

module.exports = postLogin