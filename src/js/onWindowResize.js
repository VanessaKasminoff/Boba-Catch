import settings from '/assets/data/settings.json' with { type: 'json' };
import { resizeGameArea } from './loadGame.js';
let heightValue = settings.windowSize.heightValue
let widthValue = settings.windowSize.widthValue

let windowIsBigEnough = true
export function onWindowResize(){

    //Below checks height and width against height and width defined in settings.json
    if(window.innerHeight < heightValue || window.innerWidth < widthValue) {
        console.log(`Hiding page... Window too small as ${window.innerHeight} and ${window.innerWidth}`)
        windowIsBigEnough = false
        document.getElementById("display-area").style = "opacity: 0"
        let widthOrHeightProblem = ""
        if(window.innerHeight < heightValue && window.innerWidth < widthValue){widthOrHeightProblem = "wider and taller"}
        else if (window.innerHeight < heightValue) {widthOrHeightProblem = "taller"}
        else if (window.innerWidth < widthValue) {widthOrHeightProblem = "wider"}
        document.getElementById("window-size-warning").textContent = (`Please make me ${widthOrHeightProblem} to play the game. - Sincerely, the window.`)
    } else if (window.innerHeight >= heightValue && window.innerWidth >= widthValue && windowIsBigEnough === false){
        console.log(`Page has become large enough as ${window.innerHeight} and ${window.innerWidth}`)
        document.getElementById("window-size-warning").textContent = ""
        windowIsBigEnough = true
        document.getElementById("display-area").style = "opacity: 1"
    } else if (window.innerHeight >= heightValue && window.innerWidth >= widthValue && windowIsBigEnough === true){
        console.log(`Page still large enough as ${window.innerHeight} and ${window.innerWidth}`)
        document.getElementById("window-size-warning").textContent = ""
    }
    // Below resizes the game area with a function from loadGame.js
    resizeGameArea(document.getElementById("game-container"))
}

//mohammad's window size function 