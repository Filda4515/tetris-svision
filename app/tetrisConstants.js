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
  UI_BLOCK_SPACING: 24
};

export const TETROMINOES_DATA = [
  { shape: [[0, 0], [1, 0], [2, 0], [3, 0]], color: ZXColor.brightYellow, x: 1, y: 1 }, // I
  { shape: [[0, 0], [1, 0], [0, 1], [1, 1]], color: ZXColor.brightRed, x: 6, y: 1 }, // O
  { shape: [[1, 0], [0, 1], [1, 1], [2, 1]], color: ZXColor.brightCyan, x: 1, y: 4 }, // T
  { shape: [[1, 0], [2, 0], [0, 1], [1, 1]], color: ZXColor.brightMagenta, x: 6, y: 4 },// S
  { shape: [[0, 0], [1, 0], [1, 1], [2, 1]], color: ZXColor.brightGreen, x: 1, y: 8 }, // Z
  { shape: [[0, 0], [0, 1], [1, 1], [2, 1]], color: ZXColor.brightBlue, x: 6, y: 8 }, // J
  { shape: [[2, 0], [0, 1], [1, 1], [2, 1]], color: ZXColor.brightWhite, x: 1, y: 12 }, // L
];

export default TetrisConstants;
