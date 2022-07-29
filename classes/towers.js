class Turret extends Phaser.GameObjects.Image {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    // ...
    this.nextTic = 0;
    //this.radius = 1
    this.canFire = false
    this.targetAquired = false

    this.graphics = scene.add.graphics({ lineStyle: { width: 1, color: 0xffffff, alpha: .5 }, fillStyle: { color: 0xffffff, alpha: 1 } });

    // this.graphics.strokeCircleShape(this.circle)
    scene.add.existing(this);

    turrets.add(this)
  }
  update(time, delta) {
    if (time > this.nextTic) {
      this.fire();
      this.nextTic = time + this.fireRate;
    }
    var enemy = this.checkEnemy(this.x, this.y, this.range, 'blank');
    if (enemy) {

      var angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
      //addBullet(this.x, this.y, angle);
      this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
    }

  }



  checkEnemy(x, y, distance, notthisone) {
    var enemyUnits = enemies.getChildren();
    for (var i = 0; i < enemyUnits.length; i++) {
      if (enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) < distance && enemyUnits[i] != notthisone) {
        if (this.type == 'stun' && enemyUnits[i].stunned) {

        } else {
          return enemyUnits[i];
        }

      }
    }
    return false;
  }
  checkEnemies(x, y, distance, notthisone) {
    var results = []
    var enemyUnits = enemies.getChildren();
    for (var i = 0; i < enemyUnits.length; i++) {
      if (enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) < distance && enemyUnits[i] != notthisone) {
        results.push(enemyUnits[i])
      }
    }
    return results;
  }
  fire() {
    var range, enemy, enemies, angle;

    if (this.type == 'projectile' || this.type == 'stun') {
      enemy = this.checkEnemy(this.x, this.y, this.range, 'blank');
      if (enemy) {

        //makes sure the stunned enemy is not hit twice
        //but causes towers to randomly disappear and reappear?
        // if(enemy.follower.stunned){
        //     enemy = this.checkEnemy(this.x, this.y, range, enemy);
        // }

        angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
        addBullet(this.x, this.y, angle, this.power, this.bulletSpeed, this.type);
        console.log('call add bullet')
        this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
      }

    } else if (this.type == 'bomb') {
      enemies = this.checkEnemies(this.x, this.y, this.range, 'blank');
      if (enemies.length > 0) {
        for (let e = 0; e < enemies.length; e++) {
          const enemy = enemies[e];
          enemy.receiveDamage(this.power, this);
        }
      }

    }
  }
  setType(template) {
    //template = typeof template === 'undefined' ? {} : template;
    var keys = Object.keys(template);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      this[key] = template[key];
    }

    // this.circle.setTo(this.circle.x, this.circle.y, this.radius)
    this.circle = new Phaser.Geom.Circle(this.x, this.y, offset + this.radius * cellSize);
    this.range = offset + this.radius * cellSize;

    this.setFrame(this.frameNum)

    this.graphics.clear()
    this.graphics.strokeCircleShape(this.circle)
    // if (template.cost) this.totalCost += template.cost;
  }
  upgradeTower() {
    this.radius = this.upGradeRadius
    this.fireRate = this.upGradeFR
    this.power = this.upGradePower
    this.bulletSpeed = this.upGradeBS
    this.graphics.clear()
    this.circle.setTo(this.x, this.y, offset + this.upGradeRadius * cellSize)
    this.range = offset + this.upGradeRadius * cellSize;
    this.graphics.strokeCircleShape(this.circle)


    var newFrame = this.frameNum + 7
    this.setFrame(newFrame)
  }
  // ...

  // preUpdate(time, delta) {}
}





let towers = [
  {
    radius: 1,
    frameNum: 0,
    fireRate: 1000,
    bulletSpeed: 600,
    name: 'Starter',
    cost: 20,
    power: 10,
    sellAmount: 5,
    type: 'projectile',
    upGradeFR: 800,
    upGradePower: 15,
    upGradeBS: 900,
    upGradeCost: 10,
    upGradeRadius: 2
  },
  {
    radius: 2,
    frameNum: 1,
    fireRate: 800,
    name: 'Canon',
    type: 'projectile',
    cost: 30,
    power: 20,
    sellAmount: 15,
    bulletSpeed: 1000,
    upGradeFR: 600,
    upGradePower: 15,
    upGradeBS: 1000,
    upGradeCost: 20,
    upGradeRadius: 3

  },
  {
    radius: 2.5,
    frameNum: 2,
    fireRate: 800,
    name: 'Laser',
    type: 'projectile',
    cost: 60,
    power: 30,
    sellAmount: 25,
    bulletSpeed: 1500,
    upGradeFR: 700,
    upGradePower: 40,
    upGradeBS: 900,
    upGradeCost: 20,
    upGradeRadius: 3

  },
  {
    radius: 1,
    frameNum: 3,
    fireRate: 1600,
    name: 'Bomb',
    type: 'bomb',
    cost: 150,
    power: 5,
    sellAmount: 25,
    bulletSpeed: 1500,
    upGradeFR: 800,
    upGradePower: 15,
    upGradeBS: 900,
    upGradeCost: 75,
    upGradeRadius: 2

  },
  {
    radius: 3,
    frameNum: 4,
    fireRate: 200,
    name: 'Machine Gun',
    type: 'projectile',
    cost: 120,
    power: 20,
    sellAmount: 25,
    bulletSpeed: 1800,
    upGradeFR: 100,
    upGradePower: 30,
    upGradeBS: 900,
    upGradeCost: 80,
    upGradeRadius: 4

  },
  {
    radius: 2.5,
    frameNum: 5,
    fireRate: 1500,
    name: 'Stun Gun',
    type: 'stun',
    cost: 130,
    power: 20,
    sellAmount: 25,
    bulletSpeed: 800,
    upGradeFR: 100,
    upGradePower: 30,
    upGradeBS: 900,
    upGradeCost: 80,
    upGradeRadius: 4

  }
]