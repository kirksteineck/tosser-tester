var Tosser = require('tosser');
$(function () {
  var tosser = new Tosser();

  tosser.on('colorChange', function (data) {
  	$('#color').html(data.color).css({'background-color': data.color});
    tosser.sendToChildren('colorChange', data, function (ackd) {
    	console.log('Sent to children:', ackd)
    })
  });

})
