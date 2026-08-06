/**/
const { AbstractEntity } = await import('./svision/js/abstractEntity.js?ver=' + window.srcVersion);
const { ZXColor } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxColor.js?ver=' + window.srcVersion);
/*/
import AbstractEntity from './svision/js/abstractEntity.js';
import ZXColor from './svision/js/platform/canvas2D/zxSpectrum/zxColor.js';
/**/
// begin code

export class TetrisBoardEntity extends AbstractEntity {
  constructor(parent, x, y, width, height) {
    var isInteractive = false;
    super(parent, x, y, width, height, isInteractive, ZXColor.black);
  } // constructor
} // TetrisBoardEntity

export default TetrisBoardEntity;
