import { loadGame } from "./loadGame.js";

export function loadGameOver(gameContainer, score) {

    let bobaArray = Array.from(document.querySelectorAll(".boba"));

    for(let bobaIndex = 0; bobaIndex < bobaArray.length; bobaIndex++){
        bobaArray[bobaIndex].remove()
    }

    gameContainer.innerHTML = ""

    let gameOver = document.createElement("div");
    gameOver.id = "game-over-container"
    gameOver.innerHTML = `
        <h1 id="game-over-title" class="comicSans30bold">Game Over!</h1>
        <h2 class="comicSans30bold">Your Score: ${score}</h2>
    `
    let playAgainButton = document.createElement('div')
    playAgainButton.id = "play-again-button"
    playAgainButton.classList.add('comicSans30bold')
    playAgainButton.textContent = 'play again'
    playAgainButton.addEventListener('click', () => {
        gameContainer.innerHTML = "";
        loadGame(gameContainer)
    }, false)

    
    gameOver.append(playAgainButton)
    gameContainer.append(gameOver)
}
