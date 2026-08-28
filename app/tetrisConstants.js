/**/
const { ZXColor } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxColor.js?ver=' + window.srcVersion);
/*/
import ZXColor from './svision/js/platform/canvas2D/zxSpectrum/zxColor.js';
/**/
// begin code

export const TetrisConstants = {
  BLOCK_SIZE: 8,
  BOARD_COLS: 10,
  BOARD_ROWS: 20,
  DROP_DELAYS_MS: [800, 720, 630, 550, 470, 380, 300, 220, 130, 100],

  BOARD_GAP: 24,
  TAPER_TOP: 9,
  TAPER_BOTTOM: 23,
  TOP_BEVEL_OFFSET: 4,

  UI: {
    MENU_WIDTH: 64,
    FONT_SIZE: 8,

    OUTSIDE_OUTER_LEFT_GAP: 3,
    OUTER_LEFT_GAP: 1,
    INNER_WIDTH: 49,

    TOP_BOX_WIDTH: 42,
    TOP_BOX_MARGIN: {
      TOP: 6,
      LEFT: 1,
      RIGHT: 1,
    },
    TOP_BLUE_HEIGHT: 48,

    SCORE_GAP: 2,
    SCORE_MARGIN: {
      TOP: 4,
      RIGHT: 1,
      BOTTOM: 4,
    },

    STATS_MARGIN: {
      TOP: 7,
      BOTTOM: 4,
    },
    STATS_GAP: 6,

    SIGMA_MARGIN: {
      TOP: 5,
      LEFT: 1,
      BOTTOM: 1,
    },

    C_BG_BLACK: ZXColor.black,
    C_BG_BLUE: ZXColor.blue,
    C_BG_CYAN: ZXColor.brightCyan,
    C_BORDER: ZXColor.brightWhite,

    C_LBL_FG: ZXColor.black,
    C_LBL_BG: ZXColor.brightYellow,
    C_VAL_FG: ZXColor.brightWhite,
    C_VAL_BG: false,

    // [L (White), I (Yellow), T (Cyan), Z (Green), S (Magenta), O (Red), J (Blue)]
    STATS_ORDER: [6, 0, 2, 4, 3, 1, 5],

    R_INNER_WIDTH: 48,

    HELP_TOP: 8,
    HELP_HEIGHT: 114,
    HELP_MARGIN: {
      TOP: 8,
    },

    T_HEIGHT: 38,
    T_LOGO_WIDTH: 32,
    T_LOGO_HEIGHT: 26,

    NEXT_CONTENT_PADDING: 4,
    NEXT_CONTENT_HEIGHT: 41,
    NEXT_DIAGONAL_HEIGHT: 16,
  },

  TRANSITION: {
    COLOR_DURATION_MS: 500,
    TOTAL_DURATION_MS: 2100, // 4 * 500 + 100
  },
};

export const TETROMINOES_DATA = [
  {
    // I-tetromino
    states: [
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
      ],
    ],
    color: ZXColor.yellow,
  },
  {
    // O-tetromino
    states: [
      [
        [1, 1],
        [1, 1],
      ],
    ],
    color: ZXColor.brightRed,
  },
  {
    // T-tetromino
    states: [
      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0],
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
      ],
      [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0],
      ],
    ],
    color: ZXColor.brightCyan,
  },
  {
    // S-tetromino
    states: [
      [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1],
      ],
    ],
    color: ZXColor.magenta,
  },
  {
    // Z-tetromino
    states: [
      [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0],
      ],
    ],
    color: ZXColor.brightGreen,
  },
  {
    // J-tetromino
    states: [
      [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1],
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
      ],
    ],
    color: ZXColor.blue,
  },
  {
    // L-tetromino
    states: [
      [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0],
      ],
      [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ],
    ],
    color: ZXColor.white,
  },
];

export default TetrisConstants;
