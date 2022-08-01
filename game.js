let game;
let offset
let cellSize
let finder
let path;
let enemies;
let bullets;
let towerAtLocation;
var turrets;
let blocks
var currentGame

var d = new Date();
let neighborDirections = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]]
//grid types
const BLANK = 0
const BLOCK = 1
const SPAWN = 2
const END = 3
const NOTOWER = 4
const TOWERBASE = 5
const TOWERUPBASE = 11

let spawnPoints
let endPoints
let spawnAlt

window.onload = function () {
  let gameConfig = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "thegame",
      width: 900,
      height: 1640
    },
    physics: {
      default: 'arcade'
    },
    pixelArt: true,
    scene: [preloadGame, startGame, playGame, UI, towerMenu, sellMenu, waveDone, gameOver]
  }
  game = new Phaser.Game(gameConfig);
  window.focus();
}
/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////
class playGame extends Phaser.Scene {
  constructor() {
    super("playGame");
  }
  preload() {


  }
  create() {
    //resets
    spawnPoints = []
    endPoints = []
    spawnAlt = 0




    if (load == 'new') {
      this.onWave = 0
    } else {
      if (gameMode == 'levels') {
        this.onWave = gameData.onWave
      } else {
        this.onWave = gameDataEndless.onWave
      }

    }



    enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
    turrets = this.physics.add.group({ runChildUpdate: true });
    bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
    blocks = this.physics.add.group();

    if (gameMode == 'levels') {
      this.level = levels[onLevel]
    } else {
      if (load == 'new') {

        this.level = endlessLevel

        var enemyList = this.createWave()

        var delays = [800, 900, 1000, 1100, 1200, 1300, 1400, 1500]
        var spawnDelay = delays[Phaser.Math.Between(0, delays.length - 1)]

        this.level.waves.push({
          spawnRate: spawnDelay,
          addBlocks: 0,
          waveEnemies: enemyList
        })
      } else {
        this.level = gameDataEndless.savedLevel
      }



    }



    this.killedInWave = 0
    this.landed = 0
    this.launchNum = 0


    this.cameras.main.setBackgroundColor(0x000000);
    this.UI = this.scene.get('UI');
    var graphics = this.add.graphics();
    this.cols = 14
    cellSize = game.config.width / this.cols

    offset = cellSize / 2
    this.rows = 22
    // this.rows = Math.floor(game.config.height / cellSize)
    // this.cols = Math.floor(game.config.width / cellSize)


    //this.drawLines(graphics, this.rows, this.cols);

    if (load == 'new') {
      money.amount = this.level.startAmount
      money.health = this.level.startHealth
      //preset map
      if (this.level.customMap) {
        this.map = this.level.map
        for (let y = 0; y < this.map.length; y++) {

          for (let x = 0; x < this.map[0].length; x++) {
            if (this.map[y][x] == 1) {
              var block = this.add.image(offset + x * cellSize, offset + y * cellSize, 'block', 0)
              blocks.add(block)
            }
          }

        }
      } else {
        //else choose random map. One is just blocks, other is rooms
        var mapType = Phaser.Math.Between(0, 5)
        if (mapType < 4) {
          this.map = []
          for (let y = 0; y < this.rows; y++) {
            var temp = []
            for (let x = 0; x < this.cols; x++) {
              temp.push(0)
            }
            this.map.push(temp)
          }

          this.placeRandomBlocks(this.level.numberOfBlocks)
        } else {
          var map = new Rooms(22, 14, 3, 5, 13)
          this.map = map.dungeon

          for (let y = 0; y < this.map.length; y++) {

            for (let x = 0; x < this.map[0].length; x++) {
              if (this.map[y][x] == 1) {
                var block = this.add.image(offset + x * cellSize, offset + y * cellSize, 'block', 0)
                blocks.add(block)
              }
            }

          }
        }
        /*       */

      }


      this.placeSpawnPoint(this.level.numberOfSpawnPoints)
      this.placeEndPoint(1)
    } else {
      if (gameMode == 'levels') {
        money = gameData.playerData
        this.map = gameData.map
        this.loadMap()
      } else {
        money = gameDataEndless.playerData
        this.map = gameDataEndless.map
        this.loadMap()
      }

      // this.loadTowers()
    }


    /*  this.map = []
     for (let y = 0; y < this.rows; y++) {
       var temp = []
       for (let x = 0; x < this.cols; x++) {
         temp.push(0)
       }
       this.map.push(temp)
     }
 
     this.placeSpawnPoint(this.level.numberOfSpawnPoints)
     this.placeEndPoint(1)
     this.placeRandomBlocks(this.level.numberOfBlocks) */
    // console.log(this.map)

    finder = new EasyStar.js();
    finder.setGrid(this.map)
    finder.setAcceptableTiles([0, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16, 17, 18, 19, 20, 23, 24, 25, 26])

    finder.setTileCost(5, 5);
    finder.setTileCost(6, 5);
    finder.setTileCost(7, 5);
    finder.setTileCost(8, 5);
    finder.setTileCost(9, 5);
    finder.setTileCost(10, 5);
    finder.setTileCost(11, 5);
    finder.setTileCost(12, 5);

    finder.setTileCost(16, 8);
    finder.setTileCost(17, 8);
    finder.setTileCost(18, 8);
    finder.setTileCost(19, 8);
    finder.setTileCost(20, 8);
    finder.setTileCost(21, 8);
    finder.setTileCost(22, 8);
    finder.setTileCost(23, 8);
    /* this.healthText = this.add.bitmapText(85, 1550, 'topaz', money.health, 80).setOrigin(.5).setTint(0xcbf7ff).setAlpha(1);
    this.moneyText = this.add.bitmapText(385, 1550, 'topaz', money.amount, 80).setOrigin(.5).setTint(0xcbf7ff).setAlpha(1); */

    this.input.on('pointerdown', this.clickMenu, this);


    this.physics.add.overlap(enemies, bullets, this.damageEnemy, null, this);
    this.physics.add.overlap(blocks, bullets, this.removeBullet, null, this);
    this.physics.add.overlap(turrets, enemies, this.damageTurret, null, this);
    /* this.input.on("pointerdown", this.gemSelect, this);
     this.input.on("pointermove", this.drawPath, this);
     this.input.on("pointerup", this.removeGems, this);
    */
    //this.check = this.add.image(725, 1000, 'check').setScale(.7);

  }
  startWave() {
    // console.log(Date.now())


    var timer = this.time.addEvent({
      delay: this.level.waves[this.onWave].spawnRate,                // ms
      callback: function () {
        var enemy = enemies.get();
        if (enemy) {
          enemy.setType(enemyTypes[this.level.waves[this.onWave].waveEnemies[this.launchNum]], this.onWave)

          enemy.setActive(true);
          enemy.setVisible(true);
          enemy.startOnPath(this);

        }
        this.launchNum++
      },
      //args: [],
      callbackScope: this,
      repeat: this.level.waves[this.onWave].waveEnemies.length - 1
    });
  }
  update(time, delta) {

    finder.calculate();
  }
  runCheck() {
    if (money.health <= 0) {
      this.scene.pause('playGame')
      this.scene.pause('UI')
      this.scene.launch('gameOver', { outcome: 'lose' })
    }
    if (this.killedInWave + this.landed == this.level.waves[this.onWave].waveEnemies.length) {
      this.onWave++
      if (this.onWave == this.level.numberOfWaves) {
        this.time.delayedCall(1000, () => {

          this.scene.pause('playGame')
          this.scene.pause('UI')
          this.scene.launch('gameOver', { outcome: 'win' })

        })
      } else {
        this.time.delayedCall(1000, () => {
          this.saveProgress()
          this.scene.pause('playGame')
          this.scene.pause('UI')
          this.scene.launch('waveDone', { killed: this.killedInWave, landed: this.landed })
          this.endWave()
        })
      }



    }
  }
  endWave() {
    if (gameMode == 'endless') {
      var enemyList = this.createWave()

      var delays = [800, 900, 1000, 1100, 1200, 1300, 1400, 1500]
      var spawnDelay = 1500 - this.onWave * 50

      this.level.waves.push({
        spawnRate: spawnDelay,
        addBlocks: 0,
        waveEnemies: enemyList
      })
      this.saveProgress()
    }

    this.UI.startWave.setInteractive()
    this.UI.startWave.setAlpha(1)
    this.UI.waveText.setText(this.onWave + 1)
    this.landed = 0
    this.killedInWave = 0
    this.launchNum = 0
    this.placeRandomBlocks(this.level.waves[this.onWave].addBlocks)


  }
  createWave() {
    var wave = []
    //first wave
    if (this.onWave < 2) {
      var w1 = this.createEnemySegment(0, 10)
      wave.push(...w1)
      var w2 = this.createEnemySegment(1, 10)
      wave.push(...w2)
      var w3 = this.createEnemySegment(0, 10)
      wave.push(...w3)
    } else if (this.onWave < 4) {
      var w1 = this.createEnemySegment(1, 10)
      wave.push(...w1)
      var w2 = this.createEnemySegment(0, 10)
      wave.push(...w2)
      var w3 = this.createEnemySegment(1, 10)
      wave.push(...w3)
    } else if (this.onWave < 6) {
      var w1 = this.createEnemySegment(2, 10)
      wave.push(...w1)
      var w2 = this.createEnemySegment(0, 10)
      wave.push(...w2)
      var w4 = this.createEnemySegment(2, 10)

    } else if (this.onWave < 8) {
      var w1 = this.createEnemySegment(3, 10)
      wave.push(...w1)
      var w2 = this.createEnemySegment(0, 10)
      wave.push(...w2)
      var w4 = this.createEnemySegment(3, 10)

    } else {
      var w1 = this.createEnemySegment(2, 10)
      wave.push(...w1)
      var w4 = this.createEnemySegment(0, 10)
      wave.push(...w4)
      var w2 = this.createEnemySegment(3, 10)
      wave.push(...w2)
      var w3 = this.createEnemySegment(1, 10)
      wave.push(...w3)
    }
    ////////
    if (this.onWave == 1) {
      var w1 = this.createEnemySegment(2, 15)
      wave.push(...w1)

    } else if (this.onWave == 2) {
      var w1 = this.createEnemySegment(3, 15)
      wave.push(...w1)

    } else if (this.onWave == 3) {
      var w1 = this.createEnemySegment(3, 10)
      wave.push(...w1)
      var w2 = this.createEnemySegment(4, 5)
      wave.push(...w2)

    } else if (this.onWave == 4) {
      var w1 = this.createEnemySegment(2, 10)
      wave.push(...w1)
      var w2 = this.createEnemySegment(5, 5)
      wave.push(...w2)

    } else if (this.onWave == 5) {
      var w1 = this.createEnemySegment(4, 10)
      wave.push(...w1)
      var w2 = this.createEnemySegment(5, 5)
      wave.push(...w2)

    } else if (this.onWave == 6) {
      var w1 = this.createEnemySegment(5, 10)
      wave.push(...w1)
      var w2 = this.createEnemySegment(6, 5)
      wave.push(...w2)

    } else if (this.onWave == 7) {
      var w1 = this.createEnemySegment(3, 30)
      wave.push(...w1)
      var w2 = this.createEnemySegment(5, 15)
      wave.push(...w2)

    } else if (this.onWave == 8) {
      var w1 = this.createEnemySegment(4, 30)
      wave.push(...w1)
      var w2 = this.createEnemySegment(1, 15)
      wave.push(...w2)
      var w2 = this.createEnemySegment(5, 15)
      wave.push(...w2)

    } else if (this.onWave == 9) {
      var w1 = this.createEnemySegment(5, 30)
      wave.push(...w1)
      var w2 = this.createEnemySegment(3, 15)
      wave.push(...w2)
      var w2 = this.createEnemySegment(6, 15)
      wave.push(...w2)
      var w2 = this.createEnemySegment(0, 20)
      wave.push(...w2)

    } else if (this.onWave > 9) {
      var randEn = Phaser.Math.Between(0, 6)
      var randCount = Phaser.Math.Between(10, 40)
      var w1 = this.createEnemySegment(randEn, randCount)
      wave.push(...w1)
      var randEn2 = Phaser.Math.Between(0, 6)
      var randCount2 = Phaser.Math.Between(10, 40)
      var w2 = this.createEnemySegment(randEn2, randCount2)
      wave.push(...w2)
    }



    //////
    /*   if (this.onWave % 3 == 0) {
  
      } */
    if (this.onWave >= 3 && this.onWave < 6) {
      var w3 = this.createEnemySegment(2, 5 + this.onWave * 10)
    }
    if (this.onWave >= 6 && this.onWave < 9) {
      var w1 = this.createEnemySegment(2, 5 + this.onWave * 10)
      wave.push(...w1)
      var w3 = this.createEnemySegment(3, 5 + this.onWave * 10)
      wave.push(...w3)
    }
    wave.push(this.createEnemySegment(7, 1 + Math.floor(this.onWave / 2)))
    return wave
  }
  createEnemySegment(enemy, n) {
    var y;
    y = Array(n);
    while (n--) {
      y[n] = enemy;
    }
    return y;
  }
  saveProgress() {
    if (gameMode == 'levels') {
      gameData.onLevel = onLevel
      gameData.onWave = this.onWave
      gameData.playerData = money
      gameData.map = this.map
      gameData.towerData = this.getTowerData()
      localStorage.setItem('DefenseSave', JSON.stringify(gameData));
    } else {
      gameDataEndless.savedLevel = this.level
      gameDataEndless.onWave = this.onWave
      gameDataEndless.playerData = money
      gameDataEndless.map = this.map
      gameDataEndless.towerData = this.getTowerData()
      localStorage.setItem('DefenseSaveEndless', JSON.stringify(gameDataEndless));
    }

  }
  getTowerData() {
    var results = []
    var towersUnits = turrets.getChildren()

    for (var i = 0; i < towersUnits.length; i++) {
      var tower = towersUnits[i];
      var data = {}
      data.i = tower.i
      data.j = tower.j
      data.waveAdded = tower.waveAdded
      data.hp = tower.hp
      results.push(data)
    }
    return results
  }
  movePlayer(route, enemy, speed) {
    enemy.tweens = [];
    enemy.timeline
    for (var i = 0; i < route.length - 1; i++) {
      var ex = route[i + 1].x;
      var ey = route[i + 1].y;
      enemy.tweens.push({
        targets: enemy,
        x: { value: offset + ex * cellSize, duration: speed },
        y: { value: offset + ey * cellSize, duration: speed }
      });
    }

    enemy.timeline = this.tweens.timeline({
      tweens: enemy.tweens,
      onComplete: function () {
        //console.log('done')
        this.landed++
        // console.log(this.landed)
        money.health -= this.level.enemyHitForHealth
        this.UI.healthText.setText(money.health)
        this.runCheck()
        enemy.healthbar.setVisible(false);
        enemy.setActive(false);
        enemy.setVisible(false);
        enemy.setPosition(offset + enemy.spawn.j * cellSize, offset + enemy.spawn.i * cellSize)
      },
      onCompleteScope: this
    });
  }
  drawLines(graphics, rows, cols) {


    var graphic = this.add.graphics();
    graphic.lineStyle(3, 0xffffff, 0.5);// 0.1
    //horizontal
    for (var i = 0; i < rows; i++) {
      graphic.moveTo(0, i * cellSize);
      graphic.lineTo(cols * cellSize, i * cellSize);
      if (i + 1 === rows) {
        graphic.moveTo(0, rows * cellSize);
        graphic.lineTo(cols * cellSize, rows * cellSize);
      }
    }
    //vertical
    for (var j = 0; j < cols; j++) {
      graphic.moveTo(j * cellSize, 0);
      graphic.lineTo(j * cellSize, rows * cellSize);
      if (j + 1 === cols) {
        graphic.moveTo(cols * cellSize, 0);
        graphic.lineTo(cols * cellSize, rows * cellSize);
      }
    }

    graphic.strokePath();


  }
  placeSpawnPoint(count) {
    for (let b = 0; b < count; b++) {
      var done = false
      while (!done) {
        if (b == 0) {
          var i = Phaser.Math.Between(0, Math.floor(this.rows / 4))
          var j = Phaser.Math.Between(0, Math.floor(this.cols / 2))
        } else {
          var i = Phaser.Math.Between(0, Math.floor(this.rows / 4))
          var j = Phaser.Math.Between(Math.floor(this.cols / 2), this.cols - 1)
        }
        // var i = Phaser.Math.Between(0, Math.floor(this.rows / 4))
        //  var j = Phaser.Math.Between(0, this.cols - 1)
        if (this.map[i][j] == BLANK) {
          var block = this.add.image(offset + j * cellSize, offset + i * cellSize, 'block', 2)

          this.map[i][j] = SPAWN
          this.setSafeZone({ i: i, j: j })
          spawnPoints.push({ i: i, j: j })
          done = true
        }
      }

    }
  }
  placeEndPoint(count) {
    for (let b = 0; b < count; b++) {
      var done = false
      while (!done) {
        var i = Phaser.Math.Between(this.rows - Math.floor(this.rows / 4), this.rows - 1)
        var j = Phaser.Math.Between(0, this.cols - 1)
        if (this.map[i][j] == BLANK) {
          var block = this.add.image(offset + j * cellSize, offset + i * cellSize, 'block', 1)

          this.map[i][j] = END
          endPoints.push({ i: i, j: j })
          done = true
        }
      }

    }
  }
  placeRandomBlocks(count) {
    for (let b = 0; b < count; b++) {
      var done = false
      while (!done) {
        var i = Phaser.Math.Between(0, this.rows - 1)
        var j = Phaser.Math.Between(0, this.cols - 1)
        if (this.map[i][j] == BLANK) {
          var block = this.add.image(offset + j * cellSize, offset + i * cellSize, 'block', 0)
          blocks.add(block)
          this.map[i][j] = BLOCK
          done = true
        }
      }

    }

  }
  setSafeZone(center) {
    for (let n = 0; n < neighborDirections.length; n++) {
      const nei = neighborDirections[n];
      if (this.validPick(center.i + nei[0], center.j + nei[1]) && this.map[center.i + nei[0]][center.j + nei[1]] == BLANK) {
        var tile = this.map[center.i + nei[0]][center.j + nei[1]] = NOTOWER
      }


    }
  }
  validPick(row, column) {
    return row >= 0 && row < this.rows && column >= 0 && column < this.cols && this.map[row] != undefined && this.map[row][column] != undefined;
  }
  canPlaceTurret(i, j) {
    return this.map[i][j] == BLANK;

  }
  clickMenu(pointer) {
    var i = Math.floor(pointer.y / cellSize);
    var j = Math.floor(pointer.x / cellSize);
    if (pointer.y > this.rows * cellSize) { return }
    this.selectedTile = { i: i, j: j }



    if (this.map[i][j] == BLANK) {
      this.scene.pause()
      this.scene.pause('UI')
      this.scene.launch('towerMenu')
    } else if (this.map[i][j] >= TOWERBASE) {
      var towersUnits = turrets.getChildren(),
        between

      for (var i = 0; i < towersUnits.length; i++) {
        if (towersUnits[i].active) {
          between = Phaser.Math.Distance.Between(pointer.x, pointer.y, towersUnits[i].x, towersUnits[i].y);
          if (between < 10) {
            towerAtLocation = towersUnits[i];
          }
        }
      }
      if (towerAtLocation) {
        this.scene.pause()
        this.scene.pause('UI')
        this.scene.launch('sellMenu')
        // towerXY.x = x;
        // towerXY.y = y;
        //level.scene.launch('SellUpgrade');
        //level.scene.moveAbove(currentLevel, 'SellUpgrade');
        // console.log('tower here')
      }
    }
    //this.scene.launch('towerMenu')
  }
  placeTower(tower) {

    //  var i = Math.floor(pointer.y / cellSize);
    // var j = Math.floor(pointer.x / cellSize);


    if (this.canPlaceTurret(this.selectedTile.i, this.selectedTile.j)) {
      this.map[this.selectedTile.i][this.selectedTile.j] = tower + TOWERBASE
      var image = new Turret(this, offset + this.selectedTile.j * cellSize, offset + this.selectedTile.i * cellSize, 'towers', tower, this.selectedTile, this.onWave);
      image.setType(towers[tower], false)

      /*  var turret = turrets.get();
       if (turret) {
         turret.setActive(true);
         turret.setVisible(true);
         turret.place(i, j);
       }  */
    }
    finder.setGrid(this.map)
  }
  loadMap() {
    for (let y = 0; y < this.map.length; y++) {

      for (let x = 0; x < this.map[0].length; x++) {

        if (this.map[y][x] >= TOWERBASE) {
          if (this.map[y][x] >= TOWERBASE + TOWERUPBASE) {
            var towerNum = this.map[y][x] - (TOWERBASE + TOWERUPBASE)
            var upgrade = true
          } else {
            var towerNum = this.map[y][x] - TOWERBASE
            var upgrade = false
          }
          var selectedTile = { i: y, j: x }
          var image = new Turret(this, offset + x * cellSize, offset + y * cellSize, 'towers', towerNum, selectedTile, this.onWave);
          image.setType(towers[towerNum], upgrade)
          for (let t = 0; t < gameData.towerData.length; t++) {
            const tower = gameData.towerData[t];
            if (tower.i == y && tower.j == x) {
              image.hp = tower.hp
              image.waveAdded = tower.waveAdded
            }
          }
        } else if (this.map[y][x] == SPAWN) {
          var block = this.add.image(offset + x * cellSize, offset + y * cellSize, 'block', 2)
          spawnPoints.push({ i: y, j: x })
        } else if (this.map[y][x] == END) {
          var block = this.add.image(offset + x * cellSize, offset + y * cellSize, 'block', 1)
          endPoints.push({ i: y, j: x })
        } else if (this.map[y][x] == BLOCK) {
          var block = this.add.image(offset + x * cellSize, offset + y * cellSize, 'block', 0)
        }
      }

    }
  }
  removeTower(tower) {
    this.map[tower.i][tower.j] = BLANK
    tower.graphics.clear()
    tower.setActive(false);
    tower.setVisible(false);
    towerAtLocation = null

  }
  upgradeTower() {
    this.map[this.selectedTile.i][this.selectedTile.j] += TOWERUPBASE
    towerAtLocation.upgradeTower()
    towerAtLocation = null
  }
  removeBullet(block, bullet) {
    if (bullet.type != 'missle') {
      bullet.setActive(false);
      bullet.setVisible(false);
    }
  }
  damageEnemy(enemy, bullet) {
    // only if both enemy and bullet are alive
    if (enemy.active === true && bullet.active === true) {
      // we remove the bullet right away
      if (bullet.type != 'laser') {
        bullet.setActive(false);
        bullet.setVisible(false);
      }


      // decrease the enemy hp with BULLET_DAMAGE
      enemy.receiveDamage(bullet.power, this, bullet.type);
    }
  }
  damageTurret(turret, enemy) {
    if (!turret.isHit) {
      turret.receiveDamage()
      turret.isHit = true

    }

  }
  addScore() {
    this.events.emit('score');
  }

}






