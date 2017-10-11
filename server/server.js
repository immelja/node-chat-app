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

    socket.emit('newEmail',{
        from: 'jaap@kan',
        text: 'bla bla bluh'
    })
    socket.on('disconnect', () => {
        console.log('client disconnected')
    })

    socket.on('createEmail',(email) => {
        console.log(email)
    })
})

app.use(express.static(publicPath))

server.listen(port, () => {
    console.log(`running on port ${port}`)
})