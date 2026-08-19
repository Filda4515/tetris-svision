/**/
const { AbstractEntity } = await import('./svision/js/abstractEntity.js?ver=' + window.srcVersion);
const { TextEntity } = await import('./svision/js/platform/canvas2D/textEntity.js?ver=' + window.srcVersion);
const { ZXColor } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxColor.js?ver=' + window.srcVersion);
const { TetrisConstants, TETROMINOES_DATA } = await import('./tetrisConstants.js?ver=' + window.srcVersion);
/*/
import AbstractEntity from './svision/js/abstractEntity.js';
import TextEntity from './svision/js/platform/canvas2D/textEntity.js';
import ZXColor from './svision/js/platform/canvas2D/zxSpectrum/zxColor.js';
import TetrisConstants, { TETROMINOES_DATA } from './tetrisConstants.js';
/**/
// begin code

export class TetrisInfoEntity extends AbstractEntity {
  constructor(parentEntity, x, y, width, height) {
    super(parentEntity, x, y, width, height, false, false);
    this.id = 'TetrisInfoEntity';

    this.levelEntity = null;
    this.linesEntity = null;
    this.scoreEntity = null;
    this.statsTextEntities = {};
    this.statsSumEntity = null;

    this.app.layout.newDrawingCache(this, 0);
  } // constructor

