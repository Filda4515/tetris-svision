/**/
const { AbstractModel } = await import('./svision/js/abstractModel.js?ver=' + window.srcVersion);
const { TetrisBoardEntity } = await import('./tetrisBoardEntity.js?ver=' + window.srcVersion);
const { TetrominoEntity } = await import('./tetrominoEntity.js?ver=' + window.srcVersion);
const { ZXColor } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxColor.js?ver=' + window.srcVersion);
const { TetrisConstants, TETROMINOES_DATA } = await import('./tetrisConstants.js?ver=' + window.srcVersion);
const { TextEntity } = await import('./svision/js/platform/canvas2D/textEntity.js?ver=' + window.srcVersion);
/*/
import AbstractModel from './svision/js/abstractModel.js';
import TetrisBoardEntity from './tetrisBoardEntity.js';
import OTetrominoEntity from './oTetrominoEntity.js';
import ZXColor from './svision/js/platform/canvas2D/zxSpectrum/zxColor.js';
import TetrisConstants from './tetrisConstants.js';
import TextEntity from './svision/js/platform/canvas2D/textEntity.js';
/**/
// begin code

export class TetrisModel extends AbstractModel {
  constructor(app) {
    super(app);
    this.id = 'TetrisModel';
    this.boardEntity = null;

    this.activePiece = null;
    this.lastDropTime = 0;
    this.gameOver = false;

    this.boardGrid = Array(TetrisConstants.BOARD_ROWS)
      .fill(0)
      .map(() => Array(TetrisConstants.BOARD_COLS).fill(0));

    this.activeTouches = {};

    this.lastPieceIndex = null;

    this.lines = 0;
    this.level = 0;
    this.linesEntity = null;
    this.levelEntity = null;
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
    this.boardEntity.boardGrid = this.boardGrid;
    this.desktopEntity.addEntity(this.boardEntity);

    const panelX = boardX + TetrisConstants.UI_PANEL_OFFSET_X;
    const panelY = boardY;
    const label_width = TetrisConstants.UI_LABEL_WIDTH;
    const label_height = TetrisConstants.UI_LABEL_HEIGHT;
    const spaceL = TetrisConstants.UI_LINE_SPACING;
    const spaceB = TetrisConstants.UI_BLOCK_SPACING;

    this.desktopEntity.addEntity(
      new TextEntity(
        this.desktopEntity,
        this.app.fonts.zxFonts8x8,
        panelX,
        panelY,
        label_width,
        label_height,
        'LEVEL',
        ZXColor.yellow,
        false,
        { align: 'center' },
      ),
    );

    this.levelEntity = new TextEntity(
      this.desktopEntity,
      this.app.fonts.zxFonts8x8,
      panelX,
      panelY + spaceL,
      label_width,
      label_height,
      this.level.toString(),
      ZXColor.brightWhite,
      false,
      { align: 'center' },
    );
    this.desktopEntity.addEntity(this.levelEntity);

    this.desktopEntity.addEntity(
      new TextEntity(
        this.desktopEntity,
        this.app.fonts.zxFonts8x8,
        panelX,
        panelY + spaceB,
        label_width,
        label_height,
        'LINES',
        ZXColor.yellow,
        false,
        { align: 'center' },
      ),
    );

    this.linesEntity = new TextEntity(
      this.desktopEntity,
      this.app.fonts.zxFonts8x8,
      panelX,
      panelY + spaceB + spaceL,
      label_width,
      label_height,
      this.lines.toString(),
      ZXColor.brightWhite,
      false,
      { align: 'center' },
    );
    this.desktopEntity.addEntity(this.linesEntity);

    this.spawnNextPiece();
  } // init

