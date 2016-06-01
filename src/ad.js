require('jquery');
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
    tosser.broadcast('colorChange', { color: getRandomColor() }, function (ackd) {
      console.log('Brodcast from child:', ackd);
    });
  });

  tosser.on('colorChange', function (data) {
    console.log('sdf')
    $('body').css({'background-color': data.color})
  });

});
