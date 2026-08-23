/**/
const { AbstractEntity } = await import('./svision/js/abstractEntity.js?ver=' + window.srcVersion);
const { ZXColor } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxColor.js?ver=' + window.srcVersion);
/*/
import AbstractEntity from './svision/js/abstractEntity.js';
import ZXColor from './svision/js/platform/canvas2D/zxSpectrum/zxColor.js';
/**/
// begin code

export class TetrisTitleEntity extends AbstractEntity {
  constructor(parent, x, y, width, height) {
    super(parent, x, y, width, height, false, ZXColor.black);
    this.id = 'TetrisTitleEntity';

    this.app.layout.newDrawingCache(this, 0);

    this.base64Image =
      'data:image/png;base64,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';

    this.imageLoaded = false;
    this.img = new Image();
    this.img.onload = () => {
      this.imageLoaded = true;
      if (this.drawingCache && this.drawingCache[0] && this.drawingCache[0].cleanCache) {
        this.drawingCache[0].cleanCache();
      }
    };
    this.img.src = this.base64Image;
  } // constructor

  drawEntity() {
    if (this.drawingCache[0].preparePaint(this.width, this.height)) {
      this.drawingCache[0].paint(0, 0, this.width, this.height, ZXColor.black);

      if (this.imageLoaded) {
        const ctx = this.drawingCache[0].ctx || this.drawingCache[0].canvas.getContext('2d');
        ctx.drawImage(this.img, 0, 0);
      }
    }

    this.app.layout.paintCache(this, 0);
    super.drawSubEntities();
  } // drawEntity
} // TetrisTitleEntity

export default TetrisTitleEntity;
