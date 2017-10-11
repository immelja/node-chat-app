var socket = io()
socket.on('connect', function() {
  console.log('connected to server')
  socket.emit('createMessage',{
      to: 'jen@joan.com',
      text: 'just'
  })
})

socket.on('disconnect', function()  {
  console.log('disconnected from server')
})

socket.on('newMessage', function(email) {
    console.log('new message',email)
})