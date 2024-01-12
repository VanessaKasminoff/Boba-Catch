import settings from '../data/settings.json' assert { type: 'json' };
let cupWidth = settings.game.cupSizePercent
let gameArea // if this value was returned in resizeGameArea, then it would only be returned for the instance it was invoked. This is problematic because we need this value to be changed on each resize.

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
    gameArea =  {
        width: solutionWidth,
        height: solutionWidth*2
        }
     
}

function createCup() {
    let cup = document.createElement("div")
    cup.id = "cup"
    cup.style = `
    width: ${cupWidth * 2}%;
    height: ${cupWidth}%;
    background: darkblue;
    position: absolute;
    `

    return cup
}

//CUP MOVEMENT
function attachCupMouseMovement(cup, gameContainer) {
    gameContainer.addEventListener('mousemove', function(e) {
        //gets the position of the container relative to the viewport.
        const gameContainerPos = gameContainer.getBoundingClientRect();
        //mouse coords relative to the container = mouse absolute coordinates - containers relative position.
        const mouseX = e.clientX - gameContainerPos.left;
        //updates the cup's position.
        let halfCupWidth = cupWidth * 0.01 * gameArea.width
        cup.style.left = (mouseX - halfCupWidth)+ 'px';

        //sets static position of cup to stop it from moving past the right side of the container.
        if (mouseX >= gameArea.width * 0.9 + halfCupWidth) {
            cup.style.left = (gameArea.width * 0.9)+ 'px'
        }
        if (mouseX <= halfCupWidth){
            cup.style.left = 0 + "px"
        }
    });
}


export function loadGame(gameContainer) {
    resizeGameArea(gameContainer)
    let cup = createCup()
    gameContainer.append(cup)
    attachCupMouseMovement(cup, gameContainer)

// GENERATE FALLING BOBA

function createBoba() {
    let bobaSize = settings.game.bobaSizePercent
    let bobaStart = gameArea.height - bobaSize;
    let bobaX = Math.floor(Math.random() * gameArea.width);
    const boba = document.createElement('div');
    boba.setAttribute("class", 'boba');
    boba.style = `
    width: ${bobaSize}%;
    height: ${bobaSize / 2}%;
    border-radius: 50%;
    background: black;
    position: absolute;
    `
    gameContainer.append(boba)

    function fallingBoba() {
        bobaStart -= 8;
        boba.style.bottom = bobaStart + 'px';
        boba.style.left = bobaX + 'px';
        if(bobaStart < (0.1 * gameArea.height)) {
            boba.remove();
        }
    }
    setInterval(fallingBoba, 30);
    setTimeout(createBoba, 1100);

}



createBoba();

}