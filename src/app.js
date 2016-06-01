var Tosser = require('tosser');
$(function () {
  var tosser = new Tosser();

  setTimeout(function () {
    console.log('Taking app action')
    tosser.sendToChildren('appAction', {id: 'this is a custom object', key: 'value'}, function (ackd) {
      console.log('Ack response, appAction', ackd)
    });
  }, 1000)

  tosser.on('adAction', function (data) {
    console.log('Ad took action!', data)
  })
})
