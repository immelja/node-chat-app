var socket = io()
socket.on('connect', function() {
  console.log('connected to server')
  // socket.emit('createMessage',{
  //     to: 'jen@joan.com',
  //     text: 'just'
  // })
})

socket.on('disconnect', function()  {
  console.log('disconnected from server')
})

socket.on('newMessage', function(msg) {
    console.log('new message',msg)
    var li = jQuery('<li></li>')
    li.text(`${msg.from}: ${msg.text}`)

    jQuery('#messages').append(li)
})

// socket.emit('createMessage', {
//   from: 'Joe',
//   text: 'greetings'
// }, function(data) {
//   console.log('server response:',data)
// })

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault()
  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function() {

  })
})