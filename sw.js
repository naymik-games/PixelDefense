var cacheName = 'PixelDefense v0.1';
var filesToCache = [
  '/',
  '/index.html',
  '/game.js',
  '/phaser.min.js',
  '/Easystar.js',


  '/scenes/preload.js',
  '/scenes/startGame.js',
  '/scenes/sellMenu.js',
  '/scenes/towerMenu.js',
  '/scenes/waveDone.js',
  '/scenes/gameOver.js',
  '/scenes/UI.js',

  '/assets/fonts/topaz.png',
  '/assets/fonts/topaz.xml',

  '/classes/button.js',
  '/classes/settings.js',
  '/classes/towers.js',
  '/classes/enemies.js',
  '/classes/mapTest.js',

  '/assets/sprites/blank.png',
  '/assets/sprites/blocks.png',
  '/assets/sprites/bullet.png',
  '/assets/sprites/gems.png',
  '/assets/sprites/icons.png',
  '/assets/sprites/particles.png',
  '/assets/sprites/particle.png',
  '/assets/sprites/rover.png',
  '/assets/sprites/towers.png',
  '/assets/sprites/enemies.png',

  //'https://cdn.jsdelivr.net/gh/photonstorm/phaser@3.10.1/dist/phaser.min.js'
];
self.addEventListener('install', function (event) {
  console.log('sw install');
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('sw caching files');
      return cache.addAll(filesToCache);
    }).catch(function (err) {
      console.log(err);
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('sw fetch');
  console.log(event.request.url);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }).catch(function (error) {
      console.log(error);
    })
  );
});

self.addEventListener('activate', function (event) {
  console.log('sw activate');
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
          console.log('sw removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});