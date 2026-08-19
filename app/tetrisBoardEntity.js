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

export class TetrisBoardEntity extends AbstractEntity {
  constructor(parent, bdX, bdY, bdW, bdH, frame) {
    const isInteractive = false;

    const left = frame.lmX + frame.lmW;
    const right = frame.rmX;
    const top = Math.min(bdY, frame.lmY, frame.rmY);
    const bottom = Math.max(bdY + bdH, frame.lmY + frame.lmH, frame.rmY + frame.rmH);

    super(parent, left, top, right - left, bottom - top, isInteractive, ZXColor.black);

    this.fieldWidth = bdW;
    this.fieldHeight = bdH;
    this.fieldOffsetX = bdX - left;
    this.fieldOffsetY = bdY - top;

    this.leftMenuTR = { x: frame.lmX + frame.lmW - left, y: frame.lmY - top };
    this.leftMenuBR = { x: frame.lmX + frame.lmW - left, y: frame.lmY + frame.lmH - top };
    this.rightMenuTL = { x: frame.rmX - left, y: frame.rmY - top };
    this.rightMenuBR = { x: frame.rmX - left, y: frame.rmY + frame.rmH - top };

    this.boardGrid = null;
  } // constructor

  drawLine(x0, y0, x1, y1, color) {
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = x0 < x1 ? 1 : -1;
    let sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    while (true) {
      this.app.layout.paint(this, x0, y0, 1, 1, color);
      if (x0 === x1 && y0 === y1) break;
      let e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
  } // drawLine

  drawSideGaps() {
    const stripTop = Math.max(this.fieldOffsetY, this.leftMenuTR.y, this.rightMenuTL.y);
    const stripBottom = Math.min(this.fieldOffsetY + this.fieldHeight, this.leftMenuBR.y, this.rightMenuBR.y);
 
    if (stripBottom <= stripTop) return;
    const stripH = stripBottom - stripTop;
 
    this.app.layout.paint(this, 0, stripTop, this.fieldOffsetX, stripH, ZXColor.brightCyan);
 
    const rightStripX = this.fieldOffsetX + this.fieldWidth;
    this.app.layout.paint(this, rightStripX, stripTop, this.width - rightStripX, stripH, ZXColor.brightCyan);
  } // drawSideGaps

  drawWellBevel() {
    const fx = this.fieldOffsetX;
    const fy = this.fieldOffsetY;

    const boardTL = { x: fx, y: fy };
    const boardTR = { x: fx + this.fieldWidth, y: fy };
    const boardBL = { x: fx, y: fy + this.fieldHeight };
    const boardBR = { x: fx + this.fieldWidth, y: fy + this.fieldHeight };

    const bevelColor = ZXColor.brightCyan;

    this.drawLine(this.leftMenuTR.x, this.leftMenuTR.y, boardTL.x, boardTL.y, bevelColor);
    this.drawLine(this.leftMenuBR.x, this.leftMenuBR.y, boardBL.x, boardBL.y, bevelColor);
    this.drawLine(this.rightMenuTL.x, this.rightMenuTL.y, boardTR.x, boardTR.y, bevelColor);
    this.drawLine(this.rightMenuBR.x, this.rightMenuBR.y, boardBR.x, boardBR.y, bevelColor);
  } // drawWellBevel

  drawEntity() {
    super.drawEntity();

    this.drawSideGaps();
    this.drawWellBevel();

    const fx = this.fieldOffsetX;
    const fy = this.fieldOffsetY;

    if (this.boardGrid) {
      const subSize = TetrisConstants.BLOCK_SIZE - TetrisConstants.GRID_LINE_WIDTH;
      for (let y = 0; y < TetrisConstants.BOARD_ROWS; y++) {
        for (let x = 0; x < TetrisConstants.BOARD_COLS; x++) {
          const blockColor = this.boardGrid[y][x];

          if (blockColor !== 0) {
            this.app.layout.paint(
              this,
              fx + x * TetrisConstants.BLOCK_SIZE,
              fy + y * TetrisConstants.BLOCK_SIZE,
              subSize,
              subSize,
              blockColor,
            );
          }
        }
      }
    }

    const borderColor = ZXColor.brightYellow;
    this.app.layout.paint(this, fx, fy, this.fieldWidth, TetrisConstants.GRID_LINE_WIDTH, borderColor);
    this.app.layout.paint(this, fx, fy, TetrisConstants.GRID_LINE_WIDTH, this.fieldHeight, borderColor);

    this.app.layout.paint(
      this,
      fx,
      fy + this.fieldHeight - TetrisConstants.GRID_LINE_WIDTH,
      this.fieldWidth,
      TetrisConstants.GRID_LINE_WIDTH,
      borderColor,
    );
    this.app.layout.paint(
      this,
      fx + this.fieldWidth - TetrisConstants.GRID_LINE_WIDTH,
      fy,
      TetrisConstants.GRID_LINE_WIDTH,
      this.fieldHeight,
      borderColor,
    );

    super.drawSubEntities();
  } // drawEntity
} // TetrisBoardEntity

export default TetrisBoardEntity;
