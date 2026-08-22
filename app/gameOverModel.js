/**/
const { AbstractModel } = await import('./svision/js/abstractModel.js?ver=' + window.srcVersion);
const { TextEntity } = await import('./svision/js/platform/canvas2D/textEntity.js?ver=' + window.srcVersion);
const { ZXColor } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxColor.js?ver=' + window.srcVersion);
/*/
import AbstractModel from './svision/js/abstractModel.js';
import TextEntity from './svision/js/platform/canvas2D/textEntity.js';
import ZXColor from './svision/js/platform/canvas2D/zxSpectrum/zxColor.js';
/**/
// begin code

export class GameOverModel extends AbstractModel {
  constructor(app) {
    super(app);
    this.id = 'GameOverModel';
    this.timer = false;
  }

  init() {
    super.init();

    this.desktopEntity.bkColor = ZXColor.black;
    this.borderEntity.bkColor = ZXColor.black;

    // Nápis GAME OVER
    this.desktopEntity.addEntity(
      new TextEntity(this.desktopEntity, this.app.fonts.zxFonts8x8, 0, 10 * 8, 32 * 8, 8, 'GAME OVER', ZXColor.brightRed, false, { align: 'center' })
    );

    // Zobrazení nahraného skóre (předpokládáme, že budeš ukládat aktuální skóre do this.app.score)
    let finalScore = this.app.score || 0;
    this.desktopEntity.addEntity(
      new TextEntity(this.desktopEntity, this.app.fonts.zxFonts8x8, 0, 14 * 8, 32 * 8, 8, `SCORE: ${finalScore}`, ZXColor.brightWhite, false, { align: 'center' })
    );

    // Odeslání do síně slávy, pokud máme jméno
    if (this.app.playerName && finalScore > 0) {
      this.fetchData('saveGame.db', false, { name: this.app.playerName, score: finalScore });
    }
  }

  setData(data) {
    if (data && data.data && data.data.hiScore) {
      this.app.hiScore = data.data.hiScore;
    }
  }

  errorData() {
    // Ignorujeme, pokud server nejede
  }

  loopModel(timestamp) {
    super.loopModel(timestamp);

    // Automatický návrat do menu po 5 vteřinách
    if (this.timer === false) {
      this.timer = timestamp;
    } else if (timestamp - this.timer > 5000) {
      this.app.setModel('MenuModel');
    }

    this.drawModel();
  }
}

export default GameOverModel;