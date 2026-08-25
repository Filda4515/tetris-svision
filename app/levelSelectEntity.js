/**/
const { AbstractEntity } = await import('./svision/js/abstractEntity.js?ver=' + window.srcVersion);
const { TextEntity } = await import('./svision/js/platform/canvas2D/textEntity.js?ver=' + window.srcVersion);
const { TetrisConstants } = await import('./tetrisConstants.js?ver=' + window.srcVersion);
const { ZXColor } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxColor.js?ver=' + window.srcVersion);
/*/
import AbstractEntity from './svision/js/abstractEntity.js';
import TextEntity from './svision/js/platform/canvas2D/textEntity.js';
import TetrisConstants from './tetrisConstants.js';
import ZXColor from './svision/js/platform/canvas2D/zxSpectrum/zxColor.js';
/**/
// begin code

export class LevelSelectEntity extends AbstractEntity {
  constructor(parent, x, y, width, height) {
    super(parent, x, y, width, height, false, false);
    this.id = 'LevelSelectEntity';
    this.selectedLevel = null;

    this.textEntity = null;
    this.cursorEntity = null;
    this.lastText = '';
  } // constructor

  init() {
    super.init();

    const font = this.app.fonts.zxFonts8x8;
    const charSize = TetrisConstants.UI.FONT_SIZE;

    const textY = Math.floor((this.height - charSize) / 2);

    this.textEntity = new TextEntity(this, font, 0, textY, this.width, charSize, '', ZXColor.brightWhite, false, { align: 'center' });
    this.addEntity(this.textEntity);

    this.cursorEntity = new TextEntity(this, font, 0, textY, charSize, charSize, '█', ZXColor.brightWhite, false, { align: 'left' });
    this.addEntity(this.cursorEntity);
  } // init

  drawEntity(ctx, timestamp) {
    let currentText = 'HOW GOOD ARE YOU (0-9)  [5]  ?';

    if (this.selectedLevel !== null) {
      currentText += ' ' + this.selectedLevel;
    }

    if (currentText !== this.lastText) {
      this.textEntity.text = currentText;
      this.textEntity.cleanCache();
      this.lastText = currentText;

      const charSize = TetrisConstants.UI.FONT_SIZE;
      const textWidth = currentText.length * charSize;

      const textStartX = Math.floor((this.width - textWidth) / 2);
      this.cursorEntity.x = textStartX + textWidth + charSize;
    }

    if (this.selectedLevel !== null) {
      this.cursorEntity.hide = true;
    } else {
      this.cursorEntity.hide = Math.floor(timestamp / 400) % 2 !== 0;
    }

    super.drawSubEntities(ctx, timestamp);
  } // drawEntity
} // LevelSelectEntity

export default LevelSelectEntity;
