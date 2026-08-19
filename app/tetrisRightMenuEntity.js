/**/
const { AbstractEntity } = await import('./svision/js/abstractEntity.js?ver=' + window.srcVersion);
const { ZXColor } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxColor.js?ver=' + window.srcVersion);
const { TetrisConstants } = await import('./tetrisConstants.js?ver=' + window.srcVersion);
/*/
import AbstractEntity from './svision/js/abstractEntity.js';
import ZXColor from './svision/js/platform/canvas2D/zxSpectrum/zxColor.js';
import TetrisConstants from './tetrisConstants.js';
/**/
// begin code

export class TetrisRightMenuEntity extends AbstractEntity {
  constructor(parentEntity, x, y, width, height) {
    super(parentEntity, x, y, width, height, false, false);
    this.id = 'TetrisRightMenuEntity';
    this.app.layout.newDrawingCache(this, 0);
  } // constructor

  drawEntity() {
    if (this.drawingCache[0].preparePaint(this.width, this.height)) {
      const UI = TetrisConstants.UI;
      const c = this.drawingCache[0];

      c.paint(1, 1, this.width - 2, this.height - 2, ZXColor.brightCyan);

      c.paint(0, 0, this.width, 1, UI.C_BORDER);
      c.paint(0, this.height - 1, this.width, 1, UI.C_BORDER);
      c.paint(0, 0, 1, this.height, UI.C_BORDER);
      c.paint(this.width - 1, 0, 1, this.height, UI.C_BORDER);
    }

    this.app.layout.paintCache(this, 0);
    super.drawSubEntities();
  } // drawEntity
} // TetrisRightMenuEntity

export default TetrisRightMenuEntity;
