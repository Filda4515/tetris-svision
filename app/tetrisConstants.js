/**/
const { ZXColor } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxColor.js?ver=' + window.srcVersion);
/*/
import ZXColor from './svision/js/platform/canvas2D/zxSpectrum/zxColor.js';
/**/
// begin code

export const TetrisConstants = {
  BLOCK_SIZE: 8,
  GRID_LINE_WIDTH: 1,
  BOARD_COLS: 10,
  BOARD_ROWS: 20,
  DROP_DELAYS_MS: [800, 720, 630, 550, 470, 380, 300, 220, 130, 100],

  UI_PANEL_OFFSET_X: -64,
  UI_LABEL_WIDTH: 56,
  UI_LABEL_HEIGHT: 8,
  UI_LINE_SPACING: 10,
  UI_BLOCK_SPACING: 24,
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
    color: ZXColor.brightYellow,
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
    color: ZXColor.brightMagenta,
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
    color: ZXColor.brightBlue,
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
    color: ZXColor.brightWhite,
  },
];

export default TetrisConstants;
