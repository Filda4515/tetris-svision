/**/
const { AbstractEntity } = await import('./svision/js/abstractEntity.js?ver=' + window.srcVersion);
const { TetrisConstants } = await import('./tetrisConstants.js?ver=' + window.srcVersion);
const { TextEntity } = await import('./svision/js/platform/canvas2D/textEntity.js?ver=' + window.srcVersion);
const { ZXColor } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxColor.js?ver=' + window.srcVersion);
/*/
import AbstractEntity from './svision/js/abstractEntity.js';
import TetrisConstants from './tetrisConstants.js';
import TextEntity from './svision/js/platform/canvas2D/textEntity.js';
import ZXColor from './svision/js/platform/canvas2D/zxSpectrum/zxColor.js';
/**/
// begin code

export class TetrisRightMenuEntity extends AbstractEntity {
  constructor(parentEntity, x, y, width, height) {
    super(parentEntity, x, y, width, height, false, false);
    this.id = 'TetrisRightMenuEntity';
    this.app.layout.newDrawingCache(this, 0);
  } // constructor

  init() {
    super.init();

    const UI = TetrisConstants.UI;
    const font = this.app.fonts.zxFonts8x8Mono;

    const GAP = (UI.MENU_WIDTH - UI.R_INNER_WIDTH - 2) / 2;
    const CONTENT_LEFT = GAP + 1;

    this.addEntity(
      new TextEntity(this, font, CONTENT_LEFT, UI.HELP_TOP, UI.FONT_SIZE * 6, UI.FONT_SIZE, 'HELP', UI.C_LBL_FG, false, {
        align: 'center',
      }),
    );

    const helpText = 'I..←\nP..→\nO..◎\nS..?\nY..↑\nSP.↓\n\n QUIT';

    this.addEntity(
      new TextEntity(
        this,
        font,
        CONTENT_LEFT,
        UI.HELP_TOP + UI.FONT_SIZE * 2,
        UI.FONT_SIZE * 6,
        UI.FONT_SIZE * 8,
        helpText,
        ZXColor.brightWhite,
        false,
        {
          align: 'center',
        },
      ),
    );

    const NEXT_TOP = UI.HELP_TOP + UI.FONT_SIZE + UI.HELP_HEIGHT + 2;
    const NEXT_CONTENT_WIDTH = 4 * UI.FONT_SIZE;
    const NEXT_CONTENT_X = CONTENT_LEFT + 1 + Math.floor((UI.R_INNER_WIDTH - 2) / 2) - Math.floor(NEXT_CONTENT_WIDTH / 2) - 1;
    const NEXT_CONTENT_Y = NEXT_TOP + UI.NEXT_CONTENT_PADDING;

    this.addEntity(
      new TextEntity(this, font, NEXT_CONTENT_X, NEXT_CONTENT_Y + 1, NEXT_CONTENT_WIDTH, UI.FONT_SIZE, 'NEXT', UI.C_LBL_FG, false, {
        align: 'center',
      }),
    );
  } // init

  drawDiagonalUntilY(c, startX, startY, dirX, dirY, targetY, color) {
    const steps = Math.abs(targetY - startY);

    for (let i = 0; i <= steps; i++) {
      const px = startX + i * dirX;
      const py = startY + i * dirY;

      c.paint(px, py, 1, 1, color);
    }
    return startX + steps * dirX;
  } // drawDiagonalUntilY

