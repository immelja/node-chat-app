const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000

const { generateMessage, generateLocationMessage } = require('./utils/message')
const { isRealString } = require('./utils/validation')
const { Users } = require('./utils/users')

console.log(__dirname + '/../public')
console.log(publicPath)

var app = express()
var server = http.createServer(app)
var io = socketIO(server)
var users = new Users()

io.on('connection', (socket) => {
    console.log('new user connected')

    // socket.emit('newMessage',{
    //     from: 'jaap@kan',
    //     text: 'bla bla bluh',
    //     createdAt: 42342342
    // })
    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and Room Name are required')
        }
        socket.join(params.room)
        users.removeUser(socket.id)
        users.addUser(socket.id, params.name, params.room)
        io.to(params.room).emit('updateUserList', users.getUserList(params.room))
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'))
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined`))
        callback()
    })
    socket.on('disconnect', () => {
        console.log('client disconnected')
        var user = users.removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room))
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} left`))
        }
    })

    socket.on('createMessage', (msg, callback) => {
        var user = users.getUser(socket.id)

        if (user && isRealString(msg.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, msg.text))
        }
        callback()
    })

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id)

        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))
        }
    })

})

app.use(express.static(publicPath))

server.listen(port, () => {
    console.log(`running on port ${port}`)
})