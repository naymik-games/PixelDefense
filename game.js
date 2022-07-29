let game;
let offset
let cellSize
let finder
let path;
let enemies;
let bullets;
let towerAtLocation;
var turrets;
var currentGame
var ENEMY_SPEED = 1 / 2500;
var BULLET_DAMAGE = 50;
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
let spawnPoints = []
let endPoints = []
let spawnAlt = 0

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
    if (load == 'new') {
      this.onWave = 0
    } else {
      this.onWave = gameData.onWave
    }



    enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
    turrets = this.add.group({ runChildUpdate: true });
    bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
    this.level = levels[onLevel]


    this.killedInWave = 0
    this.landed = 0
    this.launchNum = 0


    this.cameras.main.setBackgroundColor(0x000000);
    this.UI = this.scene.get('UI');
    var graphics = this.add.graphics();
    this.cols = 14
    cellSize = game.config.width / this.cols
    console.log(cellSize)
    offset = cellSize / 2
    this.rows = 22
    // this.rows = Math.floor(game.config.height / cellSize)
    // this.cols = Math.floor(game.config.width / cellSize)


    this.drawLines(graphics, this.rows, this.cols);

    if (load == 'new') {
      money.amount = this.level.startAmount
      money.health = this.level.startHealth
      if (this.level.customMap) {
        this.map = this.level.map
        for (let y = 0; y < this.map.length; y++) {

          for (let x = 0; x < this.map[0].length; x++) {
            if (this.map[y][x] == 1) {
              var block = this.add.image(offset + x * cellSize, offset + y * cellSize, 'block', 0)
            }
          }

        }
      } else {
        this.map = []
        for (let y = 0; y < this.rows; y++) {
          var temp = []
          for (let x = 0; x < this.cols; x++) {
            temp.push(0)
          }
          this.map.push(temp)
        }
        this.placeRandomBlocks(this.level.numberOfBlocks)
      }


      this.placeSpawnPoint(this.level.numberOfSpawnPoints)
      this.placeEndPoint(1)
    } else {
      money = gameData.playerData
      this.map = gameData.map
      this.loadMap()
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
    finder.setAcceptableTiles([0, 3, 4])






    /* this.healthText = this.add.bitmapText(85, 1550, 'topaz', money.health, 80).setOrigin(.5).setTint(0xcbf7ff).setAlpha(1);
    this.moneyText = this.add.bitmapText(385, 1550, 'topaz', money.amount, 80).setOrigin(.5).setTint(0xcbf7ff).setAlpha(1); */

    this.input.on('pointerdown', this.clickMenu, this);


    this.physics.add.overlap(enemies, bullets, this.damageEnemy, null, this);
    /* this.input.on("pointerdown", this.gemSelect, this);
     this.input.on("pointermove", this.drawPath, this);
     this.input.on("pointerup", this.removeGems, this);
    */
    //this.check = this.add.image(725, 1000, 'check').setScale(.7);
  }
  startWave() {

    var timer = this.time.addEvent({
      delay: this.level.waves[this.onWave].spawnRate,                // ms
      callback: function () {
        var enemy = enemies.get();
        if (enemy) {
          console.log(this.onWave)
          enemy.setType(enemyTypes[this.level.waves[this.onWave].waveEnemies[this.launchNum]])
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

    this.UI.startWave.setInteractive()
    this.UI.startWave.setAlpha(1)
    this.UI.waveText.setText(this.onWave + 1)
    this.landed = 0
    this.killedInWave = 0
    this.launchNum = 0
    this.placeRandomBlocks(this.level.waves[this.onWave].addBlocks)


  }
  saveProgress() {
    gameData.onLevel = onLevel
    gameData.onWave = this.onWave
    gameData.playerData = money
    gameData.map = this.map
    localStorage.setItem('DefenseSave', JSON.stringify(gameData));
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
        console.log('done')
        this.landed++
        console.log(this.landed)
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
        var i = Phaser.Math.Between(0, Math.floor(this.rows / 4))
        var j = Phaser.Math.Between(0, this.cols - 1)
        if (this.map[i][j] == BLANK) {
          var block = this.add.image(offset + j * cellSize, offset + i * cellSize, 'block', 2)
          console.log('spawn')
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
          console.log('end')
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
          console.log('block')
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
        this.scene.launch('sellMenu')
        // towerXY.x = x;
        // towerXY.y = y;
        //level.scene.launch('SellUpgrade');
        //level.scene.moveAbove(currentLevel, 'SellUpgrade');
        console.log('tower here')
      }
    }
    //this.scene.launch('towerMenu')
  }
  placeTower(tower) {

    //  var i = Math.floor(pointer.y / cellSize);
    // var j = Math.floor(pointer.x / cellSize);


    if (this.canPlaceTurret(this.selectedTile.i, this.selectedTile.j)) {
      this.map[this.selectedTile.i][this.selectedTile.j] = tower + TOWERBASE
      var image = new Turret(this, offset + this.selectedTile.j * cellSize, offset + this.selectedTile.i * cellSize, 'towers', tower);
      image.setType(towers[tower])

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
          var towerNum = this.map[y][x] - TOWERBASE
          var image = new Turret(this, offset + x * cellSize, offset + y * cellSize, 'towers', towerNum);
          image.setType(towers[towerNum])

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
  removeTower() {
    this.map[this.selectedTile.i][this.selectedTile.j] = BLANK
    towerAtLocation.graphics.clear()
    towerAtLocation.setActive(false);
    towerAtLocation.setVisible(false);
    towerAtLocation = null

  }
  upgradeTower() {
    this.map[this.selectedTile.i][this.selectedTile.j] += TOWERUPBASE
    towerAtLocation.upgradeTower()
    towerAtLocation = null
  }
  addBullet(x, y, angle, type) {
    console.log('type' + type)
    var bullet = bullets.get();
    if (bullet) {
      console.log(type)
      bullet.fire(x, y, angle, type);
    }
  }
  damageEnemy(enemy, bullet) {
    // only if both enemy and bullet are alive
    if (enemy.active === true && bullet.active === true) {
      // we remove the bullet right away

      bullet.setActive(false);
      bullet.setVisible(false);

      // decrease the enemy hp with BULLET_DAMAGE
      enemy.receiveDamage(bullet.power, this, bullet.type);
    }
  }
  addScore() {
    this.events.emit('score');
  }

}








var Enemy = new Phaser.Class({

  Extends: Phaser.GameObjects.Image,

  initialize:

    function Enemy(scene) {

      Phaser.GameObjects.Image.call(this, scene, offset + spawnPoints[spawnAlt].j * cellSize, offset + spawnPoints[spawnAlt].i * cellSize, 'rover', 0);
      this.setScale(.8)
      this.spawn = spawnPoints[spawnAlt]
      if (spawnPoints.length > 1) {
        if (spawnAlt == 0) {
          spawnAlt = 1
        } else {
          spawnAlt = 0
        }
      }

      this.end = endPoints[0]
      //console.log(this.spawn)
      this.nextTic = 1000
      this.name = ''
      this.hp = 0
      this.reward = 0
      this.speed = 0
      this.frame = 0
      this.health = 0
      this.stunned = false
      this.healthbar = scene.add.text(0, 0, "22", { fontSize: '25px', fill: '#fff' });
      this.healthbar.setOrigin(0, 0);
      /* this.emitter = scene.add.particles('particle').createEmitter({

        speed: { min: -800, max: 800 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.3, end: 0 },
        blendMode: 'SCREEN',
        //active: false,
        lifespan: 300,
        gravityY: 800
      }); */

    },
  setType: function (template) {
    //template = typeof template === 'undefined' ? {} : template;

    /* var keys = Object.keys(template);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      this[key] = template[key];
    } */

    this.name = template.name
    this.hp = template.hp
    this.reward = template.reward
    this.speed = template.speed
    this.frame = template.frame

    this.health = this.hp
    this.setFrame(this.frame)

    // if (template.cost) this.totalCost += template.cost;
  },
  startOnPath: function (scene) {

    this.healthbar.setVisible(true);
    this.setAlpha(1)
    finder.findPath(this.spawn.j, this.spawn.i, this.end.j, this.end.i, function (route) {
      console.log('finding...')
      if (route === null) {
        console.log("Path was not found.");
      } else {
        //console.log("Path was found. The first Point is " + route[0].x + " " + route[0].y);
        // console.log(route)
        scene.movePlayer(route, this, this.speed)
      }
    }.bind(this));
  },
  receiveDamage: function (damage, scene, type) {
    if (type == 'stun') {
      this.timeline.pause()
      this.stunned = true

      var timestamp = d.getTime()
      console.log(timestamp)
    } else {
      this.health -= damage;
    }

    this.setAlpha(.5)
    // if hp drops below 0 we deactivate this enemy
    if (this.health <= 0) {

      var emitter = scene.add.particles('particle_color').createEmitter({

        speed: { min: -300, max: 300 },
        angle: { min: 0, max: 360 },
        scale: { start: 2, end: .25 },
        alpha: { start: 1, end: 0 },
        blendMode: 'SCREEN',
        lifespan: 300,
        frame: [0, 1, 2, 3]
      });
      emitter.explode(25, this.x, this.y);




      this.timeline.stop()
      money.amount += this.reward
      scene.UI.moneyText.setText(money.amount)
      this.setPosition(offset + this.spawn.j * cellSize, offset + this.spawn.i * cellSize)
      scene.killedInWave++
      scene.runCheck()
      this.healthbar.setVisible(false);
      this.setActive(false);
      this.setVisible(false);
      console.log(scene.killedInWave)
    }
  },
  update: function (time, delta) {
    this.healthbar.setText(this.health)
    this.healthbar.x = this.x - this.healthbar.width / 2;
    this.healthbar.y = this.y - this.height;
    if (this.stunned) {

      /*  if (time > this.nextTic) {
         this.stunned = false
 
         this.timeline.resume()
 
       } */
    }
  }


});

function getEnemy(x, y, distance) {
  var enemyUnits = enemies.getChildren();
  for (var i = 0; i < enemyUnits.length; i++) {
    if (enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) < distance)
      return enemyUnits[i];
  }
  return false;
}














var Bullet = new Phaser.Class({

  Extends: Phaser.GameObjects.Image,

  initialize:

    function Bullet(scene) {
      Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

      this.incX = 0;
      this.incY = 0;
      this.lifespan = 0;
      this.power = 0
      this.speed = Phaser.Math.GetSpeed(0, 1);
      this.type = 'projectile'
    },

  fire: function (x, y, angle, power, speed, type) {
    this.setActive(true);
    this.setVisible(true);
    //addBullet(this.x, this.y, angle, this.power, this.bulletSpeed, this.type);
    //  Bullets fire from the middle of the screen to the given x/y
    this.setPosition(x, y);
    this.speed = Phaser.Math.GetSpeed(speed, 1);
    this.type = type
    console.log(this.speed)
    this.power = power
    //  we don't need to rotate the bullets as they are round
    //    this.setRotation(angle);

    this.dx = Math.cos(angle);
    this.dy = Math.sin(angle);

    this.lifespan = 1000 //* this.speed;

  },

  update: function (time, delta) {
    this.lifespan -= delta;

    this.x += this.dx * (this.speed * delta);
    this.y += this.dy * (this.speed * delta);

    if (this.lifespan <= 0) {
      this.setActive(false);
      this.setVisible(false);
    }
  }

});
function addBullet(x, y, angle, power, speed, type) {
  var bullet = bullets.get();
  if (bullet) {
    console.log(type)
    bullet.fire(x, y, angle, power, speed, type);
  }
}