import settings from '../data/settings.json' assert { type: 'json' };
import { loadGameOver } from './loadGameOver.js';
let cupWidth = settings.game.cupWidth
let dynamicGameArea // if this value was returned in resizeGameArea, then it would only be returned for the instance it was invoked. This is problematic because we need this value to be changed on each resize.
let game = {
    score: 0,
    time: 0,
    bobaCaught: 0,
    crawlersCaught: 0,
    consecutive: 0, 
    liquidMultiplier: 1, 
    streakMultiplier: 1, 
    maxMultiplier: 2, 
    totalMultiplier: 1,
    fallingBobaInterval: undefined,
    bobaTimeout: undefined,
    fallingCrawlersInterval: undefined,
    crawlerTimeout: undefined,
    checkGameOverInterval: undefined,
    highScoreArray: []
}

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
        height: solutionWidth * 2
        }
     
}

function createTable() {
    let table = document.createElement('div')
    table.id = "table"
    table.style = `
    background-image: url("./assets/img/table.png");
    background-size: ${100}% ${100}%;
    width: 100%;
    height: ${settings.game.tableY}%;
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
    height: ${settings.game.cupHeight}%;
    position: absolute;
    bottom: ${settings.game.cupY}%
    `
    //TESTING LIQUID FEATURES
    cup.liquid = "black" // ESSENTIAL FOR SPLASHING
    //game.liquidMultiplier = 1.2

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
    height: ${settings.game.gameHeaderHeight}%;
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
        let halfCupWidth = (cupWidth * 0.01 * dynamicGameArea.width) / 2
        let halfBobaWidth = dynamicGameArea.width * settings.game.bobaWidth * .01  / 2
        //console.log(halfBobaWidth)
        //console.log(halfCupWidth)

        cup.style.left = (mouseX - halfCupWidth)+ 'px';
        cup.leftBound = (mouseX - halfCupWidth - halfBobaWidth)/dynamicGameArea.width * 100
        cup.rightBound = (mouseX + halfCupWidth - halfBobaWidth)/dynamicGameArea.width * 100

        //sets static position of cup to stop it from moving past the right side of the container.
        if (mouseX >= dynamicGameArea.width * 0.9 + halfCupWidth) {
            cup.style.left = (dynamicGameArea.width * 0.9)+ 'px'
        }
        if (mouseX <= halfCupWidth){
            cup.style.left = 0 + "px"
        }
    });
}

// function m


