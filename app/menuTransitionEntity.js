/**/
const { AbstractEntity } = await import('./svision/js/abstractEntity.js?ver=' + window.srcVersion);
const { TetrisConstants } = await import('./tetrisConstants.js?ver=' + window.srcVersion);
const { ZXColor } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxColor.js?ver=' + window.srcVersion);
/*/
import AbstractEntity from './svision/js/abstractEntity.js';
import TetrisConstants from './tetrisConstants.js';
import ZXColor from './svision/js/platform/canvas2D/zxSpectrum/zxColor.js';
/**/
// begin code

export class MenuTransitionEntity extends AbstractEntity {
  constructor(parent, x, y, width, height) {
    super(parent, x, y, width, height, false, false);
    this.id = 'MenuTransitionEntity';
    this.startTime = null;
    this.lastPhase = -1;

    this.duration = TetrisConstants.TRANSITION.COLOR_DURATION_MS;
    this.stagger = TetrisConstants.TRANSITION.COLOR_DURATION_MS;

    this.colors = [ZXColor.white, ZXColor.brightCyan, ZXColor.blue, ZXColor.black];

    this.app.layout.newDrawingCache(this, 0);
  } // constructor

  init() {
    super.init();
    this.startTime = this.app.now;
  } // init

  drawHole(c, holeW, holeH, color, deskW, deskH) {
    if (holeW >= deskW && holeH >= deskH) return;

    if (holeW <= 0 || holeH <= 0) {
      c.paint(0, 0, deskW, deskH, color);
      return;
    }

    const holeX = Math.floor((deskW - holeW) / 2);
    const holeY = Math.floor((deskH - holeH) / 2);

    c.paint(0, 0, deskW, holeY, color); // top
    c.paint(0, holeY + holeH, deskW, deskH - (holeY + holeH), color); // bottom
    c.paint(0, holeY, holeX, holeH, color); // left
    c.paint(holeX + holeW, holeY, deskW - (holeX + holeW), holeH, color); // right
  } // drawHole

  drawEntity() {
    if (!this.startTime) return;

    if (this.drawingCache && this.drawingCache[0]) {
      this.drawingCache[0].cleanCache();
    }

    if (this.drawingCache[0].preparePaint(this.width, this.height)) {
      const c = this.drawingCache[0];
      const elapsed = this.app.now - this.startTime;

      const currentPhase = Math.floor(elapsed / this.stagger);

      if (currentPhase > this.lastPhase && currentPhase < this.colors.length) {
        this.model.borderEntity.setBkColor(this.colors[currentPhase]);
        this.lastPhase = currentPhase;
      }

      for (let i = 0; i < this.colors.length; i++) {
        const colorStart = i * this.stagger;
        if (elapsed < colorStart) continue;

        let p = (elapsed - colorStart) / this.duration;
        if (p > 1) p = 1;

        let holeW = this.width * (1 - p);
        let holeH = this.height * (1 - p);

        holeW = Math.floor(holeW / 8) * 8;
        holeH = Math.floor(holeH / 8) * 8;

        this.drawHole(c, holeW, holeH, this.colors[i], this.width, this.height);
      }
    }

    this.app.layout.paintCache(this, 0);
    super.drawSubEntities();
  } // drawEntity
} // MenuTransitionEntity

export default MenuTransitionEntity;
