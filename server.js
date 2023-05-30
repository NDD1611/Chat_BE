
const express = require('express')
const http = require('http')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const socketServer = require('./socketServer')
const authRoutes = require('./routes/authRoutes')
const friendInvitationRouters = require('./routes/friendInvitationRouters')

const PORT = process.env.PORT || process.env.API_PORT

const app = express()
app.use(express.json())
app.use(cors())

// register, login
app.use('/api/auth', authRoutes)
app.use('/api/friend-invitation', friendInvitationRouters)

const server = http.createServer(app)
socketServer.registerSocketServer(server)

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        server.listen(PORT, () => {
            console.log('Server is listening on ' + PORT)
        })
    })
    .catch((err) => {
        console.log("Connect database failed. Server not start")
        console.error(err)
    })