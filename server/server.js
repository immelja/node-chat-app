const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const publicPath = path.join(__dirname,'../public')
const port = process.env.PORT || 3000

const {generateMessage,generateLocationMessage} = require('./utils/message')

console.log(__dirname + '/../public')
console.log(publicPath)

var app = express()
var server = http.createServer(app)
var io = socketIO(server)

io.on('connection', (socket) => {
    console.log('new user connected')

    // socket.emit('newMessage',{
    //     from: 'jaap@kan',
    //     text: 'bla bla bluh',
    //     createdAt: 42342342
    // })
    socket.on('disconnect', () => {
        console.log('client disconnected')
    })

    socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'))

    socket.broadcast.emit('newMessage', generateMessage('Admin','New user joined'))

    socket.on('createMessage',(msg,callback) => {
        console.log(msg)
        io.emit('newMessage', generateMessage(msg.from,msg.text))
        callback()
    })

    socket.on('createLocationMessage', (coords) => {
        console.log('new location msg')
        io.emit('newLocationMessage', generateLocationMessage('Admin',coords.latitude, coords.longitude))
    })
    
})

app.use(express.static(publicPath))

server.listen(port, () => {
    console.log(`running on port ${port}`)
})