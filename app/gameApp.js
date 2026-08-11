/**/
const { Version } = await import('./version.js?ver=' + window.srcVersion);
const { AbstractApp } = await import('./svision/js/abstractApp.js?ver=' + window.srcVersion);
const { TetrisModel } = await import('./tetrisModel.js?ver=' + window.srcVersion);
const { ZXFonts8x8 } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxFonts8x8.js?ver=' + window.srcVersion);
/*/
import Version from './version.js';
import AbstractApp from './svision/js/abstractApp.js';
import TetrisModel from './tetrisModel.js';
import ZXFonts8x8 from './svision/js/platform/canvas2D/zxSpectrum/zxFonts8x8.js';
/**/
// begin code

export class GameApp extends AbstractApp {
  constructor(platform, importPath, wsURL, devModeName, appIconSprite) {
    super(platform, 'bodyApp', importPath, wsURL);

    this.version = Version;
    this.devModeName = devModeName;
    this.appIconSprite = appIconSprite;

    this.fonts = {
      zxFonts8x8: new ZXFonts8x8(this, false),
    };

    this.controlsOptions = {
      keyboard: {
        device: 'keyboard',
        keys: [
          { action: 'left', label: 'MOVE LEFT' },
          { action: 'right', label: 'MOVE RIGHT' },
          { action: 'down', label: 'SOFT DROP' },
        ],
      },
      gamepads: {
        device: 'gamepads',
        keys: [
          { action: 'left', label: 'MOVE LEFT', eventKey: 'GamepadLeft' },
          { action: 'right', label: 'MOVE RIGHT', eventKey: 'GamepadRight' },
          { action: 'down', label: 'SOFT DROP', eventKey: 'GamepadDown' },
        ],
      },
    };

    this.controls = {
      keyboard: this.getControls('keyboard'),
      gamepads: this.getControls('gamepads'),
    };

    this.id = 'GameApp';
    this.setModel('TetrisModel');
  } // constructor

  getControls(device) {
    let result = {};
    switch (device) {
      case 'keyboard':
        result = { left: 'ArrowLeft', right: 'ArrowRight', down: 'ArrowDown', rotate: 'ArrowUp' };
        break;
      case 'gamepads':
        result = { supported: false, devices: {} };
        break;
    }
    return result;
  } // getControls

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
