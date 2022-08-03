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




var EnemyBullet = new Phaser.Class({

  Extends: Phaser.GameObjects.Image,

  initialize:

    function EnemyBullet(scene) {
      Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet_enemy');
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

  fire: function (x, y, towerX, towerY) {
    this.setActive(true);
    this.setVisible(true);


    this.range = 10000


    //addBullet(this.x, this.y, angle, this.power, this.bulletSpeed, this.type);
    //  Bullets fire from the middle of the screen to the given x/y
    this.setPosition(x, y);
    this.speed = Phaser.Math.GetSpeed(700, 1);

    //console.log(this.speed)
    this.power = 10
    //  we don't need to rotate the bullets as they are round
    //    this.setRotation(angle);
    var angle = Phaser.Math.Angle.Between(x, y, towerX, towerY);
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
    if (this.lifespan <= 0) {
      this.setActive(false);
      this.setVisible(false);
    }
  }

});
function addEnemyBullet(x, y, towerX, towerY) {
  var bullet = enemyBullets.get();
  if (bullet) {
    // console.log(type)
    bullet.fire(x, y, towerX, towerY);
  }
}








///
/* var targetAngle = this.game.math.angleBetween(
  this.x, this.y,
  this.game.input.activePointer.x, this.game.input.activePointer.y
);

// Gradually (this.TURN_RATE) aim the missile towards the target angle
if (this.rotation !== targetAngle) {
  // Calculate difference between the current angle and targetAngle
  var delta = targetAngle - this.rotation;

  // Keep it in range from -180 to 180 to make the most efficient turns.
  if (delta > Math.PI) delta -= Math.PI * 2;
  if (delta < -Math.PI) delta += Math.PI * 2;

  if (delta > 0) {
      // Turn clockwise
      this.angle += this.TURN_RATE;
  } else {
      // Turn counter-clockwise
      this.angle -= this.TURN_RATE;
  }

  // Just set angle to target angle if they are close
  if (Math.abs(delta) < this.game.math.degToRad(this.TURN_RATE)) {
      this.rotation = targetAngle;
  }
}

// Calculate velocity vector based on this.rotation and this.SPEED
this.body.velocity.x = Math.cos(this.rotation) * this.SPEED;
this.body.velocity.y = Math.sin(this.rotation) * this.SPEED; */