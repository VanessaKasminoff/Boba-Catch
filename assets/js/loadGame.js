import settings from '../data/settings.json' assert { type: 'json' };
let cupWidth = settings.game.cupSizePercentOfWidth
let dynamicGameArea // if this value was returned in resizeGameArea, then it would only be returned for the instance it was invoked. This is problematic because we need this value to be changed on each resize.
let game = {score:0, time:0, bobaCaught:0, consecutive:0, liquidMultiplier:1, streakMultiplier:1, maxMultiplier:2, totalMultiplier:1}

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
    dynamicGameArea =  {
        width: solutionWidth,
        height: solutionWidth*2
        }
     
}

function createTable() {
    let table = document.createElement('div')
    table.id = "table"
    table.style = `
    background-image: url("./assets/img/table.png");
    background-size: ${100}% ${100}%;
    width: 100%;
    height: ${settings.game.tableHeightPercentOfHeight}%;
    position: absolute;
    bottom: ${0}px
    `

    return table
}

function createCup() {
    let cup = document.createElement("div")
    cup.id = "cup"
    cup.style = `
    background-image: url("./assets/img/cup.png");
    background-size: ${100}%;
    width: ${cupWidth}%;
    height: ${settings.game.cupHeightPercentOfHeight}%;
    position: absolute;
    bottom: ${settings.game.cupHeightByPercentOfHeight}%
    `
    //testing below
    cup.liquid = "black"
    game.liquidMultiplier = 1.2

    return cup
}

function createTracker(tracker, data) {
    let trackerElement = document.createElement("div")
    trackerElement.id = `${tracker}Div`
    trackerElement.style = `
    text-align:center;
    `
    trackerElement.classList.add("comicSans30bold")
    trackerElement.innerHTML = `${tracker}<br>${data}`
    return trackerElement
}



function createGameHeader() {
    let gameHeader = document.createElement("div")
    gameHeader.id ="gameHeaderDiv"
    gameHeader.style = `
    top: 0;
    left: 0;
    width: 100%;
    height: ${settings.game.gameHeaderHeightPercent}%;
    display: flex;
    justify-content: space-between;
    `
    return gameHeader
}


//CUP MOVEMENT
function attachCupMouseMovement(cup, gameContainer) {
    gameContainer.addEventListener('mousemove', function(e) {
        //gets the position of the container relative to the viewport.
        const gameContainerPos = gameContainer.getBoundingClientRect();
        //mouse coords relative to the container = mouse absolute coordinates - containers relative position.
        const mouseX = e.clientX - gameContainerPos.left;
        //updates the cup's position.
        let halfCupWidth = (cupWidth * 0.01 * dynamicGameArea.width)/2
        let halfBobaWidth = dynamicGameArea.width * settings.game.bobaSizePercentOfWidth * .01  / 2
        //console.log(halfBobaWidth)
        //console.log(halfCupWidth)

        cup.style.left = (mouseX - halfCupWidth)+ 'px';
        cup.leftBound = (mouseX - halfCupWidth - halfBobaWidth)/dynamicGameArea.width *100
        cup.rightBound = (mouseX + halfCupWidth - halfBobaWidth)/dynamicGameArea.width *100

        //sets static position of cup to stop it from moving past the right side of the container.
        if (mouseX >= dynamicGameArea.width * 0.9 + halfCupWidth) {
            cup.style.left = (dynamicGameArea.width * 0.9)+ 'px'
        }
        if (mouseX <= halfCupWidth){
            cup.style.left = 0 + "px"
        }
    });
}


