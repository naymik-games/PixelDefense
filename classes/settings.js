

let gameData;
var defaultValues = {
  onLevel: 0,
  onWave: 0,
  playerData: null,
  map: null,
  levelsComplete: []
}



onLevel = 0
let levels = [{
  numberOfWaves: 3,
  numberOfSpawnPoints: 1,
  numberOfBlocks: 30,
  enemyHitForHealth: 1,
  customMap: false,
  map: [[4, 2, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [4, 4, 4, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 0, 0, 0, 0]],
  waves: [{
    num: 0,
    spawnRate: 1500,
    addBlocks: 0,
    waveEnemies: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0] // ,
  },
  {
    num: 1,
    addBlocks: 10,
    spawnRate: 1400,
    waveEnemies: [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0] //
  },
  {
    num: 2,
    spawnRate: 1200,
    addBlocks: 10,
    waveEnemies: [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]//
  }
  ]
}]



let money = {

  health: 10, // level health

  amount: 50, //cash

};
let enemyTypes = [
  {
    name: 'Simple',
    hp: 50,
    reward: 1,
    speed: 1000,
    frame: 0
  },
  {
    name: 'Muscle',
    hp: 100,
    reward: 2,
    speed: 1200,
    frame: 1
  }
]
let towers = [
  {
    radius: 1,
    frameNum: 0,
    fireRate: 1000,
    name: 'Tower 1',
    cost: 20,
    power: 10,
    sellAmount: 5,
    bulletSpeed: 700
  },
  {
    radius: 2,
    frameNum: 1,
    fireRate: 800,
    name: 'Tower 2',
    cost: 30,
    power: 20,
    sellAmount: 15,
    bulletSpeed: 1000

  },
  {
    radius: 3,
    frameNum: 2,
    fireRate: 700,
    name: 'Tower 3',
    cost: 60,
    power: 30,
    sellAmount: 25,
    bulletSpeed: 1500

  }
]

