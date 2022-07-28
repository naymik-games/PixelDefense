let game;
let offset
let cellSize
let finder
let path;
let enemies;
let bullets;
var turrets;
var ENEMY_SPEED = 1 / 2500;
var BULLET_DAMAGE = 50;
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
    scene: [preloadGame, startGame, playGame, UI]
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


    this.cameras.main.setBackgroundColor(0x000000);

    var graphics = this.add.graphics();
    this.cols = 14
    cellSize = game.config.width / this.cols
    console.log(cellSize)
    offset = cellSize / 2
    this.rows = 22
    // this.rows = Math.floor(game.config.height / cellSize)
    // this.cols = Math.floor(game.config.width / cellSize)




    console.log(this.cols)
    console.log(this.cols * cellSize)

    this.playerTest = this.add.image(offset + 1 * cellSize, offset + 0 * cellSize, 'sprites', 'enemy')
    this.map = []
    for (let y = 0; y < this.rows; y++) {
      var temp = []
      for (let x = 0; x < this.cols; x++) {
        temp.push(0)
      }
      this.map.push(temp)
    }
    console.log(this.map)

    finder = new EasyStar.js();
    finder.setGrid(this.map)
    finder.setAcceptableTiles([0])




    this.drawLines(graphics, this.rows, this.cols);





    enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
    this.nextEnemy = 0;
    turrets = this.add.group({ runChildUpdate: true });

    bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
    this.input.on('pointerdown', this.placeTurret, this);


    this.physics.add.overlap(enemies, bullets, this.damageEnemy);
    /* this.input.on("pointerdown", this.gemSelect, this);
     this.input.on("pointermove", this.drawPath, this);
     this.input.on("pointerup", this.removeGems, this);
    */
    //this.check = this.add.image(725, 1000, 'check').setScale(.7);
  }
  update(time, delta) {
    if (time > this.nextEnemy) {
      var enemy = enemies.get();
      if (enemy) {
        enemy.setActive(true);
        enemy.setVisible(true);
        enemy.startOnPath(this);

        this.nextEnemy = time + 1500;
      }
    }
    finder.calculate();
  }
  movePlayer(route, enemy) {
    enemy.tweens = [];
    enemy.timeline
    for (var i = 0; i < route.length - 1; i++) {
      var ex = route[i + 1].x;
      var ey = route[i + 1].y;
      enemy.tweens.push({
        targets: enemy,
        x: { value: offset + ex * cellSize, duration: 500 },
        y: { value: offset + ey * cellSize, duration: 500 }
      });
    }

    enemy.timeline = this.tweens.timeline({
      tweens: enemy.tweens
    });
  }
  drawLines(graphics, rows, cols) {

    graphics.lineStyle(2, 0x0000ff, 0.8);
    //y direction

    for (var i = 0; i < rows; i++) {
      graphics.moveTo(0, i * cellSize);
      graphics.lineTo(cols * cellSize, i * cellSize);
    }
    //x direction

    for (var j = 0; j < cols; j++) {
      graphics.moveTo(j * cellSize, 0);
      graphics.lineTo(j * cellSize, rows * cellSize);
    }
    graphics.strokePath();

  }
  canPlaceTurret(i, j) {
    return this.map[i][j] == 0;

  }

  placeTurret(pointer) {
    var i = Math.floor(pointer.y / cellSize);
    var j = Math.floor(pointer.x / cellSize);

    finder.setGrid(this.map)
    if (this.canPlaceTurret(i, j)) {
      this.map[i][j] = 1
      var image = new Turret(this, offset + j * cellSize, offset + i * cellSize, 'towers', 0);
      image.upgrade(towers[0])
      /*  var turret = turrets.get();
       if (turret) {
         turret.setActive(true);
         turret.setVisible(true);
         turret.place(i, j);
       } */
    }
  }
  addBullet(x, y, angle) {
    var bullet = bullets.get();
    if (bullet) {
      bullet.fire(x, y, angle);
    }
  }
  damageEnemy(enemy, bullet) {
    // only if both enemy and bullet are alive
    if (enemy.active === true && bullet.active === true) {
      // we remove the bullet right away

      bullet.setActive(false);
      bullet.setVisible(false);
      console.log('hit ' + enemy.hp)
      // decrease the enemy hp with BULLET_DAMAGE
      enemy.receiveDamage(BULLET_DAMAGE);
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
      Phaser.GameObjects.Image.call(this, scene, offset + 1 * cellSize, offset + 0 * cellSize, 'sprites', 'enemy');


      this.hp = 0
      this.healthbar = scene.add.text(0, 0, "22", { fontSize: '20px', fill: '#fff' });
      this.healthbar.setOrigin(0, 0);
      this.healthbar.setShadow(3, 3, 'rgba(0,0,0,1)', 5);
    },

  startOnPath: function (scene) {
    this.hp = 100
    this.healthbar.setVisible(true);
    this.setAlpha(1)
    finder.findPath(1, 0, 10, 20, function (route) {
      console.log('finding...')
      if (route === null) {
        console.log("Path was not found.");
      } else {
        //console.log("Path was found. The first Point is " + route[0].x + " " + route[0].y);
        // console.log(route)
        scene.movePlayer(route, this)
      }
    }.bind(this));
  },
  receiveDamage: function (damage) {
    this.hp -= damage;
    this.setAlpha(.5)
    // if hp drops below 0 we deactivate this enemy
    if (this.hp <= 0) {
      this.timeline.destroy()
      this.setPosition(offset + 1 * cellSize, offset + 0 * cellSize)

      this.healthbar.setVisible(false);
      this.setActive(false);
      this.setVisible(false);

    }
  },
  update: function (time, delta) {
    this.healthbar.setText(this.hp)
    this.healthbar.x = this.x - this.healthbar.width / 2;
    this.healthbar.y = this.y - this.height;
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




class Turret extends Phaser.GameObjects.Image {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    // ...
    this.nextTic = 0;
    //this.radius = 1
    this.canFire = false
    this.targetAquired = false
    this.graphics = scene.add.graphics({ lineStyle: { width: 1, color: 0xffffff, alpha: 1 }, fillStyle: { color: 0xffffff, alpha: 1 } });

    // this.graphics.strokeCircleShape(this.circle)
    scene.add.existing(this);

    turrets.add(this)
  }
  update(time, delta) {
    var enemyUnits = enemies.getChildren();
    for (var i = 0; i < enemyUnits.length; i++) {
      var enemy = enemyUnits[i]
      if (this.circle.contains(enemy.x, enemy.y)) {
        this.graphics.lineStyle(0xff0000);

        enemy.setAlpha(.5)
        var angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
        this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
        this.fire(enemy, angle)


      } else {
        enemy.setAlpha(1)
      }
    }

    if (time > this.nextTic) {
      this.canFire = true
      this.nextTic = time + 1000;
    }


  }

  fire(enemy, angle) {

    if (this.canFire) {
      addBullet(this.x, this.y, angle);
      this.canFire = false
    }


  }
  upgrade(template) {
    //template = typeof template === 'undefined' ? {} : template;
    var keys = Object.keys(template);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      this[key] = template[key];
    }
    console.log(this.radius)
    // this.circle.setTo(this.circle.x, this.circle.y, this.radius)
    this.circle = new Phaser.Geom.Circle(this.x, this.y, offset + this.radius * cellSize);
    this.setFrame(this.frame)
    console.log(this.circle)
    this.graphics.clear()
    this.graphics.strokeCircleShape(this.circle)
    // if (template.cost) this.totalCost += template.cost;
  }
  // ...

  // preUpdate(time, delta) {}
}









