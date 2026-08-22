/**/
const { AbstractEntity } = await import('./svision/js/abstractEntity.js?ver=' + window.srcVersion);
const { TextEntity } = await import('./svision/js/platform/canvas2D/textEntity.js?ver=' + window.srcVersion);
const { ZXColor } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxColor.js?ver=' + window.srcVersion);
/*/
import AbstractEntity from './svision/js/abstractEntity.js';
import TextEntity from './svision/js/platform/canvas2D/textEntity.js';
import ZXColor from './svision/js/platform/canvas2D/zxSpectrum/zxColor.js';
/**/
// begin code

export class TetrisGameOverEntity extends AbstractEntity {
  constructor(parentEntity, x, y, width, height) {
    super(parentEntity, x, y, width, height, false, ZXColor.black);
    this.id = 'TetrisGameOverEntity';
  } // constructor

  init() {
    super.init();

    this.addEntity(new AbstractEntity(this, 0, 0, this.width, 2, false, ZXColor.brightCyan));
    this.addEntity(new AbstractEntity(this, 0, this.height - 2, this.width, 2, false, ZXColor.brightCyan));
    this.addEntity(new AbstractEntity(this, 0, 0, 2, this.height, false, ZXColor.brightCyan));
    this.addEntity(new AbstractEntity(this, this.width - 2, 0, 2, this.height, false, ZXColor.brightCyan));

    this.addEntity(new TextEntity(this, this.app.fonts.zxFonts8x8, 0, 16, this.width, 8, 'GAME', ZXColor.brightCyan, false, { align: 'center' }));
    this.addEntity(new TextEntity(this, this.app.fonts.zxFonts8x8, 0, 32, this.width, 8, 'OVER', ZXColor.brightWhite, false, { align: 'center' }));
    
    // Nápověda pro návrat
    this.addEntity(new TextEntity(this, this.app.fonts.zxFonts8x8Mono, 0, 56, this.width, 8, 'PRESS ENTER TO EXIT', ZXColor.yellow, false, { align: 'center' }));

    if (this.app.playerName && this.app.playerName.length > 0 && this.app.score > 0) {
      if (navigator.onLine) {
        this.fetchData('saveGame.db', false, { name: this.app.playerName, score: this.app.score });
      }
    }
  } // init

  setData(data) {
    if (data && data.data && data.data.hiScore) {
      this.app.hiScore = data.data.hiScore;
    }
  } // setData

  errorData(error) {
    console.warn("Failed to save score to Hall of Fame:", error);
  } // errorData

  handleEvent(event) {
    if (super.handleEvent(event)) {
      return true;
    }

    switch (event.id) {
      case 'keyPress':
        if (['Enter', 'Escape', 'GamepadOK', 'GamepadExit'].includes(event.key)) {
          this.app.setModel('MenuModel');
          return true;
        }
        break;
    }

    return false;
  } // handleEvent
} // TetrisGameOverEntity

export default TetrisGameOverEntity;