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

export class TetrominoEntity extends AbstractEntity {
  constructor(parent, x, y, shapeCoords, color) {
    const isInteractive = false;
    const blockSize = TetrisConstants.BLOCK_SIZE;
    const subSize = blockSize - TetrisConstants.GRID_LINE_WIDTH;

    let maxCol = 0;
    let maxRow = 0;
    shapeCoords.forEach((coord) => {
      if (coord[0] > maxCol) maxCol = coord[0];
      if (coord[1] > maxRow) maxRow = coord[1];
    });

    const posX = x * blockSize;
    const posY = y * blockSize;
    const width = (maxCol + 1) * blockSize;
    const height = (maxRow + 1) * blockSize;

    super(parent, posX, posY, width, height, isInteractive, false);

    this.gridX = x;
    this.gridY = y;
    this.shapeCoords = shapeCoords;
    this.color = color;
    this.blocks = [];

    shapeCoords.forEach((coord) => {
      const blockX = coord[0] * blockSize;
      const blockY = coord[1] * blockSize;
      const block = new AbstractEntity(this, blockX, blockY, subSize, subSize, isInteractive, color);
      this.blocks.push(block);
      this.addEntity(block);
    });
  } // constructor
} // TetrominoEntity

export default TetrominoEntity;
