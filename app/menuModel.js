/**/
const { AbstractEntity } = await import('./svision/js/abstractEntity.js?ver=' + window.srcVersion);
const { AbstractModel } = await import('./svision/js/abstractModel.js?ver=' + window.srcVersion);
const { ButtonEntity } = await import('./svision/js/platform/canvas2D/buttonEntity.js?ver='+window.srcVersion);
const { HallOfFameEntity } = await import('./hallOfFameEntity.js?ver=' + window.srcVersion);
const { MenuEntity } = await import('./svision/js/platform/canvas2D/menuEntity.js?ver=' + window.srcVersion);
const { TextEntity } = await import('./svision/js/platform/canvas2D/textEntity.js?ver=' + window.srcVersion);
const { ZXColor } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxColor.js?ver=' + window.srcVersion);
const { ZXPlayerNameEntity } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxPlayerNameEntity.js?ver=' + window.srcVersion);
const { ZXSettingsEntity } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxSettingsEntity.js?ver=' + window.srcVersion);
const { ZXVolumeEntity } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxVolumeEntity.js?ver=' + window.srcVersion);
const { ZXWaitForAudioEventEntity } = await import(
  './svision/js/platform/canvas2D/zxSpectrum/zxWaitForAudioEventEntity.js?ver=' + window.srcVersion
);
/*/
import AbstractEntity from './svision/js/abstractEntity.js';
import AbstractModel from './svision/js/abstractModel.js';
import ButtonEntity from './svision/js/platform/canvas2D/buttonEntity.js';
import HallOfFameEntity from './hallOfFameEntity.js';
import MenuEntity from './svision/js/platform/canvas2D/menuEntity.js';
import TextEntity from './svision/js/platform/canvas2D/textEntity.js';
import ZXColor from './svision/js/platform/canvas2D/zxSpectrum/zxColor.js';
import ZXPlayerNameEntity from './svision/js/platform/canvas2D/zxSpectrum/zxPlayerNameEntity.js';
import ZXSettingsEntity from './svision/js/platform/canvas2D/zxSpectrum/zxSettingsEntity.js';
import ZXVolumeEntity from './svision/js/platform/canvas2D/zxSpectrum/zxVolumeEntity.js';
import ZXWaitForAudioEventEntity from './svision/js/platform/canvas2D/zxSpectrum/zxWaitForAudioEventEntity.js';
/**/
// begin code

export class MenuModel extends AbstractModel {
  constructor(app, selectionItem) {
    super(app);
    this.id = 'MenuModel';

    this.menuItems = [
      { t1: 'START GAME', event: { id: 'startGame' } },
      { t1: 'PLAYER NAME', event: { id: 'setPlayerName' } },
      { t1: 'HALL OF FAME', event: { id: 'showHallOfFame' } },
      { t1: 'SOUNDS', event: { id: 'setSounds' } },
      { t1: 'MUSIC', event: { id: 'setMusic' } },
      { t1: 'SETTINGS', event: { id: 'setSettings' } },
    ];

    this.menuOptions = {
      fonts: this.app.fonts.zxFonts8x8,
      leftMargin: 9,
      rightMargin: 9,
      topMargin: 8,
      itemHeight: 12,
      t1LeftMargin: 3,
      t1TopMargin: 2,
      t2Width: 114,
      t2RightMargin: 3,
      t2TopMargin: 2,
      textColor: ZXColor.blue,
      selectionTextColor: ZXColor.brightWhite,
      selectionBarColor: ZXColor.brightBlue,
      hoverColor: '#a9a9a9ff',
      selectionHoverColor: ZXColor.blue,
      clickColor: '#9a9a9aff',
      selectionClickColor: '#0a2277ff',
      selection: selectionItem || 0,
    };

    this.versionEntity = null;
    this.newVersionAvailable = false;
  } // constructor

