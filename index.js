const lat = 48.89347;
const lon = 2.232;
let map = null;

let lunchTime = new Date(new Date().setHours(13, 0, 0));

let selectedUserIndex = 0;

const loginCoordsHtml = document.querySelector('#login__coords');

const restaurants = [
  {
    lat: 48.89676,
    lng: 2.229,
    marker: null,
    name: 'KFC',
    img: 'https://media-cdn.tripadvisor.com/media/photo-s/05/cf/59/60/kfc-jaux.jpg',
  },
  {
    lat: 48.8979,
    lng: 2.2252,
    marker: null,
    name: 'MCDonald',
    img: 'https://media.mcdonalds.fr/media/d5/28/8d/d5288d1b71c580c24bd5da511c2656251640d1ec?auto=webp',
  },
  {
    lat: 48.89433,
    lng: 2.2243,
    marker: null,
    name: 'BurgerKing',
    img: 'https://static.observatoiredelafranchise.fr/images/ckfinder/images/2020/07/17/burger-king-ext-live-7bc2e3.png',
  },
];

const users = {
  speed: 5,
  icon: {
    iconUrl: 'img/user.png',
    iconSize: [40, 50],
    iconAnchor: [25, 50],
    popupAnchor: [-3, -76],
  },
  list: [
    /* {
      name: 'Sofian',
      restaurant: 0,
      position: {
        lat: 48.89469,
        lng: 2.22916,
      },
      marker: null,
      lines: [],
      lineColor: 'red',
    },
    {
      name: 'Thomas',
      restaurant: 2,
      position: {
        lat: 48.8907,
        lng: 2.23362,
      },
      marker: null,
      lines: [],
      lineColor: 'blue',
    },
    {
      name: 'William',
      restaurant: 1,
      position: {
        lat: 48.89255,
        lng: 2.23982,
      },
      marker: null,
      lines: [],
      lineColor: 'green',
    }, */
  ],
};

let arrival = {
  lat: 48.89351,
  lng: 2.22698,
  marker: null,
  name: "Point d'arrivée",
  iconOptions: {
    draggable: true,
    icon: {
      iconUrl: 'img/red.png',
      iconSize: [40, 50],
      iconAnchor: [25, 50],
      popupAnchor: [-3, -76],
      draggable: true,
    },
  },
};

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

const usersListHtml = document.querySelector('.users__list');
function printUsers() {
  usersListHtml.innerHTML = '';
  users.list.forEach((user, index) => {
    usersListHtml.innerHTML += `<li class="users__list__item" onClick="printMapInformations(getAllInformationsToLunch()[${index}]);">
      ${user.name}
    </li>`;
  });
}

printUsers();

const mapInformationsHtml = document.querySelector('#map__informations');
function printMapInformations(data, index = -1) {
  if (index !== -1) selectedUserIndex = index;

  mapInformationsHtml.innerHTML = `miam -> ${lunchTime.toLocaleDateString(
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

// ADD USER
function addUser(user) {
  users.list.push({
    name: user.name,
    restaurant: user.restaurant,
    position: user.position,
    marker: null,
    lines: [],
    lineColor: 'blue',
  });

  createMarker({
    position: user.position,
    iconOptions: { icon: L.icon(users.icon) },
    name: user.name,
  });

  getTrajectDistance(users.list[users.list.length - 1]);
  if (users.list.length === 1)
    printMapInformations(getAllInformationsToLunch()[0]);
  printUsers();
}

function updateUsersTraject() {
  users.list.forEach((user) => {
    getTrajectDistance(user);
  });
}

// ADD MARKER
function createMarker(data) {
  const marker = L.marker(
    [data.position.lat, data.position.lng],
    data.iconOptions
  ).addTo(map);

  marker.bindPopup(data.name);

  return marker;
}

// GET DISTANCE (en Km)
function getDistance(A, B) {
  const R = 6371e3;
  const φ1 = (A.lat * Math.PI) / 180;
  const φ2 = (B.lat * Math.PI) / 180;
  const Δφ = ((B.lat - A.lat) * Math.PI) / 180;
  const Δλ = ((B.lng - A.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return (R * c) / 1000;
}

function getTrajectDistance(user) {
  const restaurant = restaurants[user.restaurant];

  user.lines.forEach((line) => {
    line.remove();
  });

  user.lines = [];

  user.lines.push(
    L.polyline([user.position, restaurant], {
      color: user.lineColor,
    }).addTo(map)
  );

  user.lines.push(
    L.polyline([restaurant, arrival], { color: user.lineColor }).addTo(map)
  );

  return (
    getDistance(user.position, restaurant) + getDistance(restaurant, arrival)
  );
}

function getTrajectTime(user) {
  return getTrajectDistance(user) / users.speed;
}

// GET ALL TIMEOUT
function getAllInformationsToLunch() {
  const timesOut = [];
  users.list.forEach((user) => {
    timesOut.push({
      name: user.name,
      distance: getTrajectDistance(user),
      time: getTrajectTime(user),
      timeOut: new Date(
        lunchTime.getTime() - 1000 * (60 * (getTrajectTime(user) * 100))
      ),
    });
  });

  return timesOut;
}

// INIT MAP
function initMap() {
  map = L.map('map').setView([lat, lon], 15);

  L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
    minZoom: 1,
    maxZoom: 20,
  }).addTo(map);

  Object.values(restaurants).forEach((restaurant) => {
    restaurant.marker = createMarker({
      position: {
        lat: restaurant.lat,
        lng: restaurant.lng,
      },
      name: restaurant.name,
    });
  });

  users.list.forEach((user) => {
    user.marker = createMarker({
      position: user.position,
      iconOptions: { icon: L.icon(users.icon) },
      name: user.name,
    });
  });

  arrival.marker = createMarker({
    position: {
      lat: arrival.lat,
      lng: arrival.lng,
    },
    iconOptions: {
      ...arrival.iconOptions,
      icon: L.icon(arrival.iconOptions.icon),
    },
    name: arrival.name,
  });

  // ON DRAG ARRIVAL MARKER
  arrival.marker.on('drag', () => {
    arrival.lat = arrival.marker._latlng.lat;
    arrival.lng = arrival.marker._latlng.lng;
    updateUsersTraject();
    if (selectedUserIndex !== -1)
      printMapInformations(getAllInformationsToLunch()[selectedUserIndex]);
  });

  map.on('click', (e) => {
    if (chooseMapPosition) {
      toggleMapFullScreen(false);
      loginCoordsHtml.value = `${e.latlng.lat};${e.latlng.lng}`;
    }
  });
}

const loginSelectRestaurant = document.querySelector('#login__restaurant');
function initLoginPopup() {
  restaurants.forEach((restaurant, index) => {
    loginSelectRestaurant.innerHTML += `<option value="${index}">${restaurant.name}</option>`;
  });
}

initLoginPopup();
let chooseMapPosition = false;

const mapHtml = document.querySelector('#map');
function toggleMapFullScreen(toggle = true) {
  arrival.marker.dragging._draggable._enabled = !toggle;
  chooseMapPosition = toggle;
  map.invalidateSize();
  mapHtml.classList.toggle('fullscreen', toggle);
}

const loginPopupHtml = document.querySelector('#login');
const overlayHtml = document.querySelector('.overlay');
function toggleLoginPopup(toggle) {
  console.log(toggle ? 'block' : 'none');
  loginPopupHtml.style.display = toggle ? 'block' : 'none';
  overlayHtml.style.display = toggle ? 'block' : 'none';
}

window.onload = function () {
  initMap();
};
