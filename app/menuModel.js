/**/
const { AbstractEntity } = await import('./svision/js/abstractEntity.js?ver='+window.srcVersion);
const { AbstractModel } = await import('./svision/js/abstractModel.js?ver=' + window.srcVersion);
const { MenuEntity } = await import('./svision/js/platform/canvas2D/menuEntity.js?ver=' + window.srcVersion);
const { TextEntity } = await import('./svision/js/platform/canvas2D/textEntity.js?ver=' + window.srcVersion);
const { ZXColor } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxColor.js?ver=' + window.srcVersion);
/*/
import AbstractEntity from './svision/js/abstractEntity.js';
import AbstractModel from './svision/js/abstractModel.js';
import MenuEntity from './svision/js/platform/canvas2D/menuEntity.js';
import TextEntity from './svision/js/platform/canvas2D/textEntity.js';
import ZXColor from './svision/js/platform/canvas2D/zxSpectrum/zxColor.js';
/**/
// begin code

export class MenuModel extends AbstractModel {
  constructor(app, selectionItem) {
    super(app);
    this.id = 'MenuModel';

    this.menuItems = [{ t1: 'START GAME', event: { id: 'startGame' } }];

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
  } // constructor

  init() {
    super.init();

    this.borderEntity.bkColor = ZXColor.white;
    this.desktopEntity.bkColor = ZXColor.white;

    this.desktopEntity.addEntity(new AbstractEntity(this.desktopEntity, 13, 0, 230, 154, false, ZXColor.blue));
    this.desktopEntity.addEntity(
      new MenuEntity(this.desktopEntity, 14, 14, 228, 139, this.desktopEntity.bkColor, this.menuOptions, this, this.getMenuData),
    );

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
    this.sendEvent(330, {id: 'changeFlashState'});

    this.fetchData('menu.data', {key: 'menu', when: 'required'}, {});

  } // init

  getMenuData(self, key, row) {
    if (key === 'numberOfItems') {
      return self.menuItems.length;
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
        this.app.setModel('TetrisModel');
        return true;
    }
    return false;
  } // handleEvent

  loopModel(timestamp) {
    super.loopModel(timestamp);
    this.drawModel();
  } // loopModel
}