  init() {
    super.init();

    this.borderEntity.bkColor = ZXColor.white;
    this.desktopEntity.bkColor = ZXColor.white;

    this.desktopEntity.addEntity(new AbstractEntity(this.desktopEntity, 13, 0, 230, 154, false, ZXColor.blue));
    this.desktopEntity.addEntity(
      new MenuEntity(this.desktopEntity, 14, 14, 228, 139, this.desktopEntity.bkColor, this.menuOptions, this, this.getMenuData),
    );

    this.versionEntity = new ButtonEntity(this.desktopEntity, this.app.fonts.fonts5x5, 180, 151, 55, 5, 'Ⓥ'+this.app.version, {id: 'upgradeApp'}, [], ZXColor.blue, ZXColor.white, {align: 'center'});
    this.desktopEntity.addEntity(this.versionEntity);
    this.versionEntity.hoverColor = false;
    this.versionEntity.clickColor = false;
    this.checkServerVersion();

    this.copyrightEntity = new TextEntity(
      this.desktopEntity,
      this.app.fonts.zxFonts8x8,
      0,
      23 * 8,
      32 * 8,
      8,
      this.app.copyright,
      ZXColor.black,
      false,
      { align: 'center' },
    );
    this.desktopEntity.addEntity(this.copyrightEntity);

    this.app.stack.flashState = false;
    this.sendEvent(330, { id: 'changeFlashState' });
  } // init

  checkServerVersion() {
    var receiver = {
      id: this.id+'Version',
      fetchDataId: '',
      setData: (data) => {
        if (data.data.version && data.data.version !== 'unknown' && data.data.version !== this.app.version) {
          this.newVersionAvailable = true;
          this.versionEntity.setText('UPGRADE !');
          this.versionEntity.setPenColor(ZXColor.brightRed);
        }
      },
      errorData: () => {}
    };
    receiver.fetchDataId = this.app.fetchData('version.db', false, {}, receiver);
  } // checkServerVersion

  getMenuData(self, key, row) {
    if (key === 'numberOfItems') {
      return self.menuItems.length;
    }

    if (key === 't2') {
      if (row === 1) {
        return self.app.playerName;
      }
      const vol = row === 3 ? self.app.audioManager.volume.sounds : row === 4 ? self.app.audioManager.volume.music : null;

      if (vol !== null) {
        return vol === 0 ? 'OFF' : vol === 10 ? 'MAX' : vol * 10 + '%';
      }
    }

    if (key in self.menuItems[row]) {
      return self.menuItems[row][key];
    }
    return '';
  } // getMenuData

  handleEvent(event) {
    if (super.handleEvent(event)) {
      return true;
    }

    switch (event.id) {
      case 'startGame':
        if (!this.app.playerName.length) {
          this.desktopEntity.addModalEntity(new ZXPlayerNameEntity(this.desktopEntity, 27, 24, 202, 134, true));
          return true;
        }
        if (this.app.inputEventsManager.needEventForAudio()) {
          this.desktopEntity.addModalEntity(
            new ZXWaitForAudioEventEntity(this.desktopEntity, 64, 75, 128, 45, ZXColor.brightWhite, ZXColor.magenta, 'startGame2'),
          );
          return true;
        }
      case 'startGame2':
        this.app.setModel('MainModel');
        return true;
      case 'setPlayerName':
        this.desktopEntity.addModalEntity(new ZXPlayerNameEntity(this.desktopEntity, 27, 24, 202, 134, false));
        return true;
      case 'showHallOfFame':
        this.desktopEntity.addModalEntity(new HallOfFameEntity(this.desktopEntity, 27, 24, 202, 134));
        return true;
      case 'setSounds':
        this.desktopEntity.addModalEntity(
          new ZXVolumeEntity(this.desktopEntity, 27, 24, 202, 134, 'sounds', 'audioBusSoundsLevel', 'exampleJumpSound'),
        );
        return true;
      case 'setMusic':
        this.desktopEntity.addModalEntity(
          new ZXVolumeEntity(this.desktopEntity, 27, 24, 202, 134, 'music', 'audioBusMusicLevel', 'exampleInGameMelody'),
        );
        return true;
      case 'setSettings':
        this.desktopEntity.addModalEntity(new ZXSettingsEntity(this.desktopEntity, 27, 24, 202, 134, this.app.controlsOptions));
        return true;
      case 'upgradeApp':
        if (this.newVersionAvailable) {
          this.app.upgradeApp();
        }
        return true;
    }
    return false;
  } // handleEvent

  loopModel(timestamp) {
    super.loopModel(timestamp);

    if (this.desktopEntity.modalEntity) {
      this.desktopEntity.modalEntity.loopEntity(timestamp);
    }

    this.drawModel();
  } // loopModel
}
