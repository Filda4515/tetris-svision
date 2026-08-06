/**/
const { Version } = await import('./version.js?ver=' + window.srcVersion);
const { AbstractApp } = await import('./svision/js/abstractApp.js?ver=' + window.srcVersion);
const { TetrisModel } = await import('./tetrisModel.js?ver=' + window.srcVersion);
/*/
import Version from './version.js';
import AbstractApp from './svision/js/abstractApp.js';
import TetrisModel from './tetrisModel.js';
/**/
// begin code

export class GameApp extends AbstractApp {
  constructor(platform, importPath, wsURL, devModeName, appIconSprite) {
    super(platform, 'bodyApp', importPath, wsURL);

    this.version = Version;
    this.devModeName = devModeName;
    this.appIconSprite = appIconSprite;

    this.id = 'GameApp';
    this.setModel('TetrisModel');
  } // constructor

  setModel(model) {
    if (this.model) {
      this.model.shutdown();
    }

    switch (model) {
      case 'TetrisModel':
        this.model = new TetrisModel(this);
        break;
    } // switch

    this.model.init();
    this.resizeApp();
  } // setModel
} // GameApp

export default GameApp;
