var Enemy = new Phaser.Class({

  Extends: Phaser.GameObjects.Image,

  initialize:

    function Enemy(scene) {

      Phaser.GameObjects.Image.call(this, scene, offset + spawnPoints[spawnAlt].j * cellSize, offset + spawnPoints[spawnAlt].i * cellSize, 'rover', 0);
      // this.setScale(.8)
      this.spawn = spawnPoints[spawnAlt]
      if (spawnPoints.length > 1) {
        if (spawnAlt == 0) {
          spawnAlt = 1
        } else {
          spawnAlt = 0
        }
      }
      this.scene = scene
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
      this.healthbar = scene.add.text(0, 0, "22", { fontSize: '30px', fill: '#fff', fontStyle: 'bold' });
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
  setType: function (template, wave) {
    //template = typeof template === 'undefined' ? {} : template;

    /* var keys = Object.keys(template);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      this[key] = template[key];
    } */

    this.name = template.name
    if (this.name == 'Boss') {
      var extra = wave * 100
    } else {
      var extra = 0
    }
    this.hp = template.hp + extra
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
      this.scene.time.addEvent({
        delay: 8000,                // ms
        callback: function () {
          this.stunned = false
          this.timeline.resume()
        },
        //args: [],
        callbackScope: this,
        loop: true
      });
      // var timestamp = d.getTime()
      //  console.log(timestamp)
    } else {
      this.health -= damage;
      scene.tweens.add({
        targets: this,
        alpha: 0,
        yoyo: true,
        duration: 75
      })
    }

    //this.setAlpha(.5)
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
    this.healthbar.y = this.y - (this.height + 5);

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

let enemyTypes = [
  {
    name: 'Simple',
    hp: 35,
    reward: 1,
    speed: 1000,
    frame: 0
  },
  {
    name: 'Muscle',
    hp: 75,
    reward: 2,
    speed: 1200,
    frame: 1
  },
  {
    name: 'Speedy',
    hp: 75,
    reward: 3,
    speed: 500,
    frame: 2
  },
  {
    name: 'Strong and Fast',
    hp: 135,
    reward: 4,
    speed: 700,
    frame: 3
  },
  {
    name: 'Speedy 2',
    hp: 300,
    reward: 4,
    speed: 400,
    frame: 4
  },
  {
    name: 'Stronger 2',
    hp: 375,
    reward: 4,
    speed: 1000,
    frame: 5
  },
  {
    name: 'Tank',
    hp: 650,
    reward: 5,
    speed: 1200,
    frame: 6
  },
  {
    name: 'Boss',
    hp: 250,
    reward: 10,
    speed: 1500,
    frame: 7
  }
]

