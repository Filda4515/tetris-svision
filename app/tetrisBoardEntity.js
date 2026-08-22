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

  drawSideGaps() {
    const frameThickness = 9;
    const frameBottomY = this.fieldOffsetY + this.fieldHeight + frameThickness;

    const stripTop = Math.max(this.fieldOffsetY - TetrisConstants.TOP_BEVEL_OFFSET, this.leftMenuTR.y, this.rightMenuTL.y);
    const stripBottom = Math.min(frameBottomY, this.leftMenuBR.y, this.rightMenuBR.y);

    if (stripBottom <= stripTop) return;
    const stripH = stripBottom - stripTop;

    const leftGapWidth = this.fieldOffsetX - frameThickness - 1;
    if (leftGapWidth > 0) {
      this.app.layout.paint(this, 1, stripTop, leftGapWidth, stripH, ZXColor.brightCyan);
    }

    const rightStripX = this.fieldOffsetX + this.fieldWidth + frameThickness;
    const rightGapWidth = this.width - rightStripX - 1;
    if (rightGapWidth > 0) {
      this.app.layout.paint(this, rightStripX, stripTop, rightGapWidth, stripH, ZXColor.brightCyan);
    }
  } // drawSideGaps

  fillCornerBevel(fromPoint, toPoint, edgeX, color) {
    const dx = fromPoint.x - toPoint.x;
    const dy = fromPoint.y - toPoint.y;
    if (dy === 0) return;

    const dirX = dx > 0 ? 1 : -1;
    const dirY = dy > 0 ? 1 : -1;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const run = Math.min(absDx, absDy);

    for (let i = 0; i <= run; i++) {
      const x = toPoint.x + dirX * i;
      const y = toPoint.y + dirY * i;

      const xStart = Math.min(edgeX, x);
      const xEnd = Math.max(edgeX, x);

      if (xEnd > xStart) {
        this.app.layout.paint(this, xStart, y, xEnd - xStart, 1, color);
      }
    }
  } // fillCornerBevel

  drawWellBevel() {
    const fx = this.fieldOffsetX;
    const fy = this.fieldOffsetY;
    const frameThickness = 9;

    const frameTL = { x: fx - frameThickness, y: fy - TetrisConstants.TOP_BEVEL_OFFSET };
    const frameTR = { x: fx + this.fieldWidth + frameThickness, y: fy - TetrisConstants.TOP_BEVEL_OFFSET };

    const frameBL = { x: fx - frameThickness, y: fy + this.fieldHeight + frameThickness };
    const frameBR = { x: fx + this.fieldWidth + frameThickness, y: fy + this.fieldHeight + frameThickness };

    const bevelColor = ZXColor.brightCyan;

    this.fillCornerBevel(this.leftMenuTR, frameTL, 1, bevelColor);
    this.fillCornerBevel(this.leftMenuBR, frameBL, 1, bevelColor);
    this.fillCornerBevel(this.rightMenuTL, frameTR, this.width - 1, bevelColor);
    this.fillCornerBevel(this.rightMenuBR, frameBR, this.width - 1, bevelColor);
  } // drawWellBevel

  drawHighlights() {
    const cW = ZXColor.brightWhite;
    const frameThickness = 9;
    const cutoffY = this.fieldOffsetY + this.fieldHeight + frameThickness + 7;

    const leftLines = [
      { x: 2, w: 1 },
      { x: 5, w: 4 },
    ];

    for (let line of leftLines) {
      for (let col = line.x; col < line.x + line.w; col++) {
        let topY = this.leftMenuTR.y;
        let bottomY = this.leftMenuBR.y - col - 3;
        bottomY = Math.min(bottomY, cutoffY);

        if (bottomY > topY) {
          this.app.layout.paint(this, col, topY, 1, bottomY - topY, cW);
        }
      }
    }

    const rightLines = [
      { x: this.width - 3, w: 1 },
      { x: this.width - 9, w: 4 },
    ];

    for (let line of rightLines) {
      for (let col = line.x; col < line.x + line.w; col++) {
        let dist = this.width - col - 1;

        let topY = this.rightMenuTL.y;
        let bottomY = this.rightMenuBR.y - dist;
        bottomY = Math.min(bottomY, cutoffY);

        if (bottomY > topY) {
          this.app.layout.paint(this, col, topY, 1, bottomY - topY, cW);
        }
      }
    }
  } // drawHighlights

  drawZXBorder(fx, fy, fw, fh) {
    const cY = ZXColor.brightYellow;
    const cB = ZXColor.black;

    const drawChecker = (startX, startY, w, h, flip) => {
      this.app.layout.paint(this, startX, startY, w, h, cB);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const parity = flip ? startX + x + startY + y + 1 : startX + x + startY + y;
          if (parity % 2 === 0) {
            this.app.layout.paint(this, startX + x, startY + y, 1, 1, cY);
          }
        }
      }
    };

    // left
    this.app.layout.paint(this, fx - 9, fy - 2, 1, fh + 2, cB);
    drawChecker(fx - 8, fy - 2, 3, fh + 2, false);
    this.app.layout.paint(this, fx - 5, fy - 2, 1, fh + 2, cB);
    this.app.layout.paint(this, fx - 4, fy - 2, 4, fh + 2, cY);

    // right
    this.app.layout.paint(this, fx + fw, fy - 2, 4, fh + 2, cY);
    this.app.layout.paint(this, fx + fw + 4, fy - 2, 1, fh + 2, cB);
    drawChecker(fx + fw + 5, fy - 2, 3, fh + 2, true);
    this.app.layout.paint(this, fx + fw + 8, fy - 2, 1, fh + 2, cB);

    // bottom
    this.app.layout.paint(this, fx, fy + fh, fw, 4, cY);
    this.app.layout.paint(this, fx, fy + fh + 4, fw, 1, cB);
    drawChecker(fx, fy + fh + 5, fw, 3, false);
    this.app.layout.paint(this, fx, fy + fh + 8, fw, 1, cB);

    // bottom left
    for (let ly = 0; ly < 9; ly++) {
      for (let lx = 0; lx < 9; lx++) {
        let px = fx - 9 + lx;
        let py = fy + fh + ly;
        let color = cY;

        if (lx + ly === 8 && lx <= 4) {
          color = cB;
        } else if (lx + ly < 8) {
          if (lx === 0 || lx === 4) color = cB;
          else if (lx >= 1 && lx <= 3) color = (px + py) % 2 === 0 ? cY : cB;
        } else {
          if (ly === 8 || ly === 4) color = cB;
          else if (ly >= 5 && ly <= 7) color = (px + py) % 2 === 0 ? cY : cB;
        }
        this.app.layout.paint(this, px, py, 1, 1, color);
      }
    }

    // bottom right
    for (let ry = 0; ry < 9; ry++) {
      for (let rx = 0; rx < 9; rx++) {
        let px = fx + fw + rx;
        let py = fy + fh + ry;
        let color = cY;

        if (rx === ry && rx >= 4) {
          color = cB;
        } else if (rx > ry) {
          if (rx === 8 || rx === 4) color = cB;
          else if (rx >= 5 && rx <= 7) color = (px + py + 1) % 2 === 0 ? cY : cB;
        } else {
          if (ry === 8 || ry === 4) color = cB;
          else if (ry >= 5 && ry <= 7) color = (px + py) % 2 === 0 ? cY : cB;
        }
        this.app.layout.paint(this, px, py, 1, 1, color);
      }
    }

    const diamondPixels = ['BYBBYYYY', 'YBBYBYYY', 'BBYBYBYY', 'BYBYBYBY', 'YYYYYYYY', 'YBYYYYBY', 'BYBYYBYY', 'YBYBBYYY'];

    const drawDiamond = (startX, startY, flipX, rowStart = 0, rowCount = 8) => {
      for (let r = rowStart; r < rowStart + rowCount; r++) {
        for (let c = 0; c < 8; c++) {
          const pixelChar = flipX ? diamondPixels[r][7 - c] : diamondPixels[r][c];
          const color = pixelChar === 'Y' ? cY : cB;
          this.app.layout.paint(this, startX + c, startY + (r - rowStart), 1, 1, color);
        }
      }
    };

    drawDiamond(fx - 8, fy - 2, false, 4, 4);
    drawDiamond(fx + fw, fy - 2, true, 4, 4);

    for (let i = 0; i < 4; i++) {
      const dY = fy + 16 + i * 40;
      drawDiamond(fx - 8, dY, false);
      drawDiamond(fx + fw, dY, true);
    }
  } // drawZXBorder

  drawFloorLines() {
    const frameThickness = 9;
    const baseY = this.fieldOffsetY + this.fieldHeight + frameThickness;
    let currentY = baseY;

    for (let i = 0; i < 2; i++) {
      let dy = currentY - baseY;
      let leftBevelX = this.fieldOffsetX - frameThickness - dy;
      let rightBevelX = this.fieldOffsetX + this.fieldWidth + frameThickness + dy;

      let w = rightBevelX - leftBevelX - 2;
      this.app.layout.paint(this, leftBevelX + 1, currentY, w, 1, ZXColor.brightCyan);
      currentY++;
    }

    let gap = 1;

    while (currentY + gap < this.height) {
      currentY += gap;

      let dy = currentY - baseY;
      let leftBevelX = this.fieldOffsetX - frameThickness - dy;
      let rightBevelX = this.fieldOffsetX + this.fieldWidth + frameThickness + dy;

      let w = rightBevelX - leftBevelX - 2;
      if (w > 0) {
        this.app.layout.paint(this, leftBevelX + 1, currentY, w, 1, ZXColor.brightCyan);
      }

      currentY += 1;
      gap++;
    }
  } // drawFloorLines

  drawEntity() {
    super.drawEntity();

    this.drawSideGaps();
    this.drawWellBevel();
    this.drawHighlights();
    this.drawFloorLines();

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

    this.drawZXBorder(fx, fy, this.fieldWidth, this.fieldHeight);

    super.drawSubEntities();
  } // drawEntity
} // TetrisBoardEntity

export default TetrisBoardEntity;
