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
    var formattedTime = moment(msg.createdAt).format('h:mm a')
    var li = jQuery('<li></li>')
    li.text(`${msg.from} ${formattedTime}: ${msg.text}`)

    jQuery('#messages').append(li)
})

socket.on('newLocationMessage', function(msg) {
  console.log('new location message',msg)
  var formattedTime = moment(msg.createdAt).format('h:mm a')  
  var li = jQuery('<li></li>')
  var a = jQuery('<a target="_blank">current location</a>')
  li.text(`${msg.from} ${formattedTime}: `)
  a.attr('href', msg.url)
  li.append(a)
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

  var messageTextBox = jQuery('[name=message]')
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextBox.val()
  }, function() {
    messageTextBox.val('')
  })
})

var locationButton = jQuery("#send-location")
locationButton.on('click', function() {
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your browser')
  }
  locationButton.attr('disabled','disabled').text('Sending location...')
  navigator.geolocation.getCurrentPosition(function(position) {
    // console.log('ppp ',position)
    locationButton.removeAttr('disabled').text('Send location')
    socket.emit('createLocationMessage',{
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
  },function () {
    locationButton.removeAttr('disabled').text('Send location')   
    alert('Unable to fetch location')
  })

  // navigator.geolocation.getCurrentPosition(function (position) {
  //   socket.emit('createLocationMessage', {
  //     latitude: position.coords.latitude,
  //     longitude: position.coords.longitude
  //   });
  // }, function () {
  //   alert('Unable to fetch location.');
  // });
})