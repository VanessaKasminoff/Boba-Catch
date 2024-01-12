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

export function loadGame(gameContainer) {
    resizeGameArea(gameContainer)
    let cup = createCup()
    gameContainer.append(cup)

//loadLevel(levels.level1)
// 0 - 900 px side to side

//CUP MOVEMENT

// returns object with css properties of cup and then specifcally the value of the 'left' property.
const cupLeft = window.getComputedStyle(cup).getPropertyValue('left');

gameContainer.addEventListener('mousemove', function(e) {
    //gets the position of the container relative to the viewport.
    const gameContainerPos = gameContainer.getBoundingClientRect();
    
    //mouse coords relative to the container = mouse absolute coordinates - containers relative position.
    const mouseX = e.clientX - gameContainerPos.left;
    //updates the cup's position.
    cup.style.left = mouseX + 'px';
    //sets static position of cup to stop it from moving past the right side of the container.
    if (mouseX >= gameArea.width * 0.9) {
        cup.style.left = (gameArea.width * 0.9)+ 'px'
    }
});
// GENERATE FALLING BOBA

function createBoba() {
    let bobaStart = 950;
    let bobaX = Math.floor(Math.random() * 850);
    const boba = document.createElement('div');
    boba.setAttribute("class", 'boba');
    gameContainer.append(boba)

    function fallingBoba() {
        bobaStart -= 8;
        boba.style.bottom = bobaStart + 'px';
        boba.style.left = bobaX + 'px';
        if(bobaStart < 157) {
            boba.remove();
        }
    }
    setInterval(fallingBoba, 30);
    setTimeout(createBoba, 1100);

}



createBoba();

}