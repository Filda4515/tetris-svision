/**/
const { AbstractModel } = await import('./svision/js/abstractModel.js?ver=' + window.srcVersion);
const { TetrisBoardEntity } = await import('./tetrisBoardEntity.js?ver=' + window.srcVersion);
const { TetrominoEntity } = await import('./tetrominoEntity.js?ver=' + window.srcVersion);
const { ZXColor } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxColor.js?ver=' + window.srcVersion);
const { TetrisConstants } = await import('./tetrisConstants.js?ver=' + window.srcVersion);
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

    var boardWidth = TetrisConstants.BOARD_COLS * TetrisConstants.BLOCK_SIZE;
    var boardHeight = TetrisConstants.BOARD_ROWS * TetrisConstants.BLOCK_SIZE;
    var boardX = Math.floor((this.desktopWidth - boardWidth) / 2);
    var boardY = Math.floor((this.desktopHeight - boardHeight) / 2);

    this.boardEntity = new TetrisBoardEntity(this.desktopEntity, boardX, boardY, boardWidth, boardHeight);

    var tetrominoesData = [
      {
        shape: [
          [0, 0],
          [1, 0],
          [2, 0],
          [3, 0],
        ],
        color: ZXColor.brightYellow,
        x: 1,
        y: 1,
      }, // I
      {
        shape: [
          [0, 0],
          [1, 0],
          [0, 1],
          [1, 1],
        ],
        color: ZXColor.brightRed,
        x: 6,
        y: 1,
      }, // O
      {
        shape: [
          [1, 0],
          [0, 1],
          [1, 1],
          [2, 1],
        ],
        color: ZXColor.brightCyan,
        x: 1,
        y: 4,
      }, // T
      {
        shape: [
          [1, 0],
          [2, 0],
          [0, 1],
          [1, 1],
        ],
        color: ZXColor.brightMagenta,
        x: 6,
        y: 4,
      }, // S
      {
        shape: [
          [0, 0],
          [1, 0],
          [1, 1],
          [2, 1],
        ],
        color: ZXColor.brightGreen,
        x: 1,
        y: 8,
      }, // Z
      {
        shape: [
          [0, 0],
          [0, 1],
          [1, 1],
          [2, 1],
        ],
        color: ZXColor.brightBlue,
        x: 6,
        y: 8,
      }, // J
      {
        shape: [
          [2, 0],
          [0, 1],
          [1, 1],
          [2, 1],
        ],
        color: ZXColor.brightWhite,
        x: 1,
        y: 12,
      }, // L
    ];

    tetrominoesData.forEach((tetromino) => {
      var tetEntity = new TetrominoEntity(this.boardEntity, tetromino.x, tetromino.y, tetromino.shape, tetromino.color);
      this.boardEntity.addEntity(tetEntity);
      this.activeTetrominoes.push(tetEntity);
    });

    this.desktopEntity.addEntity(this.boardEntity);
  } // init

  canMove(piece, dx, dy) {
    var newGridX = piece.gridX + dx;
    var newGridY = piece.gridY + dy;

    for (var i = 0; i < piece.shapeCoords.length; i++) {
      var coord = piece.shapeCoords[i];
      var boardX = newGridX + coord[0];
      var boardY = newGridY + coord[1];

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
      var boardX = piece.gridX + coord[0];
      var boardY = piece.gridY + coord[1];

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

      for (var i = this.activeTetrominoes.length - 1; i >= 0; i--) {
        var piece = this.activeTetrominoes[i];

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
