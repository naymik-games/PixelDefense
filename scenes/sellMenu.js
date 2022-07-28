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
    that.createStats()

  }
  createButton(x, y, name) {

    var nameText = this.add.text(this.rectPosition.x + 150, this.rectPosition.y + 25, towerAtLocation.name, { fontSize: '30px', fill: '#fff' }).setOrigin(.5)
    var towerIcon = this.add.image(this.rectPosition.x + 150, this.rectPosition.y + 70, 'towers', towerAtLocation.frameNum).setScale(.75)


    var text = this.add.text(this.rectPosition.x + 30, this.rectPosition.y + 100, name, { fontSize: '30px', fill: '#fff' })

    // tower = towerInfo.info[towerAtLocation.name],
    var upgradeCount = 0
    var sellAmount = 0;


    /*   if(towerAtLocation.upgrades){
          upgradeCount = towerAtLocation.upgrades;
      }else{
          towerAtLocation.upgrades = 0;
      }
*/
    text.setInteractive();
    if (name === 'Upgrade') {
      var costText;
      var upgradeCost;
      var upgradeList = towerAtLocation.upgradeList;
      text.text = "Upgrade(" + upgradeCount + ")";
      textX = this.rectPosition.x + this.rectPosition.width - (text.width / 2 + spacingFromSide);
      if (upgradeList[upgradeCount]) {
        upgradeCost = "$" + upgradeList[upgradeCount].cost;
      } else {
        upgradeCost = 'MAX';
      }
      costText = this.add.text(text.x, text.y + 25, upgradeCost, { fontSize: '30px', fill: '#fff' });
      costText.setOrigin(0.5, 0.5);
      text.on('pointerdown', function (pointer, gameObject) {
        if (upgradeCount < upgradeList.length) {
          if (money.amount >= upgradeList[upgradeCount].cost) {
            towerAtLocation.upgrades = towerAtLocation.upgrades + 1;
            towerAtLocation.range = towerAtLocation.range + upgradeList[upgradeCount].range; //update range
            towerAtLocation.damage = towerAtLocation.damage + upgradeList[upgradeCount].damage;
            money.amount = money.amount - upgradeList[upgradeCount].cost;
            towerAtLocation.speed = towerAtLocation.speed + upgradeList[upgradeCount].speed;
            towerAtLocation.fireRate = towerAtLocation.fireRate - upgradeList[upgradeCount].fireRate;

            //if(upgradeCount + 1 === 3){
            //  towerAtLocation.gunCount = 2;
            //}

            towerAtLocation.sell = Math.floor(tower.sell + upgradeList[upgradeCount].cost / 2);
            game.scene.stop('SellUpgrade');
          } else {
            console.log('not enough money');
            //not enough money
            costText.text = "NA";
          }
        } else {
          console.log('max upgrades');
          //max upgrades
        }
      });
    } else {
      var sellText;
      sellAmount = towerAtLocation.sellAmount
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
    this.Main.removeTower()
    this.scene.stop()
  }
  createStats() {
    var width = 300,
      height = 150,
      x = game.config.width / 2 - width / 2,
      y = 325,
      graphics,
      padding = 7,
      textX,
      textY,
      vspacing = 25;

    graphics = this.add.graphics({ fillStyle: { color: 0x000000 } });
    graphics.lineStyle(5, 0xffffff, 1);
    graphics.strokeRoundedRect(x, y, width, height, 2);
    graphics.fillRoundedRect(x, y, width, height, 5);

    textX = game.config.width / 2 + padding;
    textY = y + padding;
    this.createStatText(textX, textY, "Damage: " + towerAtLocation.power);
    this.createStatText(textX, textY + vspacing, "Range: " + towerAtLocation.radius);
    this.createStatText(textX, textY + vspacing * 2, "Fire Rate " + towerAtLocation.fireRate);

    this.createStatText(textX, textY + vspacing * 3, "Fire Rate " + towerAtLocation.bulletSpeed);


  }
  createStatText(x, y, text) {
    var t = this.add.text(x, y, text, { fontSize: '25px', fill: '#fff' });
    t.x = t.x - t.width / 2;
  }
  createHolder() {
    var width = 300,
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
      game.scene.stop('sellMenu');
    });
  }
}