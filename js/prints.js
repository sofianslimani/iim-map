// PRINT ROOMS
const roomsListHtml = document.querySelector('#rooms__list');
function printRooms() {
  roomsListHtml.innerHTML = '';
  Object.values(rooms).forEach((room, index) => {
    roomsListHtml.innerHTML += `<li class="rooms__list__item" data-room="${index}"">
      ROOM ${index} - ${room.users.length} personne(s)
    </li>`;
  });
}

// TOGGLE ROOMS POPUP
const roomsHtml = document.querySelector('#rooms');
function toggleRoomPopup(toggle) {
  roomsHtml.style.display = toggle ? 'block' : 'none';
}

printRooms();

// PRINT ROOM NAME
const roomNameHtml = document.querySelector('#room__name');
function printRoomName() {
  roomNameHtml.innerHTML = `ROOM ${currentRoomId}`;
}

// PRINT RESTAURANTS LIST
const restaurantListHtml = document.querySelector('.restaurants__list');
function printRestaurants() {
  restaurantListHtml.innerHTML = '';
  restaurants.forEach((restaurant) => {
    restaurantListHtml.innerHTML += `<li class="restaurants__list__item">
      <div class="restaurants__list__item__image">
        <img
          src="${restaurant.img}"
          alt=""
        />
      </div>

      <div class="restaurants__list__item__content">
        <div class="restaurants__list__item__name">
          <h3>${restaurant.name}</h3>
        </div>
        <div class="restaurants__list__item__address">Address 1</div>
        <div class="restaurants__list__item__phone">Phone 1</div>
        <div class="restaurants__list__item__website">Website 1</div>
      </div>
    </li>`;
  });
}

printRestaurants();

// PRINT USERS LIST
const usersListHtml = document.querySelector('.users__list');
function printUsers() {
  usersListHtml.innerHTML = '';
  users.list.forEach((user, index) => {
    const isOwner = ownerId === index;
    usersListHtml.innerHTML += `<li class="users__list__item ${
      isOwner ? 'owner' : ''
    }" onClick="printMapInformations(getInformationsToLunch(${index}), ${index});">
      ${isOwner ? 'Vous: ' : ''} ${user.name}
    </li>`;
  });
}

printUsers();

// PRINT MAP INFOS AND LEGEND
const mapInformationsHtml = document.querySelector('#map__informations');
function printMapInformations(data, index = -1) {
  if (index !== -1) selectedUserIndex = index;

  mapInformationsHtml.innerHTML = `miam -> ${getMiam().toLocaleDateString(
    'fr-fr',
    {
      day: 'numeric',
      year: 'numeric',
      month: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }
  )} : ${data.name} doit partir -> ${data.timeOut.toLocaleDateString('fr-fr', {
    day: 'numeric',
    year: 'numeric',
    month: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })}`;
}

// INIT LOGIN POPUP SELECT
const loginSelectRestaurant = document.querySelector('#login__restaurant');
function initLoginPopup() {
  restaurants.forEach((restaurant, index) => {
    loginSelectRestaurant.innerHTML += `<option value="${index}">${restaurant.name}</option>`;
  });
}

initLoginPopup();

// TOGGLE MAP FULLSCREEN MARKER SELECTOR
const mapHtml = document.querySelector('#map');
function toggleMapFullScreen(toggle = true) {
  arrival.marker.dragging._draggable._enabled = !toggle;
  chooseMapPosition = toggle;
  map.invalidateSize();
  mapHtml.classList.toggle('fullscreen', toggle);
}

// TOGGLE LOGIN POPUP
const loginPopupHtml = document.querySelector('#login');
const overlayHtml = document.querySelector('.overlay');
function toggleLoginPopup(toggle) {
  loginPopupHtml.style.display = toggle ? 'block' : 'none';
  overlayHtml.style.display = toggle ? 'block' : 'none';
}

// ADD MESSAGE TO CHAT
const messageBoxHtml = document.querySelector('#messages__box');
function addMessage(message) {
  messageBoxHtml.innerHTML += `<li>${message}</li>`;
}