  spawnNextPiece() {
    if (this.gameOver) return;

    let nextIndex = Math.floor(Math.random() * TETROMINOES_DATA.length);
    if (nextIndex === this.lastPieceIndex) {
      nextIndex = Math.floor(Math.random() * TETROMINOES_DATA.length);
    }

    this.lastPieceIndex = nextIndex;

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

    this.linesEntity.setText(this.lines.toString());
    this.levelEntity.setText(this.level.toString());
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

    switch (event.id) {
      case 'keyPress':
        if (!this.activePiece) return false;

        if (event.key === 'Touch') {
          this.activeTouches[event.identifier] = { x: event.x, y: event.y };
          return true;
        }

        let key = event.key;
        if (key.length === 1) {
          key = key.toUpperCase();
        }

        switch (key) {
          case this.app.controls.keyboard.left:
          case 'A':
          case 'GamepadLeft':
            if (this.canMove(this.activePiece, -1, 0)) {
              this.activePiece.gridX -= 1;
              this.activePiece.x = this.activePiece.gridX * TetrisConstants.BLOCK_SIZE;
              this.drawModel();
            }
            return true;
          case this.app.controls.keyboard.right:
          case 'D':
          case 'GamepadRight':
            if (this.canMove(this.activePiece, 1, 0)) {
              this.activePiece.gridX += 1;
              this.activePiece.x = this.activePiece.gridX * TetrisConstants.BLOCK_SIZE;
              this.drawModel();
            }
            return true;
          case this.app.controls.keyboard.down:
          case 'S':
          case 'GamepadDown':
            if (this.canMove(this.activePiece, 0, 1)) {
              this.activePiece.gridY += 1;
              this.activePiece.y = this.activePiece.gridY * TetrisConstants.BLOCK_SIZE;
              this.lastDropTime = this.app.now;
              this.drawModel();
            }
            return true;
          case this.app.controls.keyboard.rotate:
          case 'W':
          case 'GamepadOK':
            this.rotateActivePiece();
            return true;
        }
        break;

      case 'keyMove':
        if (event.key === 'Touch' && this.activeTouches[event.identifier] && this.activePiece) {
          const touchCenter = this.activeTouches[event.identifier];
          const deltaX = event.x - touchCenter.x;
          const deltaY = event.y - touchCenter.y;

          const swipeThreshold = 15;

          if (deltaX < -swipeThreshold) {
            if (this.canMove(this.activePiece, -1, 0)) {
              this.activePiece.gridX -= 1;
              this.activePiece.x = this.activePiece.gridX * TetrisConstants.BLOCK_SIZE;
              this.drawModel();
            }
            touchCenter.x = event.x;
            touchCenter.y = event.y;
          } else if (deltaX > swipeThreshold) {
            if (this.canMove(this.activePiece, 1, 0)) {
              this.activePiece.gridX += 1;
              this.activePiece.x = this.activePiece.gridX * TetrisConstants.BLOCK_SIZE;
              this.drawModel();
            }
            touchCenter.x = event.x;
            touchCenter.y = event.y;
          } else if (deltaY > swipeThreshold) {
            if (this.canMove(this.activePiece, 0, 1)) {
              this.activePiece.gridY += 1;
              this.activePiece.y = this.activePiece.gridY * TetrisConstants.BLOCK_SIZE;
              this.lastDropTime = this.app.now;
              this.drawModel();
            }
            touchCenter.x = event.x;
            touchCenter.y = event.y;
          }
          return true;
        }
        break;

      case 'keyRelease':
        if (event.key === 'Touch') {
          delete this.activeTouches[event.identifier];
          return true;
        }
        break;
    }

    return false;
  } // handleEvent

  loopModel(timestamp) {
    super.loopModel(timestamp);

    if (this.gameOver) return;

    if (!this.lastDropTime) {
      this.lastDropTime = timestamp;
    }

    const currentDelay = TetrisConstants.DROP_DELAYS_MS[this.level] || 100;

    if (timestamp - this.lastDropTime > currentDelay) {
      this.lastDropTime = timestamp;

      if (this.activePiece) {
        if (this.canMove(this.activePiece, 0, 1)) {
          this.activePiece.gridY += 1;
          this.activePiece.y = this.activePiece.gridY * TetrisConstants.BLOCK_SIZE;
        } else {
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
