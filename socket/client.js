(function ($) {
  var socket = io.connect('http://localhost:3000');

  $('#loginform').submit((event) => {
    event.preventDefault();

    const name = $('#name').val();
    const coords = $('#login__coords').val();

    if (!name || !coords)
      return console.log('Merci de remplir tous les champs');

    const user = {
      name: name,
      restaurant: parseInt($('#login__restaurant').val()),
      position: {
        lat: parseFloat(coords.split(';')[0]),
        lng: parseFloat(coords.split(';')[1]),
      },
    };

    addUser(user);

    toggleLoginPopup(false);

    socket.emit('login', user);

    console.log('login', users.list);
  });

  $('#form__message').submit((event) => {
    event.preventDefault();

    const message = $('#chat__message').val();

    addMessage(message);

    socket.emit('chat', message);

    $('#chat__message').val('');
  });

  socket.on('addUser', (user) => {
    addUser(user);
  });

  socket.on('sendMessage', (message) => {
    addMessage(message);
  });
})(jQuery);
