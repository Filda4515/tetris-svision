/**/
const { AbstractApp } = await import('./svision/js/abstractApp.js?ver=' + window.srcVersion);
const { MenuModel } = await import('./menuModel.js?ver=' + window.srcVersion);
const { TetrisModel } = await import('./tetrisModel.js?ver=' + window.srcVersion);
const { Version } = await import('./version.js?ver=' + window.srcVersion);
const { ZXFonts8x8 } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxFonts8x8.js?ver=' + window.srcVersion);
const { ZXResetModel } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxResetModel.js?ver=' + window.srcVersion);
/*/
import AbstractApp from './svision/js/abstractApp.js';
import MenuModel from './menuModel.js';
import TetrisModel from './tetrisModel.js';
import Version from './version.js';
import ZXFonts8x8 from './svision/js/platform/canvas2D/zxSpectrum/zxFonts8x8.js';
import ZXResetModel from './svision/js/platform/canvas2D/zxSpectrum/zxResetModel.js';
/**/
// begin code

export class GameApp extends AbstractApp {
  constructor(platform, importPath, wsURL, devModeName, appIconSprite) {
    super(platform, 'bodyApp', importPath, wsURL);

    this.version = Version;
    this.copyright = '©␣2026␣Filip␣Nevrala, CC␣BY⋅NC⋅SA';
    this.devModeName = devModeName;
    this.appIconSprite = appIconSprite;

    this.fonts = {
      zxFonts8x8: new ZXFonts8x8(this, true),
      zxFonts8x8Mono: new ZXFonts8x8(this, false),
    };

    this.fonts.zxFonts8x8Mono.addGlyphs('Σ', 'FE4020102040FE00');

    this.fonts.zxFonts8x8.addGlyphs('‗⋅', '000000000000F8F80000000030000000');
    this.fonts.zxFonts8x8.addSpace('␣', { width: 3, breaking: false, stretch: false });

    this.controlsOptions = {
      keyboard: {
        device: 'keyboard',
        keys: [
          { action: 'left', label: 'MOVE LEFT' },
          { action: 'right', label: 'MOVE RIGHT' },
          { action: 'rotate', label: 'ROTATE' },
          { action: 'hardDrop', label: 'HARD DROP' },
        ],
      },
      mouse: {
        device: 'mouse',
        keys: [
          { action: 'left', label: 'MOVE LEFT' },
          { action: 'right', label: 'MOVE RIGHT' },
          { action: 'hardDrop', label: 'HARD DROP' },
        ],
      },
      gamepads: {
        device: 'gamepads',
        keys: [
          { action: 'left', label: 'MOVE LEFT', eventKey: 'GamepadLeft' },
          { action: 'right', label: 'MOVE RIGHT', eventKey: 'GamepadRight' },
          { action: 'rotate', label: 'ROTATE', eventKey: 'GamepadOK' },
          { action: 'hardDrop', label: 'HARD DROP', eventKey: 'GamepadDown' },
        ],
      },
      touchscreen: {
        device: 'touchscreen',
        types: {
          keys: ['tetrisLayout'],
          tetrisLayout: {
            left: {
              type: 'button',
              control: false,
              action: 'hardDrop',
              actions: false,
              sprite: 'drop',
            },
            right: {
              type: 'joystick',
              control: 'both',
              action: false,
              actions: ['rotate', 'right', false, 'left'],
              sprite: 'left-right',
            },
          },
          default: {},
        },
        icons: {
          drop: {
            compressedSpriteData: 'lP101300N0A970111030Z0510122382012345617171859',
          },
          'left-right': {
            compressedSpriteData: 'lP101300N08B701050P020N06910121213421245641465421243121217',
          },
        },
      },
    };

    this.controls = {
      keyboard: this.getControls('keyboard'),
      mouse: this.getControls('mouse'),
      gamepads: this.getControls('gamepads'),
      touchscreen: this.getControls('touchscreen'),
    };

    this.id = 'GameApp';
    this.setModel('LoadingModel');
    // this.setModel('TetrisModel');
  } // constructor

  getControls(device) {
    let result = {};
    switch (device) {
      case 'keyboard':
        result = { left: 'ArrowLeft', right: 'ArrowRight', hardDrop: ' ', rotate: 'ArrowUp' };
        break;
      case 'mouse': 
        result = { enable: false, left: 'Mouse1', right: 'Mouse2', hardDrop: 'Mouse4' };
        break;
      case 'gamepads':
        result = { supported: false, devices: {} };
        break;
      case 'touchscreen':
        result = { supported: false, type: 'tetrisLayout' };
        break;
    }
    return result;
  } // getControls

  setModel(model) {
    if (this.model) {
      this.model.shutdown();
    }

    switch (model) {
      case 'LoadingModel':
        this.model = new ZXResetModel(this, this.copyright);
        break;
      case 'MenuModel':
        this.model = new MenuModel(this, 0);
        break;
      case 'TetrisModel':
        this.model = new TetrisModel(this);
        break;
    } // switch

    this.model.init();
    this.resizeApp();
  } // setModel
} // GameApp

export default GameApp;
