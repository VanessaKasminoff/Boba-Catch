import settings from '../data/settings.json' assert { type: 'json' };

let heightValue = settings.windowSize.heightValue
let widthValue = settings.windowSize.widthValue

export function resizeGameArea(container) {
        let solutionWidth
    if (window.innerWidth * 2 > window.innerHeight){ //window height is limiting factor
        solutionWidth = window.innerHeight * 0.96 / 2
    } else if (window.innerWidth * 2 <= window.innerHeight){ //window width is limiting factor or both equal
        solutionWidth = window.innerWidth * 0.96
    }
    container.style.height = (`${solutionWidth * 2}px`)
    container.style.width = (`${solutionWidth}px`)
    container.style.top = (`${window.innerHeight * 0.02}px`)
}

export function loadGame(container) {
    resizeGameArea(container)
    
}