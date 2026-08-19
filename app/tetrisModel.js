/**/
const { AbstractModel } = await import('./svision/js/abstractModel.js?ver=' + window.srcVersion);
const { TetrisBoardEntity } = await import('./tetrisBoardEntity.js?ver=' + window.srcVersion);
const { TetrominoEntity } = await import('./tetrominoEntity.js?ver=' + window.srcVersion);
const { TetrisInputController } = await import('./tetrisInputController.js?ver=' + window.srcVersion);
const { TetrisInfoEntity } = await import('./tetrisInfoEntity.js?ver=' + window.srcVersion);
const { TetrisRightMenuEntity } = await import('./tetrisRightMenuEntity.js?ver=' + window.srcVersion);
const { ZXColor } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxColor.js?ver=' + window.srcVersion);
const { TetrisConstants, TETROMINOES_DATA } = await import('./tetrisConstants.js?ver=' + window.srcVersion);
/*/
import AbstractModel from './svision/js/abstractModel.js';
import TetrisBoardEntity from './tetrisBoardEntity.js';
import TetrominoEntity from './tetrominoEntity.js';
import TetrisInputController from './tetrisInputController.js';
import TetrisInfoEntity from './tetrisInfoEntity.js';
import TetrisRightMenuEntity from './tetrisRightMenuEntity.js';
import ZXColor from './svision/js/platform/canvas2D/zxSpectrum/zxColor.js';
import TetrisConstants, { TETROMINOES_DATA } from './tetrisConstants.js';
/**/
// begin code

export class TetrisModel extends AbstractModel {
  constructor(app) {
    super(app);
    this.id = 'TetrisModel';

    this.boardEntity = null;
    this.infoEntity = null;
    this.rightMenuEntity = null;

    this.activePiece = null;
    this.lastDropTime = 0;
    this.gameOver = false;

    this.isFastDropping = false;
    this.dropStartY = 0;

    this.boardGrid = Array(TetrisConstants.BOARD_ROWS)
      .fill(0)
      .map(() => Array(TetrisConstants.BOARD_COLS).fill(0));

    this.lastPieceIndex = null;

    this.score = 0;
    this.lines = 0;
    this.level = 0;
    this.statsCount = [0, 0, 0, 0, 0, 0, 0];
    this.statsSum = 0;

    this.inputController = new TetrisInputController(this);
  } // constructor

  init() {
    super.init();

    this.borderEntity.bkColor = ZXColor.black;
    this.desktopEntity.bkColor = ZXColor.brightCyan;

    const cx = Math.floor(this.desktopWidth / 2);
    const cy = Math.floor(this.desktopHeight / 2);

    const UI = TetrisConstants.UI;

    const bdW = TetrisConstants.BOARD_COLS * TetrisConstants.BLOCK_SIZE;
    const bdH = TetrisConstants.BOARD_ROWS * TetrisConstants.BLOCK_SIZE;
    const bdX = cx - Math.floor(bdW / 2);
    const bdY = cy - Math.floor(bdH / 2) - UI.Y_SHIFT;

    const lmW = UI.MENU_WIDTH;
    const lmX = bdX - UI.GAP - lmW;
    const lmY = 0;
    const lmH = this.desktopHeight;

    const rmW = UI.MENU_WIDTH + 2;
    const rmX = bdX + bdW + UI.GAP;
    const rmY = 0;
    const rmH = this.desktopHeight;

    const frame = { lmX, lmY, lmW, lmH, rmX, rmY, rmW, rmH };
    this.boardEntity = new TetrisBoardEntity(this.desktopEntity, bdX, bdY, bdW, bdH, frame);
    this.boardEntity.boardGrid = this.boardGrid;
    this.desktopEntity.addEntity(this.boardEntity);

    this.infoEntity = new TetrisInfoEntity(this.desktopEntity, lmX, lmY, lmW, lmH);
    this.desktopEntity.addEntity(this.infoEntity);

    this.rightMenuEntity = new TetrisRightMenuEntity(this.desktopEntity, rmX, rmY, rmW, rmH);
    this.desktopEntity.addEntity(this.rightMenuEntity);

    this.spawnNextPiece();
  } // init

