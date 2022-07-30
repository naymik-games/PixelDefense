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
    var width = 80 * (Object.keys(towers).length + 1),
      height = 150,
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
      this.scene.stop('towerMenu');
      this.scene.resume('playGame')
      this.scene.resume('UI')
    }, this);
  }
  createButton(x, y, index) {
    var width = 80,
      height = 60,
      imageX = 0,
      imageY = 0,
      textX = 0,
      textY = 0,
      text,
      icon;

    if (this.buttonPositions.length <= 0) {
      imageX = width + this.rectPosition.x;
      imageY = this.rectPosition.y + height;
      textX = imageX;
      textY = imageY + height;
    } else {
      var old = this.buttonPositions[this.buttonPositions.length - 1];
      imageX = old.imageX + width;
      imageY = old.imageY;
      textX = old.textX + width;
      textY = old.textY;
    }

    this.buttonPositions.push({
      imageX: imageX,
      imageY: imageY,
      textX: textX,
      textY: textY
    });

    icon = this.add.image(imageX, imageY, 'towers', towers[index].frameNum),
      icon.setScale(1.2, 1.2);
    icon.setOrigin(0.5, 0.5);
    icon.setInteractive();
    icon.id = index
    //  icon.name = name;
    console.log(towers[index].name)
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
    text = this.add.text(textX, textY, '$' + towers[index].cost, { fontSize: '30px', fill: '#fff' });
    text.setOrigin(0.5, 0.5);
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


/*  var towerMenu = new Phaser.Class({
Extends: Phaser.Scene,
initialize: function MainMenu() {
 Phaser.Scene.call(this, { key: 'TowerMenu' });
},
preload: function () {
 // Preload images for this state
},
stopMenu: function () {
 game.scene.stop('TowerMenu');
},
capitalizeFirstLetter: function (string) {
 return string.charAt(0).toUpperCase() + string.slice(1);
},
buttonPositions: [],
createButton: function (x, y, name) {
 var width = 40,
   height = 40,
   imageX = 0,
   imageY = 0,
   textX = 0,
   textY = 0,
   text;

 if (this.buttonPositions.length <= 0) {
   imageX = width + this.rectPosition.x;
   imageY = this.rectPosition.y + height;
   textX = imageX;
   textY = imageY + height / 2;
 } else {
   var old = this.buttonPositions[this.buttonPositions.length - 1];
   imageX = old.imageX + width;
   imageY = old.imageY;
   textX = old.textX + width;
   textY = old.textY;
 }

 this.buttonPositions.push({
   imageX: imageX,
   imageY: imageY,
   textX: textX,
   textY: textY
 });

 this[name] = this.add.image(imageX, imageY, 'sprites', name),
   this[name].setScale(1.2, 1.2);
 this[name].setOrigin(0.5, 0.5);
 this[name].setInteractive();
 this[name].name = name;
 this[name].on('pointerup', function () {
   var towerName = this[name].name;
   if (money.amount >= towerInfo.info[towerName].cost) {
     money.amount = money.amount - towerInfo.info[towerName].cost;
     Tower.placeTower(towerName);
     game.scene.stop('TowerMenu');
     this.noMoneyText.alpha = 0;
   } else {
     this.noMoneyText.alpha = 1;
     //do something for not enough money
   }
 }, this);

 text = this.add.text(textX, textY, '$' + towerInfo.info[name].cost, { fontSize: '12px', fill: '#fff' });
 text.setOrigin(0.5, 0.5);
},
createHolder: function () {
 var width = 40 * (Object.keys(towerInfo.info).length + 1),
   height = 80,
   x = screen.width / 2 - width / 2,
   y = pointerRef.y * tileSize - height,
   rect,
   graphics;
 if (y < 0) {
   y = height;
 }
 graphics = this.add.graphics({ fillStyle: { color: 0x000000 } });
 graphics.lineStyle(1, 0xffffff, 1);
 graphics.strokeRoundedRect(x, y, width, height, 5);
 graphics.fillRoundedRect(x, y, width, height, 5);

 this.rectPosition = new Phaser.Geom.Rectangle(x, y, width, height);
},
createClose: function () {
 var offset = 4,
   x,
   y,
   text;
 text = this.add.text(0, 0, "X");
 x = this.rectPosition.x + this.rectPosition.width - text.width - offset;
 y = this.rectPosition.y + offset;
 text.x = x;
 text.y = y;
 text.setInteractive();
 text.on('pointerdown', function (pointer, gameObject) {
   game.scene.stop('TowerMenu');
 });
},
createNoMoneyText: function () {
 this.noMoneyText = this.add.text(0, 0, "Not Enough Money", { fontSize: '12px', fill: '#fff' });
 this.noMoneyText.x = screen.width / 2;
 this.noMoneyText.y = this.rectPosition.y - this.noMoneyText.height / 2;
 this.noMoneyText.setOrigin(0.5, 0.5);
 this.noMoneyText.alpha = 0;
},
create: function () {
 this.buttonPositions = [];
 this.createHolder();
 this.createClose();
 this.createNoMoneyText();
 var that = this;
 Object.keys(towerInfo.info).forEach(function (key, index) {
   that.createButton(0, 100, key);
 });
},
update: function () {
 // Update objects & variables
}
}); */