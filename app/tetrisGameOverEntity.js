/**/
const { AbstractEntity } = await import('./svision/js/abstractEntity.js?ver=' + window.srcVersion);
const { ZXColor } = await import('./svision/js/platform/canvas2D/zxSpectrum/zxColor.js?ver=' + window.srcVersion);
/*/
import AbstractEntity from './svision/js/abstractEntity.js';
import ZXColor from './svision/js/platform/canvas2D/zxSpectrum/zxColor.js';
/**/
// begin code

export class TetrisGameOverEntity extends AbstractEntity {
  constructor(parentEntity, x, y, width, height) {
    super(parentEntity, x, y, width, height, false, ZXColor.black);
    this.id = 'TetrisGameOverEntity';

    this.app.layout.newDrawingCache(this, 0);

    this.imageLoaded = false;
    this.img = new Image();
    this.img.onload = () => {
      this.imageLoaded = true;
      if (this.drawingCache && this.drawingCache[0] && this.drawingCache[0].cleanCache) {
        this.drawingCache[0].cleanCache();
      }
    };

    this.img.src =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAABoBAMAAADsqWT/AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAPUExURQAAAP///8DAwADAwAD//61pHYAAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuMTITAUd0AAAAuGVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAACAAAAMQECABEAAABaAAAAaYcEAAEAAABsAAAAAAAAAGAAAAABAAAAYAAAAAEAAABQYWludC5ORVQgNS4xLjEyAAADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlgAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAADZp5qVybcLXwAAArVJREFUWMPtl1uO3iAMhanFBroDyysYqRvIQ/a/poaLwQfIlbTStL8fRjkk/8fhYsM494n/PH78nAxW0KyTLwX5dSoWACld34LG9voyBYAW/TC7Q+1t+1JEbgKQX9KzzwTU3rYHEBiyoKUOxaeOQXvbfghSA8UCam/bj0ChI53L1aeOrfautieQH8/R1lHyEB9ix6id1/Y8R9aTBfVz0OgNsQbjOtneWrKgdlU6HRiBdgrSfdJ8WPUSNqJfpkEuDmt1847C7G+GXhha3AovgNYw2et1UErKESgm69LsI78LimVi7DBsiaJNcRiC8ushaPFVq6FHIKv/Fkirq0nKvVU8nqOcqLZM7O70w1WLr7vCdTTU9duA6pyczdExyKzS2apNJO1FUFtan4K6Yv8Q1B8/p6V3eBz1B+IpyBg6OLIvJ200dHCJeA7qrzFPQacXq6sXre6qBzV8oMertk5FBbnJKKBfk/E1ZeMTn/iTITlU5H8vKTYJBOqGQ/rA+Y+UdmLH8ClqRhBT4nMksnC2RCQkmzaBmqkxVJzyPZCgJTWUe7gDAkvBkM556KEHmW5RE1jaDCVP8WEIomoBtANLHBpyu4RV6UFmNGT1RiQ2ICYq7TICibEEOn5gQFsf+MMWBHunaupA4l4C8b8C4tsgXbEyp3Uf3QLlL0W/h31+A1R2NecNbHJN6BWQE+E3QCHp3A1QmSPGOSJxdj0vgHJqkYJolPxXQHk0rCAuI3P3HGm2l++HliZ39p1V+0ZJ24HyQEupbfVVUF7EcC6lndzoqyA4jqTXAtm1D8IDUjqNByTvg+DIDlWh0f2RvQcyl4hYFRp9HWSuNWlQqG+ASr7kMoUaL1pxRQsoNpgw/fXaGgqXiFJP4t2QBfuxdaLRBCSKv+bqAC9tdZcMNFqK2jhorpGf+MTj+A31IkNXhJijhwAAAABJRU5ErkJggg==';
  } // constructor

  init() {
    super.init();

    if (this.app.playerName && this.app.playerName.length > 0 && this.app.score > 0) {
      if (navigator.onLine) {
        this.fetchData('saveGame.db', false, { name: this.app.playerName, score: this.app.score });
      }
    }
  } // init

  drawEntity() {
    if (this.drawingCache[0].preparePaint(this.width, this.height)) {
      this.drawingCache[0].paint(0, 0, this.width, this.height, ZXColor.black);

      if (this.imageLoaded) {
        const ctx = this.drawingCache[0].ctx || this.drawingCache[0].canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.img, 0, 0, this.width, this.height);
      }
    }

    this.app.layout.paintCache(this, 0);
    super.drawSubEntities();
  } // drawEntity

  setData(data) {
    if (data && data.data && data.data.hiScore) {
      this.app.hiScore = data.data.hiScore;
    }
  } // setData

  errorData(error) {
    console.warn('Failed to save score to Hall of Fame:', error);
  } // errorData

  handleEvent(event) {
    if (super.handleEvent(event)) {
      return true;
    }

    switch (event.id) {
      case 'keyPress':
        if (['Enter', 'Escape', 'GamepadOK', 'GamepadExit'].includes(event.key)) {
          this.app.setModel(this.app.gameOverTarget);
          return true;
        }
        break;
      case 'keyRelease':
        if (['Mouse1', 'Touch'].includes(event.key)) {
          this.app.setModel(this.app.gameOverTarget);
          return true;
        }
        break;
    }

    return false;
  } // handleEvent
} // TetrisGameOverEntity

export default TetrisGameOverEntity;