var Turret1 = new Phaser.Class({

  Extends: Phaser.GameObjects.Image,

  initialize:

    function Turret1(scene) {
      Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'turret');
      this.nextTic = 0;
    },
  place: function (i, j) {
    this.y = i * 64 + 64 / 2;
    this.x = j * 64 + 64 / 2;
    // map[i][j] = 1;
  },
  fire: function () {
    var enemy = getEnemy(this.x, this.y, 200);
    if (enemy) {
      var angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
      addBullet(this.x, this.y, angle);
      this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
    }
  },
  update: function (time, delta) {
    if (time > this.nextTic) {
      this.fire();
      this.nextTic = time + 1100;
    }
  }
});





var Bullet = new Phaser.Class({

  Extends: Phaser.GameObjects.Image,

  initialize:

    function Bullet(scene) {
      Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

      this.incX = 0;
      this.incY = 0;
      this.lifespan = 0;

      this.speed = Phaser.Math.GetSpeed(1500, 1);
    },

  fire: function (x, y, angle) {
    this.setActive(true);
    this.setVisible(true);
    //  Bullets fire from the middle of the screen to the given x/y
    this.setPosition(x, y);

    //  we don't need to rotate the bullets as they are round
    //    this.setRotation(angle);

    this.dx = Math.cos(angle);
    this.dy = Math.sin(angle);

    this.lifespan = 1000;
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
function addBullet(x, y, angle) {
  var bullet = bullets.get();
  if (bullet) {
    bullet.fire(x, y, angle);
  }
}