export function loadGame(gameContainer) {
    resizeGameArea(gameContainer)
    gameContainer.append(createTable())
    let gameHeader = createGameHeader()
    gameContainer.append(gameHeader)
    gameHeader.append(createTracker("score", game.score), createTracker("time", game.time), createTracker("streak", game.consecutive),  createTracker("boba", game.bobaCaught), createTracker("joy", game.totalMultiplier))


    /* you COUUULD do 
    gameContainer.append(attachCupMouseMovement(createCup(), gameContainer))
    and return cup from attachCupMouseMovement... But that's unreadable to the human eye.*/
    let cup = createCup()
    gameContainer.append(cup)
    attachCupMouseMovement(cup, gameContainer)

// GENERATE FALLING BOBA
    function createBoba() {
        let bobaBaseScore = 100
        let bobaSizePercent = settings.game.bobaSizePercentOfWidth 
        let bobaSize = (bobaSizePercent * .01 * dynamicGameArea.width) // for readability
        let bobaHeight = 100 - settings.game.bobaSizePercentOfWidth/2//dynamicGameArea.height - bobaSize;
        let bobaX = Math.random() * (100- bobaSizePercent)
        const boba = document.createElement('div');
        boba.style = `
        width: ${bobaSizePercent}%;
        height: ${bobaSizePercent / 2}%;
        left: ${bobaX}%;
        bottom: ${bobaHeight}%; 
        border-radius: 50%;
        background: black;
        position: absolute;
        `
        gameContainer.append(boba)

        let uncaught = true
        function fallingBoba() {
            bobaHeight -= .1;
            boba.style.bottom = bobaHeight + '%';
            
            //catching

            let cupRimHeight = settings.game.cupHeightByPercentOfHeight + settings.game.cupHeightPercentOfHeight -settings.game.bobaSizePercentOfWidth/4 //((settings.game.cupHeightByPercentOfHeight + settings.game.cupHeightPercentOfHeight -settings.game.bobaSizePercentOfWidth/4) * .01 * dynamicGameArea.height)
            let halfCupHeight = cupRimHeight - (settings.game.cupHeightPercentOfHeight * dynamicGameArea.width  *.01 )
            let tableHeight = settings.game.tableHeightPercentOfHeight - settings.game.bobaSizePercentOfWidth//((settings.game.tableHeightPercentOfHeight - settings.game.bobaSizePercentOfWidth) * dynamicGameArea.height * .01)
            //console.log(cupRimHeight)
            //console.log(halfCupHeight)
            if(uncaught && bobaHeight > halfCupHeight && bobaHeight < cupRimHeight) {
                if((bobaX > cup.leftBound) && (bobaX < cup.rightBound)){
                    uncaught = false
                    console.log("caught")
                    boba.remove()

                    if (cup.liquid == "black"){
                        let splash =document.createElement('div')
                        splash.style = `
                        background-image: url("./assets/img/multisplashblack.png");
                        background-size: ${100}% ${100}%;
                        width: ${settings.game.splashSizeWidthByPercentOfWidth}%;
                        height: ${settings.game.splashSizeHeightByPercentOfHeight}%;
                        position: absolute;
                        bottom: ${cupRimHeight}%;
                        left: ${bobaX - settings.game.splashSizeWidthByPercentOfWidth/4}%
                        `
                        gameContainer.append(splash)
                        setTimeout(() => {
                            splash.remove()
                        }, 300);
                    } else if (cup.liquid == false) {
                        // no splash
                    }

                    //recording consecutive catches
                    game.consecutive += 1
                    //streak multiplier
                    if (game.streakMultiplier < 2) {
                        ((
                            game.streakMultiplier = 1 + 
                                (0.1 * (Math.round((0.1 * game.consecutive).toFixed(0))))
                        ) * 10).toFixed(0) /10
                    }
                    else if (game.streakMultiplier >= 2) {game.streakMultiplier = 2}
                    //adding to score
                    game.score += bobaBaseScore * game.liquidMultiplier * game.streakMultiplier
                    game.bobaCaught += 1

                }
            }
            //removal
            if(uncaught && bobaHeight < tableHeight) {
                boba.remove()
                
                uncaught = false
                console.log("YOU SUCCCCK")

                game.consecutive = 0
                game.streakMultiplier = 1
                game.score -= bobaBaseScore
                
            }
            
            game.totalMultiplier = (game.liquidMultiplier * game.streakMultiplier).toFixed(2)

            document.getElementById("scoreDiv").innerHTML = `score<br>${game.score}`
            document.getElementById("bobaDiv").innerHTML = `boba<br>${game.bobaCaught}`
            document.getElementById("streakDiv").innerHTML = `streak<br>${game.consecutive}`
            document.getElementById("joyDiv").innerHTML = `
            joy: x${game.totalMultiplier}
            <br><span class="gameHeaderSubHeader">drink: x${game.liquidMultiplier}</span>
            <br><span class="gameHeaderSubHeader">bonus: x${game.streakMultiplier}</span>
            `
        //console.log("this is the falling boba function")
        }

    setInterval(fallingBoba, 1);
    setTimeout(createBoba, 1200);

    }


createBoba();

}