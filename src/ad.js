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

  $('button').click(function () {
    console.log('Changing color')
    tosser.sendToParent('colorChange', { color: getRandomColor() }, function (ackd) {
      console.log('Broadcast:', ackd)
    });
  });

  tosser.on('colorChange', function (data) {
    $('body').css({'background-color': data.color})
  });

});
