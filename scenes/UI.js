class UI extends Phaser.Scene {

  constructor() {

    super("UI");
  }
  preload() {



  }
  create() {

    //  this.header = this.add.image(game.config.width / 2, game.config.height, 'blank').setOrigin(.5, 1).setTint(0x3e5e71);
    //   this.header.displayWidth = 870;
    //   this.header.displayHeight = 200;
    this.Main = this.scene.get('playGame');

    this.startWave = this.add.image(game.config.width, game.config.height - 20, 'blank').setOrigin(1, 1).setTint(0x196F3D).setInteractive();
    this.startWave.displayWidth = 100;
    this.startWave.displayHeight = 180;
    this.startWave.on('pointerdown', function () {
      this.startWave.setAlpha(.5)
      this.startWave.disableInteractive()
      this.Main.startWave()
    }, this)

    this.score = 0;
    var wave = this.Main.onWave + 1
    this.waveText = this.add.bitmapText(850, game.config.height - 110, 'topaz', wave, 80).setOrigin(.5).setTint(0xcbf7ff).setAlpha(1);
    var healthLabel = this.add.text(85, 1500, "HEALTH", { fontSize: '30px', fill: '#fff', fontStyle: 'bold' }).setOrigin(.5);
    this.healthText = this.add.bitmapText(85, 1550, 'topaz', money.health, 80).setOrigin(.5).setTint(0xcbf7ff).setAlpha(1);
    var moneyLabel = this.add.text(285, 1500, "MONEY", { fontSize: '30px', fill: '#fff', fontStyle: 'bold' }).setOrigin(.5);
    this.moneyText = this.add.bitmapText(285, 1550, 'topaz', money.amount, 80).setOrigin(.5).setTint(0xcbf7ff).setAlpha(1);
    var levelLabel = this.add.text(485, 1500, "LEVEL", { fontSize: '30px', fill: '#fff', fontStyle: 'bold' }).setOrigin(.5);
    this.levelText = this.add.bitmapText(485, 1550, 'topaz', '1', 80).setOrigin(.5).setTint(0xcbf7ff).setAlpha(1);



    this.Main.events.on('score', function () {

      this.score += 1;
      //console.log('dots ' + string)
      this.scoreText.setText(this.score)
    }, this);
    this.makeMenu()


  }

  update() {

  }
  toggleMenu() {

    if (this.menuGroup.y == 0) {
      var menuTween = this.tweens.add({
        targets: this.menuGroup,
        y: -270,
        duration: 500,
        ease: 'Bounce'
      })

    }
    if (this.menuGroup.y == -270) {
      var menuTween = this.tweens.add({
        targets: this.menuGroup,
        y: 0,
        duration: 500,
        ease: 'Bounce'
      })
    }
  }
  makeMenu() {
    ////////menu
    this.menuGroup = this.add.container().setDepth(3);
    var menuBG = this.add.image(game.config.width - 240, game.config.height - 10, 'blank').setOrigin(.5, 0).setTint(0x000000).setAlpha(.8)
    menuBG.displayWidth = 300;
    menuBG.displayHeight = 600
    this.menuGroup.add(menuBG)
    var menuButton = this.add.image(game.config.width - 240, game.config.height - 40, "menu").setInteractive().setDepth(3);
    menuButton.on('pointerdown', this.toggleMenu, this)
    menuButton.setOrigin(0.5);
    this.menuGroup.add(menuButton);
    var homeButton = this.add.bitmapText(game.config.width - 240, game.config.height + 50, 'topaz', 'HOME', 50).setOrigin(.5).setTint(0xffffff).setAlpha(1).setInteractive();
    homeButton.on('pointerdown', function () {
      this.scene.stop()
      this.scene.stop('playGame')
      this.scene.start('startGame')
    }, this)
    this.menuGroup.add(homeButton);
    var wordButton = this.add.bitmapText(game.config.width - 240, game.config.height + 140, 'topaz', 'PAUSE', 50).setOrigin(.5).setTint(0xffffff).setAlpha(1).setInteractive();
    wordButton.on('pointerdown', function () {
      if (this.scene.isPaused('playGame')) {
        this.scene.resume('playGame')
      } else {
        this.scene.pause('playGame')
      }


    }, this)
    this.menuGroup.add(wordButton);
    var helpButton = this.add.bitmapText(game.config.width - 240, game.config.height + 230, 'topaz', 'HELP', 50).setOrigin(.5).setTint(0xffffff).setAlpha(1).setInteractive();
    helpButton.on('pointerdown', function () {

      this.scene.pause()
      this.scene.launch('help')
    }, this)
    this.menuGroup.add(helpButton);
    //var thankYou = game.add.button(game.config.width / 2, game.config.height + 130, "thankyou", function(){});
    // thankYou.setOrigin(0.5);
    // menuGroup.add(thankYou);    
    ////////end menu
  }



}