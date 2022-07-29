class waveDone extends Phaser.Scene {
  constructor() {
    super("waveDone");
  }
  preload() {



  }
  init(data) {
    this.killed = data.killed;
    this.landed = data.landed

  }
  create() {
    /* this.header = this.add.image(game.config.width / 2, game.config.height / 2, 'blank').setOrigin(.5).setTint(0x3e5e71);
    this.header.displayWidth = 870;
    this.header.displayHeight = 300; */

    var width = 800,
      height = 300,
      x = game.config.width / 2 - width / 2,
      y = game.config.height / 2 - height / 2,
      rect,
      graphics;
    if (y < 0) {
      y = height;
    }
    graphics = this.add.graphics({ fillStyle: { color: 0x000000 } });
    graphics.lineStyle(5, 0x00ff00, 1);
    graphics.strokeRoundedRect(x, y, width, height, 2);
    graphics.fillRoundedRect(x, y, width, height, 5);

    this.rectPosition = new Phaser.Geom.Rectangle(x, y, width, height);





    var makeStatText = 'Killed: ' + this.killed + ' Landed: ' + this.landed
    this.statsText = this.add.bitmapText(game.config.width / 2, game.config.height / 2 - 75, 'topaz', makeStatText, 60).setOrigin(.5).setTint(0xcbf7ff).setAlpha(1);

    var buttonTest = new Button(this, game.config.width / 2, game.config.height / 2 + 75, 'OK', buttonStyle1, this.close, true)
  }
  close() {

    this.scene.resume('playGame')
    this.scene.resume('UI')
    this.scene.stop()
  }
}