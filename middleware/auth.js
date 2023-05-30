const jwt = require('jsonwebtoken')
const verifyToken = (req, res, next) => {
    let token = req.body.token || req.query.token || req.headers["authorization"] || req.headers.token
    if (!token) {
        return res.status(403).send("Token is required for authentication")
    }

    try {
        token = token.replace(/^Bearer\s+/, "")
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        req.user = decoded
    } catch (err) {
        console.log(err)
        return res.status(403).send("Invalid Token")
    }

    return next()
}

module.exports = verifyToken