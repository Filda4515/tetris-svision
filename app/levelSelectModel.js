/**/
const { AbstractModel } = await import('./svision/js/abstractModel.js?ver=' + window.srcVersion);
const { BorderEntity } = await import('./borderEntity.js?ver=' + window.srcVersion);
const { LevelSelectEntity } = await import('./levelSelectEntity.js?ver=' + window.srcVersion);
const { MenuTransitionEntity } = await import('./menuTransitionEntity.js?ver=' + window.srcVersion);
const { TetrisConstants } = await import('./tetrisConstants.js?ver=' + window.srcVersion);
const { ZXColor } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxColor.js?ver=' + window.srcVersion);
/*/
import AbstractModel from './svision/js/abstractModel.js';
import BorderEntity from './borderEntity.js';
import LevelSelectEntity from './levelSelectEntity.js';
import MenuTransitionEntity from './menuTransitionEntity.js';
import TetrisTitleEntity from './tetrisTitleEntity.js';
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
      return true;
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
        this.desktopEntity.addEntity(new MenuTransitionEntity(this.desktopEntity, 0, 0, this.desktopWidth, this.desktopHeight));
        this.transitionTime = timestamp + TetrisConstants.TRANSITION.TOTAL_DURATION_MS;
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
