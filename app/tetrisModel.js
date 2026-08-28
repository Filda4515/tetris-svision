/**/
const { AbstractModel } = await import('./svision/js/abstractModel.js?ver=' + window.srcVersion);
const { BorderEntity } = await import('./borderEntity.js?ver=' + window.srcVersion);
const { MenuTransitionEntity } = await import('./menuTransitionEntity.js?ver=' + window.srcVersion);
const { PauseGameEntity } = await import('./pauseGameEntity.js?ver=' + window.srcVersion);
const { TetrisBoardEntity } = await import('./tetrisBoardEntity.js?ver=' + window.srcVersion);
const { TetrisConstants, TETROMINOES_DATA } = await import('./tetrisConstants.js?ver=' + window.srcVersion);
const { TetrisGameOverEntity } = await import('./tetrisGameOverEntity.js?ver=' + window.srcVersion);
const { TetrisInputController } = await import('./tetrisInputController.js?ver=' + window.srcVersion);
const { TetrisInfoEntity } = await import('./tetrisInfoEntity.js?ver=' + window.srcVersion);
const { TetrisRightMenuEntity } = await import('./tetrisRightMenuEntity.js?ver=' + window.srcVersion);
const { TetrominoEntity } = await import('./tetrominoEntity.js?ver=' + window.srcVersion);
const { ZXColor } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxColor.js?ver=' + window.srcVersion);
/*/
import AbstractModel from './svision/js/abstractModel.js';
import BorderEntity from './borderEntity.js';
import MenuTransitionEntity from './menuTransitionEntity.js';
import PauseGameEntity from './pauseGameEntity.js';
import TetrisBoardEntity from './tetrisBoardEntity.js';
import TetrisConstants, { TETROMINOES_DATA } from './tetrisConstants.js';
import TetrisGameOverEntity from './tetrisGameOverEntity.js';
import TetrisInputController from './tetrisInputController.js';
import TetrisInfoEntity from './tetrisInfoEntity.js';
import TetrisRightMenuEntity from './tetrisRightMenuEntity.js';
import TetrominoEntity from './tetrominoEntity.js';
import ZXColor from './svision/js/platform/canvas2D/zxSpectrum/zxColor.js';
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
    this.gameOverTimeout = null;

    this.isFastDropping = false;
    this.dropStartY = 0;

    this.boardGrid = Array(TetrisConstants.BOARD_ROWS)
      .fill(0)
      .map(() => Array(TetrisConstants.BOARD_COLS).fill(0));

    this.lastPieceIndex = null;

    this.nextPieceIndex = null;
    this.nextPieceEntity = null;

    this.score = 0;
    this.lines = 0;
    this.level = this.app.startLevel;
    this.statsCount = [0, 0, 0, 0, 0, 0, 0];
    this.statsSum = 0;

    this.inputController = new TetrisInputController(this);
  } // constructor

  init() {
    super.init();

    this.borderEntity.bkColor = ZXColor.black;
    this.desktopEntity.bkColor = ZXColor.brightCyan;

    const cx = Math.floor(this.desktopWidth / 2);

    const UI = TetrisConstants.UI;

    const bdW = TetrisConstants.BOARD_COLS * TetrisConstants.BLOCK_SIZE;
    const bdH = TetrisConstants.BOARD_ROWS * TetrisConstants.BLOCK_SIZE;
    const bdX = cx - Math.floor(bdW / 2);

    const taperTotal = TetrisConstants.TAPER_TOP + TetrisConstants.TAPER_BOTTOM;
    const bdY = Math.round(((this.desktopHeight - bdH) * TetrisConstants.TAPER_TOP) / taperTotal);

    const lmW = UI.MENU_WIDTH;
    const lmX = bdX - TetrisConstants.BOARD_GAP - lmW;
    const lmY = 0;
    const lmH = this.desktopHeight;

    const rmW = UI.MENU_WIDTH;
    const rmX = bdX + bdW + TetrisConstants.BOARD_GAP;
    const rmY = 0;
    const rmH = this.desktopHeight;

    const frame = { lmX, lmY, lmW, lmH, rmX, rmY, rmW, rmH };
    this.boardEntity = new TetrisBoardEntity(this.desktopEntity, bdX, bdY, bdW, bdH, frame);
    this.boardEntity.boardGrid = this.boardGrid;
    this.desktopEntity.addEntity(this.boardEntity);

    this.infoEntity = new TetrisInfoEntity(this.desktopEntity, lmX, lmY, lmW, lmH);
    this.desktopEntity.addEntity(this.infoEntity);
    this.infoEntity.updateLevel(this.level);

    this.rightMenuEntity = new TetrisRightMenuEntity(this.desktopEntity, rmX, rmY, rmW, rmH);
    this.desktopEntity.addEntity(this.rightMenuEntity);

    this.nextPieceIndex = this.generateRandomPieceIndex();

    this.spawnNextPiece();
  } // init

  newBorderEntity() {
    return new BorderEntity(true, false);
  } // newBorderEntity

  addScore(points) {
    this.score += points;
    this.infoEntity.updateScore(this.score);
  } // addScore

  generateRandomPieceIndex() {
    let nextIndex = Math.floor(Math.random() * TETROMINOES_DATA.length);
    if (nextIndex === this.lastPieceIndex) {
      nextIndex = Math.floor(Math.random() * TETROMINOES_DATA.length);
    }
    this.lastPieceIndex = nextIndex;
    return nextIndex;
  }

  spawnNextPiece() {
    if (this.gameOver) return;

    this.isFastDropping = false;

    const currentIndex = this.nextPieceIndex;
    this.statsCount[currentIndex]++;
    this.statsSum++;
    if (this.infoEntity) {
      this.infoEntity.updateStats(currentIndex, this.statsCount[currentIndex], this.statsSum);
    }

    const data = TETROMINOES_DATA[currentIndex];
    const initialMatrix = data.states[0];
    const matrixCols = initialMatrix[0].length;

    const spawnX = Math.floor((TetrisConstants.BOARD_COLS - matrixCols) / 2);
    const spawnY = 0;

    const tetEntity = new TetrominoEntity(this.boardEntity, spawnX, spawnY, data.states, data.color);

    this.boardEntity.addEntity(tetEntity);

    if (this.nextPieceEntity) {
      this.nextPieceEntity.destroy();
      this.nextPieceEntity = null;
    }

    const testPiece = {
      gridX: spawnX,
      gridY: spawnY,
      currentMatrix: initialMatrix,
    };

    if (!this.canMove(testPiece, 0, 0)) {
      this.showGameOver('MainModel');
      return;
    }

    this.activePiece = tetEntity;

    this.nextPieceIndex = this.generateRandomPieceIndex();
    const nextData = TETROMINOES_DATA[this.nextPieceIndex];

    const UI = TetrisConstants.UI;
    const NEXT_LEFT = (UI.MENU_WIDTH - UI.R_INNER_WIDTH - 2) / 2 + 2;
    const NEXT_CONTENT_WIDTH = 4 * UI.FONT_SIZE;
    const NEXT_CONTENT_X = NEXT_LEFT + Math.floor((UI.R_INNER_WIDTH - 2) / 2) - Math.floor(NEXT_CONTENT_WIDTH / 2);
    const NEXT_TOP = UI.HELP_TOP + UI.FONT_SIZE + UI.HELP_HEIGHT + 2;
    const NEXT_CONTENT_Y = NEXT_TOP + UI.NEXT_CONTENT_PADDING + UI.FONT_SIZE * 2;

    this.nextPieceEntity = new TetrominoEntity(this.rightMenuEntity, 0, 0, nextData.states, nextData.color);

    this.nextPieceEntity.x = NEXT_CONTENT_X;
    this.nextPieceEntity.y = NEXT_CONTENT_Y;

    let blockIdx = 0;
    const nMatrix = nextData.states[0];
    for (let row = 0; row < nMatrix.length; row++) {
      for (let col = 0; col < nMatrix[row].length; col++) {
        if (nMatrix[row][col] === 1 && blockIdx < 4) {
          this.nextPieceEntity.blocks[blockIdx].x = col * TetrisConstants.BLOCK_SIZE;
          this.nextPieceEntity.blocks[blockIdx].y = row * TetrisConstants.BLOCK_SIZE;
          blockIdx++;
        }
      }
    }

    this.rightMenuEntity.addEntity(this.nextPieceEntity);
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
    this.sendEvent(0, { id: 'playSound', bus: 'sounds', sound: 'dropSound', options: false });
    piece.destroy();

    if (this.boardEntity.drawingCache && this.boardEntity.drawingCache[0] && this.boardEntity.drawingCache[0].cleanCache) {
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

    this.level = this.app.startLevel + Math.floor(this.lines / 20);

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

      if (this.boardEntity.drawingCache && this.boardEntity.drawingCache[0] && this.boardEntity.drawingCache[0].cleanCache) {
        this.boardEntity.drawingCache[0].cleanCache();
      }
      this.drawModel();
    }
  } // clearLines

  showGameOver(targetModel) {
    if (this.gameOver) return;
    this.gameOver = true;
    this.activePiece = null;
    this.app.score = this.score;
    this.app.gameOverTarget = targetModel;

    this.sendEvent(0, { id: 'playSound', bus: 'music', sound: 'gameOverMelody', options: false });

    if (this.desktopEntity.modalEntity) {
      this.desktopEntity.modalEntity.shutdown();
      this.desktopEntity.modalEntity = null;
    }

    const boxWidth = 144;
    const boxHeight = 104;
    const boxX = Math.floor((this.desktopWidth - boxWidth) / 2);
    const boxY = Math.floor((this.desktopHeight - boxHeight) / 2);
    this.desktopEntity.addModalEntity(new TetrisGameOverEntity(this.desktopEntity, boxX, boxY, boxWidth, boxHeight));

    this.sendEvent(2000, { id: 'startGameOverTransition' });
  } // showGameOver

  handleEvent(event) {
    if (super.handleEvent(event)) {
      return true;
    }

    if (event.id === 'startGameOverTransition') {
      this.desktopEntity.addEntity(new MenuTransitionEntity(this.desktopEntity, 0, 0, this.desktopWidth, this.desktopHeight));
      this.sendEvent(TetrisConstants.TRANSITION.TOTAL_DURATION_MS, { id: 'finishGameOverTransition' });
      return true;
    }

    if (event.id === 'finishGameOverTransition') {
      this.app.setModel(this.app.gameOverTarget);
      return true;
    }

    if (this.gameOver) {
      if (event.id === 'keyPress' || event.id === 'keyRelease') return true;
      return false;
    }

    switch (event.id) {
      case 'keyPress':
        var key = event.key;
        if (key.length == 1) {
          key = key.toUpperCase();
        }

        switch (key) {
          case 'Escape':
          case 'GamepadExit':
            if (!this.desktopEntity.modalEntity) {
              this.desktopEntity.addModalEntity(new PauseGameEntity(this.desktopEntity, 52, 40, 153, 85, 'PAUSED', 'TetrisExitToMenu'));
            }
            return true;
        }
        break;
    }

    if (this.inputController.handleEvent(event)) {
      return true;
    }

    return false;
  } // handleEvent

  loopModel(timestamp) {
    super.loopModel(timestamp);

    if (this.desktopEntity.modalEntity) {
      this.desktopEntity.modalEntity.loopEntity(timestamp);
      this.drawModel();
      return;
    }

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

  shutdown() {
    super.shutdown();

    this.sendEvent(0, { id: 'stopAllAudioBuses' });
  } // shutdown
} // TetrisModel

export default TetrisModel;
