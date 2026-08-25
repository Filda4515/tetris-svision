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

    this.sendEvent(0, { id: 'openAudioBus', bus: 'music', options: { muted: this.app.muted.music } });
    this.sendEvent(0, { id: 'openAudioBus', bus: 'sounds', options: { muted: this.app.muted.sounds } });
    this.sendEvent(0, { id: 'playSound', bus: 'music', sound: 'titleScreenMelody', options: false });
  } // init

  shutdown() {
    super.shutdown();
    this.sendEvent(0, { id: 'stopAllAudioBuses' });
  } // shutdown

  newBorderEntity() {
    return new BorderEntity(true, false);
  } // newBorderEntity

  handleEvent(event) {
    if (super.handleEvent(event)) {
      return true;
    }

    switch (event.id) {
      case 'replayTitleMusic':
        this.sendEvent(0, { id: 'playSound', bus: 'music', sound: 'titleScreenMelody', options: false });
        return true;
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
              this.app.setModel('LevelSelectModel');
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
        break;
      case 'keyRelease':
        if (this.desktopEntity.modalEntity == null) {
          switch (event.key) {
            case 'Mouse1':
              if (this.app.inputEventsManager.keysMap.Mouse1 === this.borderEntity) {
                this.app.score = 0;
                this.app.setModel('LevelSelectModel');
                return true;
              }
              break;
            case 'Touch':
              if (this.app.inputEventsManager.touchesMap[event.identifier] === this.borderEntity) {
                this.app.score = 0;
                this.app.setModel('LevelSelectModel');
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
