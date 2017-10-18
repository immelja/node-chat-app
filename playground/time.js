var moment = require('moment')
var date = new Date()
console.log(date.getDay())
console.log(date.getMonth())
console.log(date.getYear())
console.log(date.getFullYear())

var date = moment()
console.log(date)
console.log(date.format('h:mm a'))
console.log(moment().format('MMMM Do YYYY, h:mm:ss a'))
console.log(moment(2000).format('MMMM Do YYYY, h:mm:ss a'))
console.log(moment("19751017", "YYYYMMDD").fromNow())