  drawEntity() {
    if (this.drawingCache[0].preparePaint(this.width, this.height)) {
      const UI = TetrisConstants.UI;
      const c = this.drawingCache[0];

      const GAP = (UI.MENU_WIDTH - UI.R_INNER_WIDTH - 2) / 2;
      const CONTENT_LEFT = GAP + 1;
      const CONTENT_RIGHT = CONTENT_LEFT + UI.R_INNER_WIDTH;

      // MAIN BACKGROUNDS
      c.paint(CONTENT_LEFT - 1, 0, UI.R_INNER_WIDTH + 2, this.height, UI.C_BG_BLACK); // main black bg
      c.paint(0, 0, CONTENT_LEFT, this.height, UI.C_BG_BLUE); // left blue bg
      c.paint(0, 0, this.width, UI.HELP_TOP, UI.C_BG_BLUE); // top blue bg
      c.paint(CONTENT_RIGHT + 1, 0, this.width - CONTENT_RIGHT - 1, this.height, UI.C_BG_BLUE); // right blue bg

      // OUTER BORDERS
      c.paint(0, 0, 1, this.height, UI.C_BORDER); // left
      c.paint(this.width - 1, 0, 1, this.height, UI.C_BORDER); // left

      // HELP
      const HELP_CONTENT_TOP = UI.HELP_TOP + UI.FONT_SIZE;
      const HELP_BOTTOM = HELP_CONTENT_TOP + UI.HELP_HEIGHT;

      c.paint(CONTENT_LEFT, UI.HELP_TOP, UI.FONT_SIZE * 6 + 1, UI.FONT_SIZE - 1, UI.C_LBL_BG); // yellow label bg

      c.paint(CONTENT_LEFT, UI.HELP_TOP, 1, 1, UI.C_BG_BLACK); // label TL corner

      c.paint(CONTENT_RIGHT, UI.HELP_TOP, 1, 2, UI.C_BG_BLACK); // label TR corner
      c.paint(CONTENT_RIGHT - 1, UI.HELP_TOP, 1, 1, UI.C_BG_BLACK);

      c.paint(CONTENT_LEFT + 2, HELP_CONTENT_TOP - 1, UI.R_INNER_WIDTH - 3, 1, UI.C_BORDER); // label bottom

      c.paint(CONTENT_LEFT - 1, UI.HELP_TOP + 2, 1, UI.FONT_SIZE - 2 + UI.HELP_MARGIN.TOP, ZXColor.brightCyan); // left
      c.paint(CONTENT_LEFT - 1, HELP_CONTENT_TOP + UI.HELP_MARGIN.TOP, 1, UI.HELP_HEIGHT - UI.HELP_MARGIN.TOP + 1, UI.C_BORDER);

      c.paint(CONTENT_RIGHT, HELP_CONTENT_TOP, 1, UI.HELP_HEIGHT - UI.T_HEIGHT + 3, UI.C_BORDER); // right
      c.paint(CONTENT_RIGHT - 1, HELP_CONTENT_TOP, 1, 1, UI.C_BORDER);

      c.paint(CONTENT_LEFT, HELP_CONTENT_TOP, 2, 1, UI.C_BORDER); // TL white L
      c.paint(CONTENT_LEFT, HELP_CONTENT_TOP, 1, UI.HELP_MARGIN.TOP, UI.C_BORDER);

      // T
      const T_TOP = HELP_BOTTOM - UI.T_HEIGHT - 1;

      c.paint(CONTENT_LEFT - 1, T_TOP, UI.R_INNER_WIDTH + 2, 1, UI.C_BORDER); // top

      c.paint(CONTENT_RIGHT, T_TOP + 4, 1, UI.T_HEIGHT - 4, ZXColor.brightCyan); // right

      c.paint(CONTENT_LEFT, HELP_BOTTOM, UI.R_INNER_WIDTH + 1, 1, ZXColor.brightCyan); // bottom
      c.paint(CONTENT_LEFT, HELP_BOTTOM - 2, UI.R_INNER_WIDTH + 1, 1, ZXColor.brightCyan);

      c.paint(CONTENT_LEFT, T_TOP + 1, 2, 1, UI.C_BORDER); // TL
      c.paint(CONTENT_LEFT, T_TOP + 2, 1, 1, UI.C_BORDER);

      c.paint(CONTENT_RIGHT - 2, T_TOP + 1, 2, 1, UI.C_BORDER); // TR
      c.paint(CONTENT_RIGHT - 1, T_TOP + 2, 1, 1, UI.C_BORDER);

      c.paint(CONTENT_LEFT, HELP_BOTTOM - 4, 1, 4, ZXColor.brightCyan); // BL
      c.paint(CONTENT_LEFT + 1, HELP_BOTTOM - 3, 1, 1, ZXColor.brightCyan);

      c.paint(CONTENT_RIGHT - 1, HELP_BOTTOM - 4, 1, 2, ZXColor.brightCyan); // BR
      c.paint(CONTENT_RIGHT - 2, HELP_BOTTOM - 3, 1, 1, ZXColor.brightCyan);

      // T LOGO
      const T_X = CONTENT_LEFT + Math.floor(UI.R_INNER_WIDTH / 2);
      const T_Y = T_TOP + 7;

      c.paint(T_X - UI.T_LOGO_WIDTH / 2, T_Y, UI.T_LOGO_WIDTH, 3, ZXColor.brightCyan); // top

      c.paint(T_X - UI.T_LOGO_WIDTH / 2, T_Y + 3, 3, 1, ZXColor.brightCyan); // left
      c.paint(T_X - UI.T_LOGO_WIDTH / 2, T_Y + 4, 2, 1, ZXColor.brightCyan);
      c.paint(T_X - UI.T_LOGO_WIDTH / 2, T_Y + 5, 1, 1, ZXColor.brightCyan);

      c.paint(T_X + UI.T_LOGO_WIDTH / 2, T_Y + 3, -3, 1, ZXColor.brightCyan); // right
      c.paint(T_X + UI.T_LOGO_WIDTH / 2, T_Y + 4, -2, 1, ZXColor.brightCyan);
      c.paint(T_X + UI.T_LOGO_WIDTH / 2, T_Y + 5, -1, 1, ZXColor.brightCyan);

      c.paint(T_X - 3, T_Y + 3, 6, UI.T_LOGO_HEIGHT - 3, ZXColor.brightCyan); // middle

      c.paint(T_X - 4, T_Y + UI.T_LOGO_HEIGHT - 2, 8, 1, ZXColor.brightCyan); // bottom
      c.paint(T_X - 6, T_Y + UI.T_LOGO_HEIGHT - 1, 12, 1, ZXColor.brightCyan);
      c.paint(T_X - 8, T_Y + UI.T_LOGO_HEIGHT, 16, 1, ZXColor.brightCyan);

      // NEXT
      const NEXT_TOP = HELP_BOTTOM + 2;
      const NEXT_LEFT = CONTENT_LEFT + 1;
      const NEXT_RIGHT = NEXT_LEFT + UI.R_INNER_WIDTH - 1;
      const NEXT_HEIGHT = this.height - NEXT_TOP;
      const NEXT_DIAGONAL_TOP = this.height - UI.NEXT_DIAGONAL_HEIGHT - 1;

      c.paint(NEXT_LEFT, NEXT_TOP, UI.R_INNER_WIDTH, this.height - NEXT_TOP, UI.C_BG_CYAN); // cyan bg

      c.paint(CONTENT_LEFT - 1, NEXT_TOP, 1, NEXT_HEIGHT - UI.NEXT_DIAGONAL_HEIGHT, UI.C_BORDER); // left

      c.paint(NEXT_RIGHT - 1, NEXT_TOP, 1, NEXT_HEIGHT - UI.NEXT_DIAGONAL_HEIGHT, UI.C_BG_BLACK); // right

      const NEXT_BOTTOM_LEFT = this.drawDiagonalUntilY(c, CONTENT_LEFT, NEXT_DIAGONAL_TOP - 1, 1, 1, this.height - 2, UI.C_BG_BLACK); // left diagonal
      this.drawDiagonalUntilY(c, CONTENT_LEFT, NEXT_DIAGONAL_TOP + 2, 1, 1, this.height, UI.C_BG_BLACK);
      c.paint(CONTENT_LEFT, NEXT_DIAGONAL_TOP, 1, 2, ZXColor.brightCyan);

      const NEXT_BOTTOM_RIGHT = this.drawDiagonalUntilY(c, NEXT_RIGHT - 1, NEXT_DIAGONAL_TOP, -1, 1, this.height - 2, UI.C_BG_BLACK); // right diagonal
      this.drawDiagonalUntilY(c, NEXT_RIGHT, NEXT_DIAGONAL_TOP + 2, -1, 1, this.height, UI.C_BG_BLACK);

      c.paint(NEXT_BOTTOM_LEFT, this.height - 2, NEXT_BOTTOM_RIGHT - NEXT_BOTTOM_LEFT + 1, 1, UI.C_BG_BLACK); // bottom

      // NEXT CONTENT BOX
      const NEXT_CONTENT_WIDTH = 4 * UI.FONT_SIZE + 2;
      const NEXT_CONTENT_X = NEXT_LEFT + Math.floor((UI.R_INNER_WIDTH - 2) / 2) - Math.floor(NEXT_CONTENT_WIDTH / 2);
      const NEXT_CONTENT_Y = NEXT_TOP + UI.NEXT_CONTENT_PADDING;

      c.paint(NEXT_CONTENT_X, NEXT_CONTENT_Y, NEXT_CONTENT_WIDTH, 1, UI.C_BG_BLACK); // top
      c.paint(NEXT_CONTENT_X - 1, NEXT_CONTENT_Y + 1, 1, UI.NEXT_CONTENT_HEIGHT, UI.C_BG_BLACK); // left
      c.paint(NEXT_CONTENT_X + NEXT_CONTENT_WIDTH, NEXT_CONTENT_Y + 1, 1, UI.NEXT_CONTENT_HEIGHT, UI.C_BG_BLACK); // right
      c.paint(NEXT_CONTENT_X, NEXT_CONTENT_Y + UI.NEXT_CONTENT_HEIGHT, NEXT_CONTENT_WIDTH, 1, UI.C_BG_BLACK); // bottom

      c.paint(NEXT_CONTENT_X + 1, NEXT_CONTENT_Y + 1, UI.FONT_SIZE * 4, UI.FONT_SIZE, UI.C_LBL_BG); // yellow label bg
      c.paint(
        NEXT_CONTENT_X + 1,
        NEXT_CONTENT_Y + UI.FONT_SIZE + 1,
        NEXT_CONTENT_WIDTH - 2,
        UI.NEXT_CONTENT_HEIGHT - UI.FONT_SIZE - 2,
        UI.C_BG_BLACK,
      ); // black bg
    }

    this.app.layout.paintCache(this, 0);
    super.drawSubEntities();
  } // drawEntity
} // TetrisRightMenuEntity

export default TetrisRightMenuEntity;
