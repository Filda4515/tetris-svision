/**/
const { AbstractModel } = await import('./svision/js/abstractModel.js?ver=' + window.srcVersion);
const { BorderEntity } = await import('./borderEntity.js?ver=' + window.srcVersion);
const { LevelSelectEntity } = await import('./levelSelectEntity.js?ver=' + window.srcVersion);
const { ZXColor } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxColor.js?ver=' + window.srcVersion);
/*/
import AbstractModel from './svision/js/abstractModel.js';
import BorderEntity from './borderEntity.js';
import LevelSelectEntity from './levelSelectEntity.js';
import ZXColor from './svision/js/platform/canvas2D/zxSpectrum/zxColor.js';
/**/
// begin code

export class LevelSelectModel extends AbstractModel {
  constructor(app) {
    super(app);
    this.id = 'LevelSelectModel';
    this.selectEntity = null;
    this.transitionTime = 0;
  } // constructor

  init() {
    super.init();

    this.borderEntity.bkColor = ZXColor.black;
    this.desktopEntity.bkColor = ZXColor.black;

    this.selectEntity = new LevelSelectEntity(this.desktopEntity, 0, 0, this.desktopWidth, this.desktopHeight);
    this.desktopEntity.addEntity(this.selectEntity);

    this.transitionTime = 0;
  } // init

  newBorderEntity() {
    return new BorderEntity(true, false);
  } // newBorderEntity

  handleEvent(event) {
    if (super.handleEvent(event)) {
      return true;
    }

    if (this.selectEntity.selectedLevel !== null) {
      return false;
    }

    let level = null;

    if (event.id === 'keyPress') {
      const key = event.key;
      if (key >= '0' && key <= '9') {
        level = parseInt(key, 10);
      } else {
        level = 5;
      }
    } else if (event.id === 'keyRelease' && (event.key === 'Mouse1' || event.key === 'Touch')) {
      level = 5;
    }

    if (level !== null) {
      this.app.startLevel = level;
      this.selectEntity.selectedLevel = level;

      this.sendEvent(0, { id: 'playSound', bus: 'sounds', sound: 'dropSound', options: false });
      return true;
    }

    return false;
  } // handleEvent

  loopModel(timestamp) {
    super.loopModel(timestamp);

    if (this.selectEntity.selectedLevel !== null) {
      if (this.transitionTime === 0) {
        this.transitionTime = timestamp + 500;
      } else if (timestamp > this.transitionTime) {
        this.app.score = 0;
        this.app.setModel('TetrisModel');
        return;
      }
    }

    this.drawModel();
  } // loopModel
} // LevelSelectModel

export default LevelSelectModel;