export function loadGame(gameContainer) {
    resizeGameArea(gameContainer)
    gameContainer.append(createTable())
    let gameHeader = createGameHeader()
    gameContainer.append(gameHeader)

    gameContainer.style.backgroundImage = "url('./assets/img/game-background-blurred.jpg')"
    gameContainer.style.backgroundSize = "100% 100%"

    game.time = 60;
    game.score = 0
    game.consecutive = 0
    game.bobaCaught = 0
    game.crawlersCaught = 3
    game.totalMultiplier = 1
    game.streakMultiplier = 1

    gameHeader.append(
        createTracker("time", game.time), 
        createTracker("score", game.score), 
        createTracker("streak", game.consecutive),  
        createTracker("boba", game.bobaCaught), 
        createTracker("crawlers", game.crawlersCaught),
        createTracker("joy", game.totalMultiplier)
        )


    /* you COUUULD do 
    gameContainer.append(attachCupMouseMovement(createCup(), gameContainer))
    and return cup from attachCupMouseMovement... But that's unreadable to the human eye.*/
    let cup = createCup()
    gameContainer.append(cup)
    attachCupMouseMovement(cup, gameContainer)

    // TIMER
    document.getElementById("timeDiv").innerHTML = `time<br>${game.time}`
    let timer = setInterval(() => {
        game.time--
        document.getElementById("timeDiv").innerHTML = `time<br>${game.time}`
        if (game.time <= 0) {
            clearInterval(timer)
        }
    }, 1000)

// GENERATE FALLING BOBA
    function createBoba() { // start createBoba function
        let bobaBaseScore = 100
        let bobaSizePercent = settings.game.bobaWidth 
        let bobaSize = (bobaSizePercent * .01 * dynamicGameArea.width) //for readability
        let bobaHeight = 100 - settings.game.bobaWidth / 2 //dynamicGameArea.height - bobaSize;
        let bobaX = Math.random() * (100 - bobaSizePercent)
        const boba = document.createElement('div');
        boba.classList.add('boba')
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
            if (game.time > 0){
            bobaHeight -= .1;
            boba.style.bottom = bobaHeight + '%';
            
            //catching

            let cupRimHeight = settings.game.cupY + settings.game.cupHeight - settings.game.bobaWidth / 4 //((settings.game.cupY + settings.game.cupHeight -settings.game.bobaWidth/4) * .01 * dynamicGameArea.height)
            let halfCupHeight = settings.game.cupY + settings.game.cupHeight * .9
            let tableHeight = settings.game.tableY - settings.game.bobaWidth //((settings.game.tableY - settings.game.bobaWidth) * dynamicGameArea.height * .01)
            //console.log(cupRimHeight)
            //console.log(halfCupHeight)

            // valid catch below
            if(uncaught && bobaHeight > halfCupHeight && bobaHeight < cupRimHeight) {
                if((bobaX > cup.leftBound) && (bobaX < cup.rightBound)){
                    uncaught = false
                    console.log("caught")
                    boba.remove()

                    if (cup.liquid == "black"){
                        let splash = document.createElement('div')
                        splash.style = `
                        background-image: url("./assets/img/multisplashblack.png");
                        background-size: ${100}% ${100}%;
                        width: ${settings.game.splashWidth}%;
                        height: ${settings.game.splashHeight}%;
                        position: absolute;
                        bottom: ${cupRimHeight}%;
                        left: ${bobaX - settings.game.splashWidth / 4}%
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
                            game.streakMultiplier = (Math.floor(10 + game.consecutive / 10)) / 10
                    }
                    else if (game.streakMultiplier >= 2) {game.streakMultiplier = 2}
                    //adding to score
                    game.score += Math.floor(bobaBaseScore * game.liquidMultiplier * game.streakMultiplier)
                    game.bobaCaught += 1

                }
            }
            //did not catch booo splat. hehe
            if(uncaught && bobaHeight < tableHeight) {
                boba.remove()
                
                uncaught = false
                console.log("YOU SUCCCCK")

                game.consecutive = 0
                game.streakMultiplier = 1
                game.score -= Math.floor(bobaBaseScore)
                
            }
            
            game.totalMultiplier = (game.liquidMultiplier * game.streakMultiplier).toFixed(2)
            
            document.getElementById("scoreDiv").innerHTML = `score<br>${Math.floor(game.score)}`
            document.getElementById("bobaDiv").innerHTML = `boba<br>${game.bobaCaught}`
            document.getElementById("streakDiv").innerHTML = `streak<br>${game.consecutive}`
            document.getElementById("joyDiv").innerHTML = `
            joy: x${game.totalMultiplier}
            <br><span class="gameHeaderSubHeader">drink: x${game.liquidMultiplier}</span>
            <br><span class="gameHeaderSubHeader">bonus: x${game.streakMultiplier}</span>
            `
        } else if (game.time <= 0) {uncaught = false}
        
        }//console.log("this is the end of the falling boba function")

        game.fallingBobaInterval = setInterval(fallingBoba, 1);
        game.bobaTimeout = setTimeout(createBoba, 550);

    } //end create boba function

    function createCrawlers() { //start create crawler function
        let crawlerBaseScore = -100
        let crawlerSizePercent = settings.game.crawlerWidth
        let crawlerSize = (crawlerSizePercent * .01 * dynamicGameArea.width)
        let crawlerHeight = 100 - settings.game.crawlerWidth / 2
        let crawlerX = Math.random() * (100 - crawlerSizePercent)
        const crawler = document.createElement('div');
        crawler.classList.add('crawler')
        crawler.style = `
        width: ${crawlerSizePercent}%;
        height: ${crawlerSizePercent / 2}%;
        left: ${crawlerX}%;
        bottom: ${crawlerHeight}%; 
        border-radius: 50% 0 0 50%;
        background: maroon;
        position: absolute;
        `
        gameContainer.append(crawler)

        let uncaughtCrawler = true

        function fallingCrawlers() {
            if (game.time > 0){
                crawlerHeight -= .1;
                crawler.style.bottom = crawlerHeight + '%';
                
                //catching
    
                let cupRimHeight = settings.game.cupY + settings.game.cupHeight - settings.game.crawlerWidth / 4 
                let halfCupHeight = settings.game.cupY + settings.game.cupHeight * .9
                let tableHeight = settings.game.tableY - settings.game.crawlerWidth 

                if(uncaughtCrawler && crawlerHeight > halfCupHeight && crawlerHeight < cupRimHeight) {
                    if((crawlerX > cup.leftBound) && (crawlerX < cup.rightBound)){
                        uncaughtCrawler = false
                        console.log("caught crawler")
                        crawler.remove()
    
                        if (cup.liquid == "black"){
                            let splash = document.createElement('div')
                            splash.style = `
                            background-image: url("./assets/img/multisplashdarkred.png");
                            background-size: ${100}% ${100}%;
                            width: ${settings.game.splashWidth}%;
                            height: ${settings.game.splashHeight}%;
                            position: absolute;
                            bottom: ${cupRimHeight}%;
                            left: ${crawlerX - settings.game.splashWidth / 4}%
                            `
                            gameContainer.append(splash)
                            setTimeout(() => {
                                splash.remove()
                            }, 300);
                        } else if (cup.liquid == false) {
                            // no splash
                        }

                        game.crawlersCaught -= 1
                        game.score += crawlerBaseScore
                }
            }

            if(uncaughtCrawler && crawlerHeight < tableHeight) {
                crawler.remove()
                
                uncaughtCrawler = false
                console.log("WOOHOOO NO CRAWLER")                
            }

            document.getElementById("crawlersDiv").innerHTML = `crawlers<br>${game.crawlersCaught}`

        } else if (game.time <= 0) {uncaughtCrawler = false}
    }

        game.fallingCrawlersInterval = setInterval(fallingCrawlers, 1);
        game.crawlerTimeout = setTimeout(createCrawlers, 2000);

} //end create crawler function

    function checkGameOver(){
        if (game.time <= 0) {
            // [700, 300, 100, 500, 22000, 700, -800, 1200, 2300, -1400]
            clearInterval(game.fallingBobaInterval)
            clearTimeout(game.bobaTimeout)
            clearInterval(game.fallingCrawlersInterval)
            clearTimeout(game.crawlerTimeout)
            clearInterval(game.checkGameOverInterval)
            loadGameOver(gameContainer, game.score, game.highScoreArray)
        }
    }
createBoba()
createCrawlers()
game.checkGameOverInterval = setInterval(checkGameOver, 10)
}