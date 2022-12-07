(function ($) {
  var socket = io.connect('http://localhost:3000');

  $('#loginform').submit(function (event) {
    event.preventDefault();

    addUser({
      name: $('#name').val(),
      restaurant: parseInt($('#login__restaurant').val()),
      position: {
        lat: parseFloat($('#login__coords').val().split(';')[0]),
        lng: parseFloat($('#login__coords').val().split(';')[1]),
      },
    });

    /*socket.emit('login', persons.list);*/

    console.log('login', persons.list);
  });
})(jQuery);
