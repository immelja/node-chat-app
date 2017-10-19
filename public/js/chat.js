var socket = io()

function scrollToBottom() {
  //selectors
  var messages = jQuery('#messages')
  var newMessage = messages.children('li:last-child')
  //heights
  var clientHeight = messages.prop('clientHeight')
  var scrollTop = messages.prop('scrollTop')
  var scrollHeight = messages.prop('scrollHeight')
  var newMessageHeight = newMessage.innerHeight()
  var lastMessageHeight = newMessage.prev().innerHeight()
  console.log(clientHeight,scrollTop,scrollHeight,newMessageHeight)
  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    console.log('should scroll')
    messages.scrollTop(scrollHeight)
  }
}
socket.on('connect', function() {
  console.log('connected to server')
  var params = jQuery.deparam(window.location.search)
  socket.emit('join',params, function(err) {
    if (err) {
      alert(err)
      window.location.href = '/'
    } else {
      console.log('no error')
    }
  })  
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
  var template = jQuery('#message-template').html()
  var html = Mustache.render(template, {
    text: msg.text,
    from: msg.from,
    createdAt: formattedTime
  })

  jQuery('#messages').append(html)
  scrollToBottom()
    // var li = jQuery('<li></li>')
    // li.text(`${msg.from} ${formattedTime}: ${msg.text}`)

    // jQuery('#messages').append(li)
})

socket.on('newLocationMessage', function(msg) {
  var formattedTime = moment(msg.createdAt).format('h:mm a') 
  var template = jQuery('#location-message-template').html()
  var html = Mustache.render(template, {
    url: msg.url,
    from: msg.from,
    createdAt: formattedTime
  })
  jQuery('#messages').append(html)
  scrollToBottom()

  // var li = jQuery('<li></li>')
  // var a = jQuery('<a target="_blank">current location</a>')
  // li.text(`${msg.from} ${formattedTime}: `)
  // a.attr('href', msg.url)
  // li.append(a)
  // jQuery('#messages').append(li)
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