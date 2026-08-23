/**/
const { AbstractModel } = await import('./svision/js/abstractModel.js?ver=' + window.srcVersion);
const { BorderEntity } = await import('./borderEntity.js?ver=' + window.srcVersion);
const { PauseGameEntity } = await import('./pauseGameEntity.js?ver=' + window.srcVersion);
const { TetrisTitleEntity } = await import('./tetrisTitleEntity.js?ver=' + window.srcVersion);
const { ZXColor } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxColor.js?ver=' + window.srcVersion);
/*/
import AbstractModel from './svision/js/abstractModel.js';
import BorderEntity from './borderEntity.js';
import PauseGameEntity from './pauseGameEntity.js';
import TetrisTitleEntity from './tetrisTitleEntity.js';
import ZXColor from './svision/js/platform/canvas2D/zxSpectrum/zxColor.js';
/**/
// begin code

export class MainModel extends AbstractModel {
  constructor(app) {
    super(app);
    this.id = 'MainModel';
    this.titleEntity = null;
  } // constructor

  init() {
    super.init();

    this.borderEntity.bkColor = ZXColor.black;
    this.desktopEntity.bkColor = ZXColor.black;

    this.titleEntity = new TetrisTitleEntity(this.desktopEntity, 0, 0, this.desktopWidth, this.desktopHeight);
    this.desktopEntity.addEntity(this.titleEntity);
  } // init

  newBorderEntity() {
    return new BorderEntity(true, false);
  } // newBorderEntity

  handleEvent(event) {
    if (super.handleEvent(event)) {
      return true;
    }

    switch (event.id) {
      case 'keyPress':
        if (this.desktopEntity.modalEntity == null) {
          var key = event.key;
          if (key.length == 1) {
            key = key.toUpperCase();
          }

          switch (key) {
            case ' ':
            case 'Enter':
            case 'GamepadOK':
              this.app.score = 0;
              this.app.setModel('TetrisModel');
              return true;
            case 'Escape':
            case 'GamepadExit':
              this.desktopEntity.addModalEntity(new PauseGameEntity(this.desktopEntity, 52, 40, 153, 85, 'OPTIONS', 'MenuModel'));
              return true;
            case 'Mouse1':
              this.app.inputEventsManager.keysMap.Mouse1 = this.borderEntity;
              return true;
            case 'Touch':
              this.app.inputEventsManager.touchesMap[event.identifier] = this.borderEntity;
              return true;
          }
        }
      case 'keyRelease':
        if (this.desktopEntity.modalEntity == null) {
          switch (event.key) {
            case 'Mouse1':
              if (this.app.inputEventsManager.keysMap.Mouse1 === this.borderEntity) {
                this.app.score = 0;
                this.app.setModel('TetrisModel');
                return true;
              }
              break;
            case 'Touch':
              if (this.app.inputEventsManager.touchesMap[event.identifier] === this.borderEntity) {
                this.app.score = 0;
                this.app.setModel('TetrisModel');
                return true;
              }
              break;
          }
        }
        break;
    }

    return false;
  } // handleEvent

  loopModel(timestamp) {
    super.loopModel(timestamp);
    this.drawModel();
  } // loopModel
} // MainModel

export default MainModel;
