let gameOptions = {
  gemSize: 100,
  fallSpeed: 100,
  destroySpeed: 200,
  offsetX: 50,
  offsetY: 250,
  gameMode: 'time', //moves, challenge
  defaultTime: 60,



}


let gameSettings;
var defaultValues = {
  mostDotsMoves: 0,
  mostDotsTime: 0,
  levelStatus: [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  totalSquares: 0,
  group: 0,
  currentLevel: 0
}
onLevel = 0
let levels = [{
  numberOfWaves: 3,
  numberOfSpawnPoints: 1,
  numberOfBlocks: 30,
  waves: [{
    num: 0,
    spawnRate: 1500,
    addBlocks: 0,
    waveEnemies: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0] // ,
  },
  {
    num: 1,
    addBlocks: 20,
    spawnRate: 1400,
    waveEnemies: [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0] //
  },
  {
    num: 2,
    spawnRate: 1200,
    addBlocks: 30,
    waveEnemies: [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]//
  }
  ]
}]



let money = {
  starthealth: 5,
  health: 10, // level health
  enemyHitForHealth: 1, //when enemy crosses line 
  amount: 50, //cash
  amountOnNextWave: 10 //cash when next wave is pressed
};
let enemyTypes = [
  {
    name: 'Simple',
    hp: 50,
    reward: 5,
    speed: 1000,
    frame: 0
  },
  {
    name: 'Muscle',
    hp: 100,
    reward: 10,
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

