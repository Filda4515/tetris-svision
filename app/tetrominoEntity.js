/**/
const { AbstractEntity } = await import('./svision/js/abstractEntity.js?ver=' + window.srcVersion);
const { ZXColor } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxColor.js?ver=' + window.srcVersion);
/*/
import AbstractEntity from './svision/js/abstractEntity.js';
import ZXColor from './svision/js/platform/canvas2D/zxSpectrum/zxColor.js';
/**/
// begin code

export class TetrominoEntity extends AbstractEntity {
  constructor(parent, x, y, shapeCoords, color) {
    var isInteractive = false;
    var blockSize = 8;
    var subSize = 7;

    var maxCol = 0;
    var maxRow = 0;
    shapeCoords.forEach((coord) => {
      if (coord[0] > maxCol) maxCol = coord[0];
      if (coord[1] > maxRow) maxRow = coord[1];
    });

    var posX = x * blockSize;
    var posY = y * blockSize;
    var width = (maxCol + 1) * blockSize;
    var height = (maxRow + 1) * blockSize;

    super(parent, posX, posY, width, height, isInteractive, ZXColor.brightBlack);

    this.shapeCoords = shapeCoords;
    this.color = color;
    this.blocks = [];

    shapeCoords.forEach((coord) => {
      var blockX = coord[0] * blockSize;
      var blockY = coord[1] * blockSize;
      var block = new AbstractEntity(this, blockX, blockY, subSize, subSize, isInteractive, color);
      this.blocks.push(block);
      this.addEntity(block);
    });
  } // constructor
} // TetrominoEntity

export default TetrominoEntity;
