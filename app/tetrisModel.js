/**/
const { AbstractModel } = await import('./svision/js/abstractModel.js?ver='+window.srcVersion);
const { TextEntity } = await import('./svision/js/platform/canvas2D/textEntity.js?ver='+window.srcVersion);
const { ZXColor } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxColor.js?ver='+window.srcVersion);
/*/
import AbstractModel from './svision/js/abstractModel.js';
import TextEntity from './svision/js/platform/canvas2D/textEntity.js';
import ZXColor from './svision/js/platform/canvas2D/zxSpectrum/zxColor.js';
/**/
// begin code

export class TetrisModel extends AbstractModel {
  
  constructor(app) {
    super(app);
    this.id = 'TetrisModel';
  } // constructor

  init() {
    super.init();

    this.borderEntity.bkColor = ZXColor.green;
    this.desktopEntity.bkColor = ZXColor.white;
    this.desktopEntity.addEntity(new TextEntity(this.desktopEntity, this.app.fonts.zxFonts8x8Mono, 0, 0, this.desktopWidth, 8, 'Hello world!', ZXColor.red, false, {}));
  } // init

} // TetrisModel

export default TetrisModel;
