//hasn't been implemented// import levels from '../data/levels.json' assert { type: 'json' };
import { onWindowResize } from "./onWindowResize.js";
import { loadSplash } from "./loadSplash.js"

window.onresize = onWindowResize
onWindowResize()


const gameContainer = document.getElementById('game-container'); //initializes for reuse

loadSplash(gameContainer)
// loadGame(gameContainer)

