/**/
const { AbstractApp } = await import('./svision/js/abstractApp.js?ver=' + window.srcVersion);
const { Fonts3x3 } = await import('./svision/js/platform/canvas2D/fonts3x3.js?ver=' + window.srcVersion);
const { Fonts5x5 } = await import('./svision/js/platform/canvas2D/fonts5x5.js?ver=' + window.srcVersion);
const { MainModel } = await import('./mainModel.js?ver='+window.srcVersion);
const { MenuModel } = await import('./menuModel.js?ver=' + window.srcVersion);
const { TetrisModel } = await import('./tetrisModel.js?ver=' + window.srcVersion);
const { Tool } = await import('./svision/js/tool.js?ver=' + window.srcVersion);
const { Version } = await import('./version.js?ver=' + window.srcVersion);
const { ZXFonts8x8 } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxFonts8x8.js?ver=' + window.srcVersion);
const { ZXResetModel } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxResetModel.js?ver=' + window.srcVersion);
/*/
import AbstractApp from './svision/js/abstractApp.js';
import Fonts3x3 from './svision/js/platform/canvas2D/fonts3x3.js';
import Fonts5x5 from './svision/js/platform/canvas2D/fonts5x5.js';
import MainModel from './mainModel.js';
import MenuModel from './menuModel.js';
import TetrisModel from './tetrisModel.js';
import Tool from './svision/js/tool.js';
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
      zxFonts8x8Mono: new ZXFonts8x8(this, false),
      zxFonts8x8: new ZXFonts8x8(this, true),
      zxFonts8x8Keys: new ZXFonts8x8(this, false),
      fonts5x5: new Fonts5x5(this),
      fonts3x3: new Fonts3x3(this),
    };

    this.fonts.zxFonts8x8Mono.addGlyphs('Σ', 'FE4020102040FE00');

    this.fonts.zxFonts8x8.addGlyphs('‗⋅', '000000000000F8F80000000030000000');
    this.fonts.zxFonts8x8.addSpace('␣', { width: 3, breaking: false, stretch: false });

    this.fonts.zxFonts8x8Keys.setFontsData(
      '00000000000000000010101010001000002424000000000014147E28FC505000107C507C14547C1042A44810244A8400001028102A443A00000810000000000000182020202018000030080808083000000014083E081400000008083E0808000000000000080810000000003E00000000000000001818000204081020408000007C4C5454647C000018280808083E00007C440438407C00007C441804447C00001828487E081C00007C407C04447C00007C407C44447C00007C440810101000007C443844447C00007C44447C047C000000001000001000000010000010102000000408100804000000003E003E00000000100804081000007C441C100010003C42BD85BDA5BE78003C42427E42E70000FC427C4242FC00007E424040427E0000FE42424242FE0000FE42784042FE0000FE42784040E000007E42404E427E0000E7427E4242E700007C101010107C00007E08080848780000E648705844E60000E040404242FE0000C3665A4242E70000C762524A46E700007E424242427E0000FE42427E40E000007E424242527E0800FE42427E44E700007E407E02427E0000FE92101010380000CE444444447E0000E742424224180000D7929292926C0000EE44382844EE0000EE442810103800007E440810227E001C10101010101C0000004020100804003808080808083800001038541010100000000000000000FF003C247020207C0000007C047C447E00C0407C4444447C0000007C4440407C000C047C4444447E0000007C447C407C003C2470202020700000007C44447C047CC0407C444444E6001000701010107C000800380808084878C0404C506058CC007010101010107C000000FC545454D6000000FC444444E60000007C4444447C0000007E22223E207000007C44447C040600007C242020700000007C407C04FC0000207820202038000000CC4444447E000000CE44442838000000D65454547E000000C6281028C6000000CC44447C047C00007E4418227E00000E083008080E0000080808080808000070100C1010700000142800000000003C4299A1A199423C',
    );

    this.fonts.fonts5x5.addGlyphs({
      '←': {
        width: 6,
        data: [
          [0, 2, 6, 1],
          [1, 1, 1, 3],
          [2, 0, 1, 5],
        ],
      },
      '↓': {
        width: 5,
        data: [
          [2, 0, 1, 5],
          [1, 3, 3, 1],
          [0, 2, 5, 1],
        ],
      },
      '↑': {
        width: 5,
        data: [
          [2, 0, 1, 5],
          [1, 1, 3, 1],
          [0, 2, 5, 1],
        ],
      },
      '➔': {
        width: 6,
        data: [
          [0, 2, 6, 1],
          [4, 1, 1, 3],
          [3, 0, 1, 5],
        ],
      },
    });

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

    this.score = 0;
    this.playerName = Tool.readCookie('playerName', '');
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
      case 'MainModel':
        this.model = new MainModel(this);
        break;
      case 'TetrisModel':
        this.model = new TetrisModel(this);
        break;
      case 'TetrisExitToMenu':
        if (this.model && this.model.id === 'TetrisModel') {
          this.model.showGameOver('MenuModel');
        }
        return;
    } // switch

    this.model.init();
    this.resizeApp();
  } // setModel
} // GameApp

export default GameApp;