  addScore(points) {
    this.score += points;
    this.infoEntity.updateScore(this.score);
  } // addScore

  spawnNextPiece() {
    if (this.gameOver) return;

    this.isFastDropping = false;
    let nextIndex = Math.floor(Math.random() * TETROMINOES_DATA.length);
    if (nextIndex === this.lastPieceIndex) {
      nextIndex = Math.floor(Math.random() * TETROMINOES_DATA.length);
    }

    this.lastPieceIndex = nextIndex;

    this.statsCount[nextIndex]++;
    this.statsSum++;
    if (this.infoEntity) {
      this.infoEntity.updateStats(nextIndex, this.statsCount[nextIndex], this.statsSum);
    }

    const data = TETROMINOES_DATA[nextIndex];
    const initialMatrix = data.states[0];
    const matrixCols = initialMatrix[0].length;

    const spawnX = Math.floor((TetrisConstants.BOARD_COLS - matrixCols) / 2);
    const spawnY = 0;

    const tetEntity = new TetrominoEntity(this.boardEntity, spawnX, spawnY, data.states, data.color);

    const testPiece = {
      gridX: spawnX,
      gridY: spawnY,
      currentMatrix: initialMatrix,
    };

    if (!this.canMove(testPiece, 0, 0)) {
      this.gameOver = true;
      this.activePiece = null;
      console.log('GAME OVER');
      return;
    }

    this.boardEntity.addEntity(tetEntity);
    this.activePiece = tetEntity;
  } // spawnNextPiece

  moveLeft() {
    if (!this.isFastDropping && this.canMove(this.activePiece, -1, 0)) {
      this.activePiece.gridX -= 1;
      this.activePiece.x = this.boardEntity.fieldOffsetX + this.activePiece.gridX * TetrisConstants.BLOCK_SIZE;
      this.drawModel();
    }
  } // moveLeft

  moveRight() {
    if (!this.isFastDropping && this.canMove(this.activePiece, 1, 0)) {
      this.activePiece.gridX += 1;
      this.activePiece.x = this.boardEntity.fieldOffsetX + this.activePiece.gridX * TetrisConstants.BLOCK_SIZE;
      this.drawModel();
    }
  } // moveRight

  rotateActivePiece() {
    if (!this.activePiece) return;

    const newMatrix = this.activePiece.getNextStateMatrix();
    const nextIndex = (this.activePiece.currentStateIndex + 1) % this.activePiece.states.length;

    const testPiece = {
      gridX: this.activePiece.gridX,
      gridY: this.activePiece.gridY,
      currentMatrix: newMatrix,
    };

    if (this.canMove(testPiece, 0, 0)) {
      this.activePiece.updateBlocksPositions(newMatrix, nextIndex);
      this.drawModel();
    }
  } // rotateActivePiece

  hardDropActivePiece() {
    if (!this.activePiece || this.isFastDropping) return;
    this.isFastDropping = true;
    this.dropStartY = this.activePiece.gridY + 1;
  } // hardDropActivePiece

