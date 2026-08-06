/**/
const { GameApp } = await import('./gameApp.js?ver=' + window.srcVersion);
const { appPlatform } = await import('./appPlatform.js?ver=' + window.srcVersion);
/*/
import GameApp from './gameApp.js';
import appPlatform from './appPlatform.js';
/**/
// begin code

const gameApp = new GameApp(appPlatform(), window.importPath, window.wsURL, window.devModeName, window.appIconSprite);

function loopGame(timestamp) {
  gameApp.loopApp(timestamp);
  requestAnimationFrame(loopGame);
} // loopGame

// events processing
window.addEventListener('resize', (event) => gameApp.eventResizeWindow(event));

// start game
gameApp.eventResizeWindow(null);
requestAnimationFrame(loopGame);
