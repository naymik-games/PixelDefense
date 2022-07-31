class towerMenu extends Phaser.Scene {

  constructor() {

    super("towerMenu");
  }
  preload() {



  }
  create() {
    this.Main = this.scene.get('playGame');
    this.UI = this.scene.get('UI');
    this.buttonPositions = [];
    this.createHolder();
    this.createClose();
    // this.createNoMoneyText();
    var that = this;
    towers.forEach(function (key, index) {
      that.createButton(0, 100, index);
    });
  }
  createHolder() {
    var width = 110 * (Object.keys(towers).length + 1),
      height = 250,
      x = game.config.width / 2 - width / 2,
      y = 100,
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
  }
  createClose() {
    var offset = 4,
      x,
      y,
      text;

    text = this.add.text(0, 0, "X", { fontSize: '40px', fill: '#fff' });
    x = this.rectPosition.x + this.rectPosition.width - text.width - offset;
    y = this.rectPosition.y + offset;
    text.x = x;
    text.y = y;
    text.setInteractive();
    text.on('pointerdown', function (pointer, gameObject) {
      this.scene.stop('towerMenu');
      this.scene.resume('playGame')
      this.scene.resume('UI')
    }, this);
  }
  createButton(x, y, index) {
    var width = 110,
      height = 60,
      imageX = 0,
      imageY = 0,
      textX = 0,
      textY = 0,
      text2X = 0,
      text2Y = 0,
      text,
      text2,
      icon;

    if (this.buttonPositions.length <= 0) {
      imageX = width + this.rectPosition.x;
      imageY = this.rectPosition.y + height + 60;
      imageY = this.rectPosition.y + this.rectPosition.height / 2;
      textX = imageX;
      textY = imageY + height;
      text2X = imageX;
      text2Y = imageY - height;
    } else {
      var old = this.buttonPositions[this.buttonPositions.length - 1];
      imageX = old.imageX + (width);
      imageY = old.imageY;
      textX = old.textX + (width);
      textY = old.textY;
      text2X = old.text2X + (width);
      text2Y = old.text2Y;
    }

    this.buttonPositions.push({
      imageX: imageX,
      imageY: imageY,
      textX: textX,
      textY: textY,
      text2X: text2X,
      text2Y: text2Y
    });

    icon = this.add.image(imageX, imageY, 'towers', towers[index].frameNum),
      icon.setScale(1.2, 1.2);
    icon.setOrigin(0.5, 0.5);
    icon.setInteractive();
    icon.id = index
    //  icon.name = name;

    icon.on('pointerup', this.placeTower.bind(this, icon));
    /* icon.on('pointerup', function () {

      if (money.amount >= towers[index].cost) {
        money.amount = money.amount - towers[index].cost;
        this.Main.placeTower(index);
        game.scene.stop('towerMenu');
        // this.noMoneyText.alpha = 0;
      } else {
        // this.noMoneyText.alpha = 1;
        //do something for not enough money
      }
    }, this);
 */
    text = this.add.text(textX, textY, '$' + towers[index].cost, { fontSize: '30px', fill: '#fff', fontStyle: 'bold', });
    text.setOrigin(0.5, 0.5);
    text2 = this.add.text(text2X, text2Y, towers[index].name, { fontSize: '30px', fill: '#fff', fontStyle: 'bold', });
    text2.setOrigin(0.5, 0.5);
  }
  placeTower(t) {
    if (money.amount >= towers[t.id].cost) {
      money.amount = money.amount - towers[t.id].cost;
      this.Main.placeTower(t.id);
      this.UI.moneyText.setText(money.amount)
      this.scene.stop('towerMenu');
      this.scene.resume('playGame')
      this.scene.resume('UI')
      // this.noMoneyText.alpha = 0;
    } else {
      // this.noMoneyText.alpha = 1;
      //do something for not enough money
    }
  }
}

