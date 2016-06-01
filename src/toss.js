var Tosser = require('tosser');
var tosser = new Tosser();
tosser.broadcast('userAction', {id: 'this is a custom object', key: 'value'}, function (ackd) {
  console.log('Ack response', ackd)
});
