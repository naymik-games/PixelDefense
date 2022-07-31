class sellMenu extends Phaser.Scene {

  constructor() {

    super("sellMenu");
  }
  preload() {



  }
  create() {
    console.log(towerAtLocation)
    this.Main = this.scene.get('playGame');
    this.UI = this.scene.get('UI');
    this.createHolder();
    this.createClose()
    var that = this;
    // that.createButton(0, 100, 'Upgrade');
    that.createButton(0, 100, 'Sell');
    that.createButton(0, 100, 'Upgrade');
    that.createStats()

  }
  createButton(x, y, name) {

    var nameText = this.add.text(this.rectPosition.x + 150, this.rectPosition.y + 25, towerAtLocation.name + '(' + towerAtLocation.hp + ')', { fontSize: '30px', fill: '#fff' }).setOrigin(.5)
    var towerIcon = this.add.image(this.rectPosition.x + 150, this.rectPosition.y + 70, 'towers', towerAtLocation.frameNum).setScale(.75)

    console.log(towerAtLocation.hp)

    // tower = towerInfo.info[towerAtLocation.name],
    var upgradeCount = 0
    var sellAmount = 0;


    /*   if(towerAtLocation.upgrades){
          upgradeCount = towerAtLocation.upgrades;
      }else{
          towerAtLocation.upgrades = 0;
      }
*/

    if (name === 'Upgrade') {
      var text2 = this.add.text(this.rectPosition.x + this.rectPosition.width - 30, this.rectPosition.y + 100, name, { fontSize: '30px', fill: '#fff' }).setOrigin(1, 0)
      text2.setInteractive();
      var upText;
      sellAmount = towerAtLocation.sellAmount
      text2.text = "Upgrade";

      upText = this.add.text(text2.x, text2.y + 35, "$" + sellAmount, { fontSize: '30px', fill: '#fff' }).setOrigin(1, 0);
      text2.on('pointerup', this.upgradeTower.bind(this, text2));
    } else {
      var text = this.add.text(this.rectPosition.x + 30, this.rectPosition.y + 100, name, { fontSize: '30px', fill: '#fff' })

      text.setInteractive();
      var sellText;
      sellAmount = towerAtLocation.upGradeCost
      text.text = "Sell";

      sellText = this.add.text(text.x, text.y + 35, "$" + sellAmount, { fontSize: '30px', fill: '#fff' });

      text.on('pointerup', this.sellTower.bind(this, text));
      /*    text.on('pointerdown', function(pointer, gameObject) {
              towerAtLocation.active = false;
             towerAtLocation.visible = false;
             towerAtLocation.updateCount.setActive(false);
             towerAtLocation.updateCount.setVisible(false);
             money.amount = money.amount + sellAmount;
             towerAtLocation.upgrades = 0;
             map[towerXY.y][towerXY.x] = 0; 
             game.scene.stop('SellUpgrade');
         }, sellAmount, tower); */
    }

    //text.setOrigin(0.5, 0.5);
  }
  sellTower() {
    money.amount += towerAtLocation.sellAmount;

    this.UI.moneyText.setText(money.amount)
    this.Main.removeTower(towerAtLocation)
    this.scene.stop()
    this.scene.resume('playGame')
    this.scene.resume('UI')
  }
  upgradeTower() {
    money.amount -= towerAtLocation.upGradeCost;

    this.UI.moneyText.setText(money.amount)
    this.Main.upgradeTower()
    this.scene.stop()
    this.scene.resume('playGame')
    this.scene.resume('UI')
  }
  createStats() {
    var width = 350,
      height = 150,
      x = game.config.width / 2 - width / 2,
      y = 325,
      graphics,
      padding = 10,
      textX,
      textY,
      vspacing = 25;

    graphics = this.add.graphics({ fillStyle: { color: 0x000000 } });
    graphics.lineStyle(5, 0xffffff, 1);
    graphics.strokeRoundedRect(x, y, width, height, 2);
    graphics.fillRoundedRect(x, y, width, height, 5);

    textX = x + padding
    textY = y + padding;
    this.createStatText(textX, textY, "Damage: " + towerAtLocation.power + '/' + towerAtLocation.upGradePower);
    this.createStatText(textX, textY + vspacing, "Range: " + towerAtLocation.radius + '/' + towerAtLocation.upGradeRadius);
    this.createStatText(textX, textY + vspacing * 2, "Fire Rate " + towerAtLocation.fireRate + '/' + towerAtLocation.upGradeFR);

    this.createStatText(textX, textY + vspacing * 3, "Bullet Speed " + towerAtLocation.bulletSpeed + '/' + towerAtLocation.upGradeBS);

    /* upGradeFR: 800,
    upGradePower: 15,
    upGradeBS: 900,
    upGradeCost: 10,
    upGradeRadius: 2 */
  }
  createStatText(x, y, text) {
    var t = this.add.text(x, y, text, { fontSize: '25px', fill: '#fff' });
    //t.x = t.x - t.width / 2;
  }
  createHolder() {
    var width = 350,
      height = 200,
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

    text = this.add.text(0, 0, "X", { fontSize: '30px', fill: '#fff' });
    x = this.rectPosition.x + this.rectPosition.width - text.width - offset;
    y = this.rectPosition.y + offset;
    text.x = x;
    text.y = y;
    text.setInteractive();
    text.on('pointerdown', function (pointer, gameObject) {
      this.scene.stop('sellMenu');
      this.scene.resume('playGame')
      this.scene.resume('UI')
    }, this);
  }
}