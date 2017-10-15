const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const publicPath = path.join(__dirname,'../public')
const port = process.env.PORT || 3000

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

    socket.on('createMessage',(msg) => {
        console.log(msg)
        io.emit('newMessage', {
            from: msg.from,
            text: msg.text,
            createdAt: new Date().getTime()
        })
    })
})

app.use(express.static(publicPath))

server.listen(port, () => {
    console.log(`running on port ${port}`)
})