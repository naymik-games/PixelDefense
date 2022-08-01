class startGame extends Phaser.Scene {
  constructor() {
    super("startGame");
  }
  preload() {
    //this.load.bitmapFont('atari', 'assets/fonts/atari-smooth.png', 'assets/fonts/atari-smooth.xml');
    // this.load.bitmapFont('atari', 'assets/fonts/Lato_0.png', 'assets/fonts/lato.xml');

  }
  create() {

    gameDataEndless = JSON.parse(localStorage.getItem('DefenseSaveEndless'));
    if (gameDataEndless === null || gameDataEndless.length <= 0) {
      localStorage.setItem('DefenseSaveEndless', JSON.stringify(defaultValuesEndless));
      gameDataEndless = defaultValues;
    }



    gameData = JSON.parse(localStorage.getItem('DefenseSave'));
    if (gameData === null || gameData.length <= 0) {
      localStorage.setItem('DefenseSave', JSON.stringify(defaultValues));
      gameData = defaultValues;
    }

    this.cameras.main.setBackgroundColor(0x000000);

    var title = this.add.bitmapText(game.config.width / 2, 100, 'topaz', 'PixelDefense', 150).setOrigin(.5).setTint(0xffffff);
    if (gameData.playerData != null) {
      var tempText = gameData.onLevel + 1
      var tempText2 = gameData.onWave + 1
      var startTime = this.add.bitmapText(game.config.width / 2, 275, 'topaz', 'Continue Level ' + tempText + ', Wave ' + tempText2, 50).setOrigin(.5).setTint(0xffffff);
      startTime.setInteractive();
      startTime.on('pointerdown', this.continueGame, this);
    }






    var levelsCount = levels.length;

    var colums = 4;
    var rows = 5;
    var width = 150;
    var height = width;
    var spacing = (game.config.width - (width * colums)) / (colums + 1);
    var x = 0;
    var y = 0;
    //  var topOffset = game.config.height / 2 - (rows * levelsCount);
    var topOffset = 300

    function getCoordinateByNum(num) {
      return spacing + num * (spacing + width);
    }

    var levelNum = 0;
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < colums; j++) {

        if (levelNum > levels) {
          return;
        }
        x = getCoordinateByNum(j);
        y = getCoordinateByNum(i);
        y = y + topOffset;
        var graphics = this.add.graphics();
        if (gameData.levelsComplete.indexOf(levelNum) > -1) {
          graphics.lineStyle(1, 0x00ff00, 1);
        } else {
          graphics.lineStyle(1, 0xff0000, 1);
        }

        graphics.strokeRoundedRect(x, y, width, height, 5);
        graphics.fillStyle(0xffff00, 1);
        //graphics.fillRoundedRect(x, y, width, height, 5);
        //graphics.fillStyle(0xff00ff, 1);

        var text = this.add.text(x + width / 2, y + (height / 2) - 15, levelNum + 1, {
          fontSize: '80px',
          fill: '#fff'
        });
        text.setOrigin(0.5, 0.5);
        text.level = levelNum;

        /*   var percent = this.add.text(x + width / 2, y + height / 2 + 30, com, {
            fontSize: '30px',
            fill: '#fff'
          });
          percent.setOrigin(0.5, 0.5); */

        if (gameData.levelsPlayed.indexOf(levelNum) > -1) {
          text.setInteractive();
          text.setFill('#00ff00');
          text.on('pointerup', this.clickHandler.bind(this, text));
        }


        /*  if (storageInfo.getDisplayLevels() < levelNum || levelNum > levelCount) {
             graphics.alpha = 0.5;
             text.alpha = 0.5;
             percent.alpha = 0.5;
         } else {
             text.setInteractive();
             text.on('pointerup', function() {
                 game.scene.stop('LevelSelect');
                 game.scene.start('Level' + this.name);
                 currentLevel = 'Level' + this.name;
                 levelPlaying = true;
             });
         } */
        levelNum++;
      }

    }




    var startEndless = this.add.bitmapText(game.config.width / 2, 1450, 'topaz', 'Start New Endless ', 50).setOrigin(.5).setTint(0xffffff);
    startEndless.setInteractive();
    startEndless.on('pointerdown', this.clickHandlerEndless, this);
    if (gameDataEndless.playerData != null) {
      var tempText = gameDataEndless.onLevel + 1
      var tempText2 = gameDataEndless.onWave + 1
      var continueEndless = this.add.bitmapText(game.config.width / 2, 1550, 'topaz', 'Continue Level ' + tempText + ', Wave ' + tempText2, 50).setOrigin(.5).setTint(0xffffff);
      continueEndless.setInteractive();
      continueEndless.on('pointerdown', this.continueGameEndless, this);
      //continueEndless.on('pointerdown', this.clickHandlerEndless, this);
    }







  }
  continueGame() {
    money = null
    gameMode = 'levels'
    load = 'continue'
    onLevel = gameData.onLevel
    this.scene.start('playGame');
    this.scene.launch('UI');
  }
  clickHandler(t) {
    onLevel = t.level
    gameMode = 'levels'

    load = 'new'
    this.scene.start('playGame');
    this.scene.launch('UI');
  }
  clickHandlerEndless(t) {
    onLevel = 'E'
    gameMode = 'endless'

    load = 'new'
    this.scene.start('playGame');
    this.scene.launch('UI');
  }
  continueGameEndless() {
    money = null
    gameMode = 'endless'
    load = 'continue'
    onLevel = 'E'
    this.scene.start('playGame');
    this.scene.launch('UI');
  }
}