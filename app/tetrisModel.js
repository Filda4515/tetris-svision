/**/
const { AbstractModel } = await import('./svision/js/abstractModel.js?ver=' + window.srcVersion);
const { TetrisBoardEntity } = await import('./tetrisBoardEntity.js?ver=' + window.srcVersion);
const { TetrominoEntity } = await import('./tetrominoEntity.js?ver=' + window.srcVersion);
const { ZXColor } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxColor.js?ver=' + window.srcVersion);
/*/
import AbstractModel from './svision/js/abstractModel.js';
import TetrisBoardEntity from './tetrisBoardEntity.js';
import OTetrominoEntity from './oTetrominoEntity.js';
import ZXColor from './svision/js/platform/canvas2D/zxSpectrum/zxColor.js';
/**/
// begin code

export class TetrisModel extends AbstractModel {
  constructor(app) {
    super(app);
    this.id = 'TetrisModel';
    this.boardEntity = null;
  } // constructor

  init() {
    super.init();

    this.borderEntity.bkColor = ZXColor.brightBlue;
    this.desktopEntity.bkColor = ZXColor.brightRed;

    var blockSize = 8;
    var boardWidth = 10 * blockSize;
    var boardHeight = 20 * blockSize;
    var boardX = Math.floor((256 - boardWidth) / 2);
    var boardY = Math.floor((192 - boardHeight) / 2);

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
    });

    this.desktopEntity.addEntity(this.boardEntity);
  } // init

  loopModel(timestamp) {
    super.loopModel(timestamp);

    this.drawModel();
  } // loopModel
} // TetrisModel

export default TetrisModel;
