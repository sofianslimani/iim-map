(function ($) {
  var socket = io.connect('http://localhost:3000');

  // ROOMS PART ----------------------------------------------------------------

  let intervalUpdateRooms = null;

  // SELECT ROOM
  function selectRoom(id) {
    toggleRoomPopup(false);
    socket.emit('selectRoom', id);
  }

  function createUpdateRoomsInterval() {
    if (intervalUpdateRooms) clearInterval(intervalUpdateRooms);
    socket.emit('getRooms');
    return setInterval(() => {
      socket.emit('getRooms');
    }, 2000);
  }

  intervalUpdateRooms = createUpdateRoomsInterval();

  socket.on('initRooms', (newRooms) => {
    rooms = newRooms;

    printRooms();

    const roomsChildren = document.querySelector('#rooms__list').children;
    Object.values(roomsChildren).forEach((li) => {
      li.addEventListener('click', (e) => {
        const roomId = parseInt(e.target.dataset.room);
        selectRoom(roomId);
      });
    });
  });

  const roomChangeHtml = document.querySelector('#room__change');
  roomChangeHtml.addEventListener('click', (e) => {
    if (ownerId !== -1 && currentRoomId !== -1)
      socket.emit('removeUser', ownerId, currentRoomId);
    if (leftTimeInterval) clearInterval(leftTimeInterval);
    e.preventDefault();
    socket.emit('getRooms');
    toggleRoomPopup(true);
    users.list = [];
    printUsers();
  });

  const roomAddHtml = document.querySelector('#rooms__add');
  roomAddHtml.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('newRoom');
  });

  // MAP PART ------------------------------------------------------------------

  const chatCommands = {
    setMiam,
  };

  function initData() {
    toggleLoginPopup(true);

    initMap();

    map
      .locate({
        setView: true,
        enableHighAccuracy: true,
      })
      .on('locationfound', (e) => {
        loginCoordsHtml.value = `${e.latlng.lat};${e.latlng.lng}`;
      });

    // SETUP POSITION SELECTOR LOGIN
    map.on('click', (e) => {
      if (chooseMapPosition) {
        toggleMapFullScreen(false);
        loginCoordsHtml.value = `${e.latlng.lat};${e.latlng.lng}`;
      }
    });

    // ON DRAG ARRIVAL MARKER
    arrival.marker.on('drag', () => {
      const newPosition = {
        lat: arrival.marker._latlng.lat,
        lng: arrival.marker._latlng.lng,
      };

      updateArrival(newPosition);
      socket.emit('dragArrival', newPosition);
    });
  }

  $('#loginform').submit((event) => {
    event.preventDefault();

    const name = $('#name').val();
    const coords = $('#login__coords').val().split(';');

    if (!name || !coords)
      return console.log('error: Merci de remplir tous les champs');

    if (users.list.find((user) => user.name === name))
      return console.log('error: Ce nom est déjà utilisé');

    const user = {
      id: users.list.length,
      name: name,
      restaurant: parseInt($('#login__restaurant').val()),
      position: {
        lat: parseFloat(coords[0]),
        lng: parseFloat(coords[1]),
      },
    };

    addUser(user, true);

    toggleLoginPopup(false);

    socket.emit('login', user);

    leftTimeInterval = startLeftTimeInterval(5);
  });

  $('#form__message').submit((event) => {
    event.preventDefault();

    const message = $('#chat__message').val();

    const isCommand = message.charAt(0) === '/';

    let data = null;

    if (isCommand) {
      const command = message.substring(1);
      const args = command.split(' ');
      const params = {
        function: args[0].toLowerCase(),
        value: args[1],
      };

      const functionName = Object.keys(chatCommands).find(
        (key) => key.toLowerCase() === params.function
      );

      if (!functionName) return console.log('error: Commande introuvable');

      chatCommands[functionName](params.value);

      data = params;
    } else {
      data = message;
      addMessage(message);
    }

    socket.emit('chat', data, isCommand);

    $('#chat__message').val('');
  });

  socket.on('initData', (users, roomId) => {
    currentRoomId = roomId;
    printRoomName();

    initData();

    addUsers(users);
  });

  socket.on('addUser', (user) => {
    if (map) addUser(user);
  });

  socket.on('removeUser', (userId, roomId) => {
    if (currentRoomId === roomId && map) removeUser(userId);
  });

  socket.on('updateArrival', (position) => {
    updateArrival(position, true);
  });

  socket.on('sendCommand', (params) => {
    const functionName = Object.keys(chatCommands).find(
      (key) => key.toLowerCase() === params.function
    );
    chatCommands[functionName](params.value);
  });

  socket.on('sendMessage', (message) => {
    addMessage(message);
  });

  socket.on('updateUserPosition', (id, position) => {
    updateUserPosition(id, position);
  });
})(jQuery);
