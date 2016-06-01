tosser.broadcast('userAction', {id: 'this is a custom object', key: 'value'}, function (ackd) {
  console.log('Ack response', ackd)
});