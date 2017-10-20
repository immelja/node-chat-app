const {Users} = require('./users');
var users = new Users()
users.users = [{
    id: '1',
    name: 'Mike',
    room: 'Node Course'
  }, {
    id: '2',
    name: 'Jen',
    room: 'React Course'
  }, {
    id: '3',
    name: 'Julie',
    room: 'Node Course'
  }]
users.addUser(1,"aa","aa")
console.log(users)