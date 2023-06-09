
const authSocket = require('./middleware/authSocket')
const newConnectionHandler = require('./socketHandler/newConnectionHandler')
const disconnectHandler = require('./socketHandler/disconnectHandler')
const serverStore = require('./serverStore')
const directMessageHandler = require('./socketHandler/directMessageHandler')
const directChatHistoryHandler = require('./socketHandler/directChatHistoryHandler')

const registerSocketServer = (server) => {
    const io = require('socket.io')(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    })

    serverStore.setSocketServerInstance(io)

    io.use((socket, next) => {
        authSocket(socket, next)
    })

    const emmitOnlineUsers = () => {
        const onlineUsers = serverStore.getOnlineUsers()
        io.emit("online-users", { onlineUsers })
    }

    io.on('connection', (socket) => {
        console.log("user connect")
        console.log(socket.id)
        newConnectionHandler(socket, io)
        emmitOnlineUsers()

        socket.on('direct-message', (data) => {
            directMessageHandler(socket, data)
        })

        socket.on('direct-chat-history', (data) => {
            directChatHistoryHandler(socket, data)
        })

        socket.on('disconnect', () => {
            disconnectHandler(socket)
        })
    })

    setInterval(() => {
        emmitOnlineUsers()
    }, [1000 * 8])
}

module.exports = {
    registerSocketServer
}