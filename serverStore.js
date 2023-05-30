const connectedUsers = new Map()

let io = null;

const setSocketServerInstance = (ioInstance) => {
    io = ioInstance
}

const getSocketServerInstance = () => {
    return io
}

const addNewConnectedUser = ({ socketId, userId }) => {
    connectedUsers.set(socketId, { userId })
    console.log("add connect new user")
    console.log(connectedUsers)
}

const removeConnectedUser = (socketId) => {
    if (connectedUsers.has(socketId)) {
        connectedUsers.delete(socketId)
        console.log("delete connect user")
        console.log(connectedUsers)
    }
}

const getActiveConnections = (userId) => {
    const activeConnections = []
    connectedUsers.forEach((value, key) => {
        if (value.userId === userId)
            activeConnections.push(key)
    })
    return activeConnections
}

module.exports = {
    addNewConnectedUser,
    removeConnectedUser,
    getActiveConnections,
    setSocketServerInstance,
    getSocketServerInstance
}