const lat = 48.89347;
const lon = 2.232;
let map = null;

let lunchTime = new Date(new Date().setHours(13, 0, 0));

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

const persons = {
  speed: 5,
  icon: {
    iconUrl: 'img/person.png',
    iconSize: [40, 50],
    iconAnchor: [25, 50],
    popupAnchor: [-3, -76],
  },
  list: [
    {
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
    },
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

const mapInformationsHtml = document.querySelector('#map__informations');
function printMapInformations(data) {
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

function getTrajectDistance(person) {
  const restaurant = restaurants[person.restaurant];

  person.lines.forEach((line) => {
    line.remove();
  });

  person.lines = [];

  person.lines.push(
    L.polyline([person.position, restaurant], {
      color: person.lineColor,
    }).addTo(map)
  );

  person.lines.push(
    L.polyline([restaurant, arrival], { color: person.lineColor }).addTo(map)
  );

  return (
    getDistance(person.position, restaurant) + getDistance(restaurant, arrival)
  );
}

function getTrajectTime(person) {
  return getTrajectDistance(person) / persons.speed;
}

// GET ALL TIMEOUT
function getAllInformationsToLunch() {
  const timesOut = [];
  persons.list.forEach((person) => {
    timesOut.push({
      name: person.name,
      distance: getTrajectDistance(person),
      time: getTrajectTime(person),
      timeOut: new Date(
        lunchTime.getTime() - 1000 * (60 * (getTrajectTime(person) * 100))
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
    restaurant.marker = L.marker([restaurant.lat, restaurant.lng]).addTo(map);

    restaurant.marker.bindPopup(restaurant.name);
  });

  persons.list.forEach((person) => {
    person.marker = L.marker([person.position.lat, person.position.lng], {
      icon: L.icon(persons.icon),
    }).addTo(map);

    person.marker.bindPopup(person.name);
  });

  arrival.iconOptions.icon = L.icon(arrival.iconOptions.icon);
  arrival.marker = L.marker(
    [arrival.lat, arrival.lng],
    arrival.iconOptions
  ).addTo(map);
  arrival.marker.bindPopup(arrival.name);

  // ON DRAG ARRIVAL MARKER
  arrival.marker.on('drag', function () {
    arrival.lat = arrival.marker._latlng.lat;
    arrival.lng = arrival.marker._latlng.lng;
    printMapInformations(getAllInformationsToLunch()[1]);
  });

  map.on('click', function (e) {
    if (chooseMapPosition) toggleMapFullScreen(false);
    // console.log('Lat, Lon : ' + e.latlng.lat + ', ' + e.latlng.lng);
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
  chooseMapPosition = toggle;
  mapHtml.classList.toggle('fullscreen', toggle);
}

window.onload = function () {
  initMap();

  printMapInformations(getAllInformationsToLunch()[1]);

  //console.log(getDistance(persons.list[0].position, restaurants[0]));
  //console.log(getDistance(persons.list[0].position, arrival.marker._latlng));
};
