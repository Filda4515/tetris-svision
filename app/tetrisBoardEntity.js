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

export class TetrisBoardEntity extends AbstractEntity {
  constructor(parent, x, y, width, height) {
    const isInteractive = false;
    super(parent, x, y, width, height, isInteractive, ZXColor.black);
  } // constructor

  drawEntity() {
    super.drawEntity();

    const borderColor = ZXColor.black; 
    this.app.layout.paint(this, 0, 0, this.width, TetrisConstants.GRID_LINE_WIDTH, borderColor);
    this.app.layout.paint(this, 0, 0, TetrisConstants.GRID_LINE_WIDTH, this.height, borderColor);
  } // drawEntity
} // TetrisBoardEntity

export default TetrisBoardEntity;
