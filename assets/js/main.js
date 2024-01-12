import levels from '../data/levels.json' assert { type: 'json' };
import { onWindowResize } from "./onWindowResize.js";
import { loadGame } from "./loadGame.js";

window.onresize = onWindowResize
onWindowResize()


const gameContainer = document.getElementById('game-container'); //initializes for reuse
loadGame(gameContainer)

