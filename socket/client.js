(function ($) {
  var socket = io.connect('http://localhost:3000');

  $('#loginform').submit(function (event) {
    event.preventDefault();

    const name = $('#name').val();
    const coords = $('#login__coords').val();

    if (!name || !coords)
      return console.log('Merci de remplir tous les champs');

    addUser({
      name: name,
      restaurant: parseInt($('#login__restaurant').val()),
      position: {
        lat: parseFloat(coords.split(';')[0]),
        lng: parseFloat(coords.split(';')[1]),
      },
    });

    toggleLoginPopup(false);

    /*socket.emit('login', persons.list);*/

    console.log('login', users.list);
  });
})(jQuery);
