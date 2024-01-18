import { loadGame } from "./loadGame.js";

export function loadGameOver(gameContainer, score, highScoreArray) {
    highScoreArray.push(score)
    highScoreArray.sort((a,b) => (b - a))
    console.log(highScoreArray)
    let topFiveArray = highScoreArray.slice(0, 5)
    console.log(topFiveArray)
    
    let bobaArray = Array.from(document.querySelectorAll(".boba"));

    for(let bobaIndex = 0; bobaIndex < bobaArray.length; bobaIndex++){
        bobaArray[bobaIndex].remove()
    }

    gameContainer.innerHTML = ""
    gameContainer.style.backgroundImage = "url('./assets/img/splash-background.png')"

    let gameOver = document.createElement("div");
    gameOver.id = "game-over-container"
    gameOver.innerHTML = `
        <h1 id="game-over-title" class="comicSans30bold">Game Over!</h1>
        <h2 class="comicSans30bold">Your Score: ${score}</h2>
        <h3 class="comicSans30bold">HIGH SCORES:</h3>
    `

    gameContainer.append(gameOver)

    let topFiveContainer = document.createElement('ol')
    topFiveContainer.id = "top-five-container"
    gameOver.append(topFiveContainer)

    topFiveArray.forEach((topScore) => {
        let element = document.createElement('li')
        element.textContent = topScore
        element.classList.add('comicSans30bold', 'highScoreStyle')
        topFiveContainer.append(element)
    })
    
    let playAgainButton = document.createElement('div')
    playAgainButton.id = "play-again-button"
    playAgainButton.classList.add('comicSans30bold')
    playAgainButton.textContent = 'play again'
    playAgainButton.addEventListener('click', () => {
        gameContainer.innerHTML = "";
        loadGame(gameContainer)
    }, false)

    gameOver.append(playAgainButton)
}
