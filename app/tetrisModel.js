/**/
const { AbstractModel } = await import('./svision/js/abstractModel.js?ver=' + window.srcVersion);
const { TetrisBoardEntity } = await import('./tetrisBoardEntity.js?ver=' + window.srcVersion);
const { TetrominoEntity } = await import('./tetrominoEntity.js?ver=' + window.srcVersion);
const { ZXColor } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxColor.js?ver=' + window.srcVersion);
const { TetrisConstants, TETROMINOES_DATA } = await import('./tetrisConstants.js?ver=' + window.srcVersion);
/*/
import AbstractModel from './svision/js/abstractModel.js';
import TetrisBoardEntity from './tetrisBoardEntity.js';
import OTetrominoEntity from './oTetrominoEntity.js';
import ZXColor from './svision/js/platform/canvas2D/zxSpectrum/zxColor.js';
import TetrisConstants from './tetrisConstants.js';
/**/
// begin code

export class TetrisModel extends AbstractModel {
  constructor(app) {
    super(app);
    this.id = 'TetrisModel';
    this.boardEntity = null;

    this.activeTetrominoes = [];
    this.lastDropTime = 0;

    this.boardGrid = Array(TetrisConstants.BOARD_ROWS)
      .fill(0)
      .map(() => Array(TetrisConstants.BOARD_COLS).fill(0));
  } // constructor

  init() {
    super.init();

    this.borderEntity.bkColor = ZXColor.brightBlue;
    this.desktopEntity.bkColor = ZXColor.brightRed;

    const boardWidth = TetrisConstants.BOARD_COLS * TetrisConstants.BLOCK_SIZE;
    const boardHeight = TetrisConstants.BOARD_ROWS * TetrisConstants.BLOCK_SIZE;
    const boardX = Math.floor((this.desktopWidth - boardWidth) / 2);
    const boardY = Math.floor((this.desktopHeight - boardHeight) / 2);

    this.boardEntity = new TetrisBoardEntity(this.desktopEntity, boardX, boardY, boardWidth, boardHeight);

    TETROMINOES_DATA.forEach((tetromino) => {
      const tetEntity = new TetrominoEntity(this.boardEntity, tetromino.x, tetromino.y, tetromino.shape, tetromino.color);
      this.boardEntity.addEntity(tetEntity);
      this.activeTetrominoes.push(tetEntity);
    });

    this.desktopEntity.addEntity(this.boardEntity);
  } // init

  canMove(piece, dx, dy) {
    const newGridX = piece.gridX + dx;
    const newGridY = piece.gridY + dy;

    for (let i = 0; i < piece.shapeCoords.length; i++) {
      const coord = piece.shapeCoords[i];
      const boardX = newGridX + coord[0];
      const boardY = newGridY + coord[1];

      if (boardX < 0 || boardX >= TetrisConstants.BOARD_COLS || boardY >= TetrisConstants.BOARD_ROWS) {
        return false;
      }

      if (boardY >= 0 && this.boardGrid[boardY][boardX] !== 0) {
        return false;
      }
    }
    return true;
  } // canMove

  lockPiece(piece) {
    piece.shapeCoords.forEach((coord) => {
      const boardX = piece.gridX + coord[0];
      const boardY = piece.gridY + coord[1];

      if (boardY >= 0 && boardY < TetrisConstants.BOARD_ROWS) {
        this.boardGrid[boardY][boardX] = 1;
      }
    });
  } // lockPiece

  loopModel(timestamp) {
    super.loopModel(timestamp);

    if (!this.lastDropTime) {
      this.lastDropTime = timestamp;
    }

    if (timestamp - this.lastDropTime > TetrisConstants.DROP_DELAY_MS) {
      this.lastDropTime = timestamp;

      for (let i = this.activeTetrominoes.length - 1; i >= 0; i--) {
        const piece = this.activeTetrominoes[i];

        if (this.canMove(piece, 0, 1)) {
          piece.gridY += 1;
          piece.y = piece.gridY * TetrisConstants.BLOCK_SIZE;
        } else {
          this.lockPiece(piece);
          this.activeTetrominoes.splice(i, 1);
        }
      }
    }

    this.drawModel();
  } // loopModel
} // TetrisModel

export default TetrisModel;
