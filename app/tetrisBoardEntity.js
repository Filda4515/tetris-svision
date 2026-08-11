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
    this.boardGrid = null;
  } // constructor

  drawEntity() {
    super.drawEntity();

    if (this.boardGrid) {
      const subSize = TetrisConstants.BLOCK_SIZE - TetrisConstants.GRID_LINE_WIDTH;
      for (let y = 0; y < TetrisConstants.BOARD_ROWS; y++) {
        for (let x = 0; x < TetrisConstants.BOARD_COLS; x++) {
          const blockColor = this.boardGrid[y][x];

          if (blockColor !== 0) {
            this.app.layout.paint(this, x * TetrisConstants.BLOCK_SIZE, y * TetrisConstants.BLOCK_SIZE, subSize, subSize, blockColor);
          }
        }
      }
    }

    const borderColor = ZXColor.black;
    this.app.layout.paint(this, 0, 0, this.width, TetrisConstants.GRID_LINE_WIDTH, borderColor);
    this.app.layout.paint(this, 0, 0, TetrisConstants.GRID_LINE_WIDTH, this.height, borderColor);
  } // drawEntity
} // TetrisBoardEntity

export default TetrisBoardEntity;
