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
  constructor(parent, x, y, states, color) {
    const isInteractive = false;
    const blockSize = TetrisConstants.BLOCK_SIZE;
    const subSize = blockSize - TetrisConstants.GRID_LINE_WIDTH;

    const initialMatrix = states[0];
    const matrixRows = initialMatrix.length;
    const matrixCols = initialMatrix[0].length;

    const posX = parent.fieldOffsetX + x * blockSize;
    const posY = parent.fieldOffsetY + y * blockSize;
    const width = matrixCols * blockSize;
    const height = matrixRows * blockSize;

    super(parent, posX, posY, width, height, isInteractive, false);

    this.gridX = x;
    this.gridY = y;
    this.states = states;
    this.currentStateIndex = 0;
    this.currentMatrix = initialMatrix;
    this.color = color;
    this.blocks = [];

    for (let i = 0; i < 4; i++) {
      const block = new AbstractEntity(this, 0, 0, subSize, subSize, isInteractive, color);
      this.blocks.push(block);
      this.addEntity(block);
    }

    this.updateBlocksPositions(this.currentMatrix);
  } // constructor

  getNextStateMatrix() {
    const nextIndex = (this.currentStateIndex + 1) % this.states.length;
    return this.states[nextIndex];
  } // getNextStateMatrix

  updateBlocksPositions(newMatrix, newIndex) {
    this.currentMatrix = newMatrix;
    if (newIndex !== undefined) {
      this.currentStateIndex = newIndex;
    }

    let blockIdx = 0;
    for (let row = 0; row < newMatrix.length; row++) {
      for (let col = 0; col < newMatrix[row].length; col++) {
        if (newMatrix[row][col] === 1 && blockIdx < 4) {
          this.blocks[blockIdx].x = col * TetrisConstants.BLOCK_SIZE;
          this.blocks[blockIdx].y = row * TetrisConstants.BLOCK_SIZE;
          blockIdx++;
        }
      }
    }
  } // updateBlocksPositions
} // TetrominoEntity

export default TetrominoEntity;
