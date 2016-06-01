var Tosser = require('tosser');
$(function () {
  var tosser = new Tosser();

  function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  tosser.on('colorChange', function (data) {
  	$('#color').html(data.color).css({'background-color': data.color});
    tosser.sendToChildren('colorChange', data, function (ackd) {
    	console.log('Sent to children:', ackd)
    })
  });

  $('button').click(function () {
  	var newColor = getRandomColor();
    $('#color').html(newColor).css({'background-color': newColor});
    tosser.sendToChildren('colorChange', { color: newColor }, function (ackd) {
      console.log('Broadcast:', ackd)
    });
  });

})
