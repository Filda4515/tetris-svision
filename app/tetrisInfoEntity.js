/**/
const { AbstractEntity } = await import('./svision/js/abstractEntity.js?ver=' + window.srcVersion);
const { TextEntity } = await import('./svision/js/platform/canvas2D/textEntity.js?ver=' + window.srcVersion);
const { ZXColor } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxColor.js?ver=' + window.srcVersion);
const { TetrisConstants } = await import('./tetrisConstants.js?ver=' + window.srcVersion);
/*/
import AbstractEntity from './svision/js/abstractEntity.js';
import TextEntity from './svision/js/platform/canvas2D/textEntity.js';
import ZXColor from './svision/js/platform/canvas2D/zxSpectrum/zxColor.js';
import TetrisConstants from './tetrisConstants.js';
/**/
// begin code

export class TetrisInfoEntity extends AbstractEntity {
  constructor(parentEntity, x, y, width, height) {
    super(parentEntity, x, y, width, height, false, false);
    this.id = 'TetrisInfoEntity';

    this.levelEntity = null;
    this.linesEntity = null;
    this.scoreEntity = null;
  } // constructor

  init() {
    super.init();

    const labelWidth = TetrisConstants.UI_LABEL_WIDTH;
    const labelHeight = TetrisConstants.UI_LABEL_HEIGHT;

    const spaceL = 8;
    const spaceB = 16;
    const indentLabel = 16;
    const indentValue = 32;

    let currentY = 0;

    // LEVEL
    this.addEntity(
      new TextEntity(this, this.app.fonts.zxFonts8x8, indentLabel, currentY, labelWidth, labelHeight, 'LEVEL', ZXColor.yellow, false, {
        align: 'left',
      }),
    );
    this.levelEntity = new TextEntity(
      this,
      this.app.fonts.zxFonts8x8,
      indentValue,
      currentY + spaceL,
      labelWidth,
      labelHeight,
      '0',
      ZXColor.brightWhite,
      false,
      { align: 'left' },
    );
    this.addEntity(this.levelEntity);

    currentY += spaceL * 2;

    // LINES
    this.addEntity(
      new TextEntity(this, this.app.fonts.zxFonts8x8, indentLabel, currentY, labelWidth, labelHeight, 'LINES', ZXColor.yellow, false, {
        align: 'left',
      }),
    );
    this.linesEntity = new TextEntity(
      this,
      this.app.fonts.zxFonts8x8,
      indentValue,
      currentY + spaceL,
      labelWidth,
      labelHeight,
      '0',
      ZXColor.brightWhite,
      false,
      { align: 'left' },
    );
    this.addEntity(this.linesEntity);

    currentY += spaceL * 2 + spaceB;

    // SCORE:
    this.addEntity(
      new TextEntity(this, this.app.fonts.zxFonts8x8, 0, currentY, labelWidth, labelHeight, 'SCORE:', ZXColor.yellow, false, {
        align: 'left',
      }),
    );
    this.scoreEntity = new TextEntity(
      this,
      this.app.fonts.zxFonts8x8,
      0,
      currentY + spaceL,
      labelWidth,
      labelHeight,
      '0',
      ZXColor.brightWhite,
      false,
      { align: 'left' },
    );
    this.addEntity(this.scoreEntity);
  } // init

  updateLevel(level) {
    if (this.levelEntity) {
      this.levelEntity.setText(level.toString());
    }
  } // updateLevel

  updateLines(lines) {
    if (this.linesEntity) {
      this.linesEntity.setText(lines.toString());
    }
  } // updateLines

  updateScore(score) {
    if (this.scoreEntity) {
      this.scoreEntity.setText(score.toString());
    }
  } // updateScore
} // TetrisInfoEntity

export default TetrisInfoEntity;