  canMove(piece, dx, dy) {
    const newGridX = piece.gridX + dx;
    const newGridY = piece.gridY + dy;
    const matrix = piece.currentMatrix;

    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col] === 1) {
          const boardX = newGridX + col;
          const boardY = newGridY + row;

          if (boardX < 0 || boardX >= TetrisConstants.BOARD_COLS || boardY >= TetrisConstants.BOARD_ROWS) {
            return false;
          }

          if (boardY >= 0 && this.boardGrid[boardY][boardX] !== 0) {
            return false;
          }
        }
      }
    }
    return true;
  } // canMove

  lockPiece(piece) {
    const matrix = piece.currentMatrix;

    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col] === 1) {
          const boardX = piece.gridX + col;
          const boardY = piece.gridY + row;

          if (boardY >= 0 && boardY < TetrisConstants.BOARD_ROWS) {
            this.boardGrid[boardY][boardX] = piece.color;
          }
        }
      }
    }
    piece.destroy();

    if (this.boardEntity.drawingCache?.[0]?.cleanCache) {
      this.boardEntity.drawingCache[0].cleanCache();
    }
  } // lockPiece

  updateLinesAndLevel(linesCleared) {
    if (linesCleared === 0) return;

    this.lines += linesCleared;

    if (this.lines >= 200) {
      const overflow = this.lines - 200;
      this.lines = 110 + overflow;
    }

    this.level = Math.floor(this.lines / 20);

    if (this.level > 9) {
      this.level = 9;
    }

    this.infoEntity.updateLines(this.lines);
    this.infoEntity.updateLevel(this.level);
  } // updateLinesAndLevel

  clearLines() {
    let linesCleared = 0;
    for (let y = TetrisConstants.BOARD_ROWS - 1; y >= 0; y--) {
      let isRowFull = true;

      for (let x = 0; x < TetrisConstants.BOARD_COLS; x++) {
        if (this.boardGrid[y][x] === 0) {
          isRowFull = false;
          break;
        }
      }

      if (isRowFull) {
        this.boardGrid.splice(y, 1);

        const emptyRow = Array(TetrisConstants.BOARD_COLS).fill(0);
        this.boardGrid.unshift(emptyRow);

        linesCleared++;
        y++;
      }
    }

    if (linesCleared > 0) {
      const lineReward = 8 + 6 * this.level;
      this.addScore(linesCleared * lineReward);

      this.updateLinesAndLevel(linesCleared);

      if (this.boardEntity.drawingCache?.[0]?.cleanCache) {
        this.boardEntity.drawingCache[0].cleanCache();
      }
      this.drawModel();
    }
  } // clearLines

  handleEvent(event) {
    if (super.handleEvent(event)) {
      return true;
    }

    if (this.gameOver) return false;

    if (this.inputController.handleEvent(event)) {
      return true;
    }

    return false;
  } // handleEvent

  loopModel(timestamp) {
    super.loopModel(timestamp);

    if (this.gameOver) return;

    if (!this.lastDropTime) {
      this.lastDropTime = timestamp;
    }

    if (this.isFastDropping) {
      if (this.activePiece) {
        if (this.canMove(this.activePiece, 0, 1)) {
          this.activePiece.gridY += 1;
          this.activePiece.y = this.boardEntity.fieldOffsetY + this.activePiece.gridY * TetrisConstants.BLOCK_SIZE;
        } else {
          const dropBonus = this.dropStartY * 2 + this.level;
          this.addScore(dropBonus);

          const baseReward = Math.floor(this.level / 2) + 6;

          setTimeout(() => {
            if (!this.gameOver) {
              this.addScore(baseReward);
              this.drawModel();
            }
          }, 60);

          this.lockPiece(this.activePiece);
          this.activePiece = null;
          this.clearLines();
          this.spawnNextPiece();
        }
      }
      this.drawModel();
      return;
    }

    const currentDelay = TetrisConstants.DROP_DELAYS_MS[this.level] || 100;

    if (timestamp - this.lastDropTime > currentDelay) {
      this.lastDropTime = timestamp;

      if (this.activePiece) {
        if (this.canMove(this.activePiece, 0, 1)) {
          this.activePiece.gridY += 1;
          this.activePiece.y = this.boardEntity.fieldOffsetY + this.activePiece.gridY * TetrisConstants.BLOCK_SIZE;
        } else {
          const baseReward = Math.floor(this.level / 2) + 6;
          this.addScore(baseReward);

          this.lockPiece(this.activePiece);
          this.activePiece = null;
          this.clearLines();
          this.spawnNextPiece();
        }
      }
    }

    this.drawModel();
  } // loopModel
} // TetrisModel

export default TetrisModel;
