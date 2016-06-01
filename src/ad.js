var Tosser = require('tosser');
$(function () {
  var tosser = new Tosser();

  setTimeout(function () {
    console.log('Taking ad action')
    tosser.sendToParent('adAction', { key: 'Whoa ad action baby' }, function (ackd) {
      console.log('Ack response, adAction', ackd)
    });
  }, 1000)

  tosser.on('appAction', function (data) {
    console.log('App took action!', data)
  })

});