var Bullet = new Phaser.Class({

  Extends: Phaser.GameObjects.Image,

  initialize:

    function Bullet(scene) {
      Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
      this.setDepth(2)
      // 
      this.incX = 0;
      this.incY = 0;
      this.lifespan = 0;
      this.power = 0
      this.speed = Phaser.Math.GetSpeed(0, 1);
      this.type = 'projectile'
      this.scene = scene
    },

  fire: function (x, y, angle, power, speed, type, towerI, towerJ, range) {
    this.setActive(true);
    this.setVisible(true);
    this.type = type
    if (this.type == 'laser') {
      var thisRange = range * 2
    } else {
      var thisRange = range
    }

    this.range = thisRange
    this.towerI = towerI
    this.towerJ = towerJ

    //addBullet(this.x, this.y, angle, this.power, this.bulletSpeed, this.type);
    //  Bullets fire from the middle of the screen to the given x/y
    this.setPosition(x, y);
    this.speed = Phaser.Math.GetSpeed(speed, 1);

    //console.log(this.speed)
    this.power = power
    //  we don't need to rotate the bullets as they are round
    //    this.setRotation(angle);

    this.dx = Math.cos(angle);
    this.dy = Math.sin(angle);

    this.lifespan = 1000 //* this.speed;
    /* console.log(this.x)
    console.log(this.y)
    console.log(this.towerI)
    console.log(this.towerJ)
    console.log(this.range) */
  },

  update: function (time, delta) {
    this.lifespan -= this.speed * delta;

    this.x += this.dx * (this.speed * delta);
    this.y += this.dy * (this.speed * delta);

    /*  if (this.lifespan < 0) {
       this.setActive(false);
       this.setVisible(false);
     } */
    if (Phaser.Math.Distance.Between(this.x, this.y, offset + this.towerJ * cellSize, offset + this.towerI * cellSize) > this.range) {
      this.setActive(false);
      this.setVisible(false);
    }
  }

});
function addBullet(x, y, angle, power, speed, type, towerI, towerJ, range) {
  var bullet = bullets.get();
  if (bullet) {
    // console.log(type)
    bullet.fire(x, y, angle, power, speed, type, towerI, towerJ, range);
  }
}