  init() {
    super.init();

    const UI = TetrisConstants.UI;
    const font = this.app.fonts.zxFonts8x8Mono;

    const CONTENT_LEFT = UI.OUTER_LEFT_GAP + 2;
    const INNER_WHITE_LINE_X = CONTENT_LEFT + UI.INNER_WIDTH;
    const TOP_BOX_LABEL_X = INNER_WHITE_LINE_X - UI.TOP_BOX_WIDTH + UI.TOP_BOX_MARGIN.LEFT;
    const TOP_BOX_LABEL_Y = 2 + UI.TOP_BOX_MARGIN.TOP;
    const SCORE_LABEL_Y = UI.TOP_BLUE_HEIGHT + UI.SCORE_GAP + UI.SCORE_MARGIN.TOP + 2;
    const STATS_LABEL_Y = SCORE_LABEL_Y + 2 * UI.FONT_SIZE + UI.SCORE_MARGIN.BOTTOM + 3 + UI.STATS_MARGIN.TOP;
    const STATS_VALUE_LABEL_X = CONTENT_LEFT + 2 * UI.FONT_SIZE;
    const STATS_BOTTOM = STATS_LABEL_Y + UI.FONT_SIZE + 1 + UI.STATS_GAP + 7 * UI.FONT_SIZE + UI.STATS_MARGIN.BOTTOM;

    // LEVEL
    this.addEntity(
      new TextEntity(this, font, TOP_BOX_LABEL_X, TOP_BOX_LABEL_Y, 5 * UI.FONT_SIZE, UI.FONT_SIZE, 'LEVEL', UI.C_LBL_FG, UI.C_LBL_BG, {
        align: 'left',
      }),
    );
    this.levelEntity = new TextEntity(
      this,
      font,
      TOP_BOX_LABEL_X + UI.FONT_SIZE,
      TOP_BOX_LABEL_Y + UI.FONT_SIZE,
      4 * UI.FONT_SIZE,
      UI.FONT_SIZE,
      '0',
      UI.C_VAL_FG,
      UI.C_VAL_BG,
      {
        align: 'left',
      },
    );
    this.addEntity(this.levelEntity);

    // LINES
    this.addEntity(
      new TextEntity(
        this,
        font,
        TOP_BOX_LABEL_X,
        TOP_BOX_LABEL_Y + 2 * UI.FONT_SIZE,
        5 * UI.FONT_SIZE,
        UI.FONT_SIZE,
        'LINES',
        UI.C_LBL_FG,
        UI.C_LBL_BG,
        {
          align: 'left',
        },
      ),
    );
    this.linesEntity = new TextEntity(
      this,
      font,
      TOP_BOX_LABEL_X + UI.FONT_SIZE,
      TOP_BOX_LABEL_Y + 3 * UI.FONT_SIZE,
      4 * UI.FONT_SIZE,
      UI.FONT_SIZE,
      '0',
      UI.C_VAL_FG,
      UI.C_VAL_BG,
      {
        align: 'left',
      },
    );
    this.addEntity(this.linesEntity);

    // SCORE
    this.addEntity(
      new TextEntity(this, font, CONTENT_LEFT, SCORE_LABEL_Y, 6 * UI.FONT_SIZE, UI.FONT_SIZE, 'SCORE:', UI.C_LBL_FG, UI.C_LBL_BG, {
        align: 'left',
      }),
    );
    this.scoreEntity = new TextEntity(
      this,
      font,
      CONTENT_LEFT,
      SCORE_LABEL_Y + UI.FONT_SIZE,
      6 * UI.FONT_SIZE,
      UI.FONT_SIZE,
      '0',
      UI.C_VAL_FG,
      UI.C_VAL_BG,
      {
        align: 'left',
      },
    );
    this.addEntity(this.scoreEntity);

    // STATS
    this.addEntity(
      new TextEntity(this, font, CONTENT_LEFT, STATS_LABEL_Y, 6 * UI.FONT_SIZE, UI.FONT_SIZE, 'STATS:', UI.C_LBL_FG, UI.C_LBL_BG, {
        align: 'left',
      }),
    );

    let currentY = STATS_LABEL_Y + UI.FONT_SIZE + 1 + UI.STATS_GAP;
    for (let i = 0; i < UI.STATS_ORDER.length; i++) {
      const pieceIdx = UI.STATS_ORDER[i];
      const textEntity = new TextEntity(
        this,
        font,
        STATS_VALUE_LABEL_X,
        currentY,
        4 * UI.FONT_SIZE,
        UI.FONT_SIZE,
        '=0',
        UI.C_VAL_FG,
        UI.C_VAL_BG,
        {
          align: 'left',
        },
      );
      this.addEntity(textEntity);
      this.statsTextEntities[pieceIdx] = textEntity;
      currentY += UI.FONT_SIZE;
    }

    // SIGMA
    this.statsSumEntity = new TextEntity(
      this,
      font,
      CONTENT_LEFT + UI.SIGMA_MARGIN.LEFT,
      STATS_BOTTOM + UI.SIGMA_MARGIN.TOP + 1,
      3 * UI.FONT_SIZE,
      UI.FONT_SIZE,
      'Σ=0',
      UI.C_VAL_FG,
      UI.C_VAL_BG,
      {
        align: 'left',
      },
    );
    this.addEntity(this.statsSumEntity);
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

  updateStats(pieceIndex, count, sum) {
    if (this.statsTextEntities[pieceIndex]) {
      this.statsTextEntities[pieceIndex].setText('=' + count.toString());
    }
    if (this.statsSumEntity) {
      this.statsSumEntity.setText('Σ=' + sum.toString());
    }
  } // updateStats

  drawEntity() {
    if (this.drawingCache[0].preparePaint(this.width, this.height)) {
      const UI = TetrisConstants.UI;
      const c = this.drawingCache[0];

      const CONTENT_LEFT = UI.OUTER_LEFT_GAP + 2;
      const INNER_WHITE_LINE_X = CONTENT_LEFT + UI.INNER_WIDTH;
      const OUTER_RIGHT_GAP = UI.MENU_WIDTH - 1 - UI.INNER_WIDTH - UI.OUTER_LEFT_GAP - 2;

      // MAIN BACKGROUNDS
      c.paint(CONTENT_LEFT, 0, UI.INNER_WIDTH, this.height, UI.C_BG_BLACK); // main black bg
      c.paint(CONTENT_LEFT, 0, UI.INNER_WIDTH, UI.TOP_BLUE_HEIGHT, UI.C_BG_BLUE); // top blue bg
      c.paint(INNER_WHITE_LINE_X - 1, 0, OUTER_RIGHT_GAP + 2, this.height, UI.C_BG_BLUE); // right blue bg

      // OUTER BORDERS
      c.paint(0, 0, 1, this.height, UI.C_BORDER); // first left white
      c.paint(1, 0, UI.OUTER_LEFT_GAP, this.height, UI.C_BG_CYAN); // cyan gap
      c.paint(UI.OUTER_LEFT_GAP + 1, 0, 1, this.height, UI.C_BORDER); // second left white

      c.paint(UI.MENU_WIDTH - 1, 0, 1, this.height, UI.C_BORDER); // most right white

      // LEVEL / LINES TOP BOX
      const TOP_BOX_LEFT = INNER_WHITE_LINE_X - UI.TOP_BOX_WIDTH - 1;
      const TOP_BOX_BOTTOM = UI.TOP_BLUE_HEIGHT - 2;
      const TOP_BOX_CONTENT_LEFT = TOP_BOX_LEFT + UI.TOP_BOX_MARGIN.LEFT + 1;
      const TOP_BOX_CONTENT_WIDTH = UI.TOP_BOX_WIDTH - UI.TOP_BOX_MARGIN.LEFT - UI.TOP_BOX_MARGIN.RIGHT;
      const TOP_BOX_CONTENT_TOP = 2 + UI.TOP_BOX_MARGIN.TOP;

      c.paint(TOP_BOX_CONTENT_LEFT, TOP_BOX_BOTTOM - 1, TOP_BOX_CONTENT_WIDTH, 3, UI.C_BG_BLACK); // black indent bg

      c.paint(TOP_BOX_CONTENT_LEFT, TOP_BOX_CONTENT_TOP + UI.FONT_SIZE, TOP_BOX_CONTENT_WIDTH, UI.FONT_SIZE, UI.C_BG_BLACK); // level value black bg
      c.paint(TOP_BOX_CONTENT_LEFT, TOP_BOX_CONTENT_TOP + 3 * UI.FONT_SIZE, TOP_BOX_CONTENT_WIDTH, UI.FONT_SIZE, UI.C_BG_BLACK); // lines value black bg

      c.paint(TOP_BOX_LEFT, 1, UI.TOP_BOX_MARGIN.LEFT + 1, 1, UI.C_BORDER); // top
      c.paint(TOP_BOX_CONTENT_LEFT, 1, TOP_BOX_CONTENT_WIDTH, 1, ZXColor.brightCyan);
      c.paint(TOP_BOX_CONTENT_LEFT + TOP_BOX_CONTENT_WIDTH, -1, 1, 2, UI.C_BORDER);

      c.paint(TOP_BOX_LEFT, 1, 1, UI.TOP_BLUE_HEIGHT - 2, UI.C_BORDER); // left
      c.paint(INNER_WHITE_LINE_X, 2, 1, UI.TOP_BLUE_HEIGHT - 3, UI.C_BORDER); // right

      c.paint(TOP_BOX_LEFT, TOP_BOX_BOTTOM, UI.TOP_BOX_MARGIN.LEFT + 1, 1, UI.C_BORDER); // bottom
      c.paint(TOP_BOX_CONTENT_LEFT, TOP_BOX_BOTTOM, TOP_BOX_CONTENT_WIDTH, 1, ZXColor.blue);
      c.paint(TOP_BOX_CONTENT_LEFT + TOP_BOX_CONTENT_WIDTH, TOP_BOX_BOTTOM, UI.TOP_BOX_MARGIN.RIGHT + 1, 1, UI.C_BORDER);

      c.paint(TOP_BOX_CONTENT_LEFT, TOP_BOX_CONTENT_TOP - 1, TOP_BOX_CONTENT_WIDTH, 1, ZXColor.brightCyan); // level label top line

      // SCORE
      const SCORE_TOP = UI.TOP_BLUE_HEIGHT + UI.SCORE_GAP + 1;
      const SCORE_BOTTOM = SCORE_TOP + UI.SCORE_MARGIN.TOP + 2 * UI.FONT_SIZE + UI.SCORE_MARGIN.BOTTOM + 1;

      c.paint(CONTENT_LEFT + 1, SCORE_TOP + 2, UI.INNER_WIDTH - 2, UI.SCORE_MARGIN.TOP - 1, UI.C_BG_BLUE); // top blue bg

      c.paint(CONTENT_LEFT, SCORE_TOP, UI.INNER_WIDTH - 1, 1, ZXColor.blue); // top
      c.paint(INNER_WHITE_LINE_X - UI.SCORE_MARGIN.RIGHT, SCORE_TOP, UI.SCORE_MARGIN.RIGHT, 1, UI.C_BORDER);

      c.paint(INNER_WHITE_LINE_X, SCORE_TOP, 1, this.height - SCORE_TOP, UI.C_BORDER); // SCORE/STATS right

      c.paint(CONTENT_LEFT, SCORE_BOTTOM, UI.INNER_WIDTH, 1, UI.C_BORDER); // bottom
      c.paint(CONTENT_LEFT, SCORE_BOTTOM - 1, 1, 1, UI.C_BORDER);
      c.paint(INNER_WHITE_LINE_X - 1, SCORE_BOTTOM + 1, 1, 1, UI.C_BORDER);

      // STATS
      const STATS_TOP = SCORE_BOTTOM + 2;
      const STATS_LABEL_BOTTOM = STATS_TOP + UI.STATS_MARGIN.TOP + UI.FONT_SIZE + 1;
      const STATS_SQUARE_X = CONTENT_LEFT + UI.FONT_SIZE;
      const STATS_BOTTOM = STATS_LABEL_BOTTOM + UI.STATS_GAP + 7 * UI.FONT_SIZE + UI.STATS_MARGIN.BOTTOM + 1;

      c.paint(CONTENT_LEFT, STATS_TOP, UI.INNER_WIDTH - 1, 1, UI.C_BORDER); // top

      c.paint(CONTENT_LEFT + 1, STATS_LABEL_BOTTOM, UI.INNER_WIDTH - 2, 1, UI.C_BORDER); // stats label bottom line

      let currentY = STATS_LABEL_BOTTOM + UI.STATS_GAP + 1;
      for (let i = 0; i < UI.STATS_ORDER.length; i++) {
        const pieceIdx = UI.STATS_ORDER[i];
        const color = TETROMINOES_DATA[pieceIdx].color;
        c.paint(STATS_SQUARE_X, currentY, UI.FONT_SIZE, UI.FONT_SIZE, color);
        currentY += UI.FONT_SIZE;
      }

      c.paint(CONTENT_LEFT, STATS_BOTTOM, UI.INNER_WIDTH - 1, 1, UI.C_BORDER); // bottom

      // SIGMA
      const SIGMA_BOTTOM = STATS_BOTTOM + UI.SIGMA_MARGIN.TOP + UI.FONT_SIZE + UI.SIGMA_MARGIN.BOTTOM;

      c.paint(CONTENT_LEFT, SIGMA_BOTTOM, UI.INNER_WIDTH - 1, 1, UI.C_BORDER); // bottom

      // BOTTOM BEVEL

    }

    this.app.layout.paintCache(this, 0);
    super.drawSubEntities();
  } // drawEntity
} // TetrisInfoEntity

export default TetrisInfoEntity;
