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

    this.activePiece = null;
    this.lastDropTime = 0;
    this.gameOver = false;

    this.boardGrid = Array(TetrisConstants.BOARD_ROWS)
      .fill(0)
      .map(() => Array(TetrisConstants.BOARD_COLS).fill(0));

    this.activeTouches = {};
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
    this.desktopEntity.addEntity(this.boardEntity);

    this.spawnNextPiece();
  } // init

  spawnNextPiece() {
    if (this.gameOver) return;

    const randomIndex = Math.floor(Math.random() * TETROMINOES_DATA.length);
    const data = TETROMINOES_DATA[randomIndex];

    let maxCol = 0;
    data.shape.forEach((coord) => {
      if (coord[0] > maxCol) maxCol = coord[0];
    });
    const pieceWidth = maxCol + 1;

    const spawnX = Math.floor((TetrisConstants.BOARD_COLS - pieceWidth) / 2);
    const spawnY = 0;

    const tetEntity = new TetrominoEntity(this.boardEntity, spawnX, spawnY, data.shape, data.color);

    if (!this.canMove(tetEntity, 0, 0)) {
      this.gameOver = true;
      this.activePiece = null;
      console.log("GAME OVER");
      return;
    }

    this.boardEntity.addEntity(tetEntity);
    this.activePiece = tetEntity;
  } // spawnNextPiece

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

    if (timestamp - this.lastDropTime > TetrisConstants.DROP_DELAY_MS) {
      this.lastDropTime = timestamp;

      if (this.activePiece) {
        if (this.canMove(this.activePiece, 0, 1)) {
          this.activePiece.gridY += 1;
          this.activePiece.y = this.activePiece.gridY * TetrisConstants.BLOCK_SIZE;
        } else {
          this.lockPiece(this.activePiece);
          this.activePiece = null;
          this.spawnNextPiece();
        }
      }
    }

    this.drawModel();
  } // loopModel
} // TetrisModel

export default TetrisModel;
