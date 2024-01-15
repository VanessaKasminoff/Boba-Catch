export function loadGameOver(gameContainer) {
    let gameOver = document.createElement("div");
    gameOver.id = "game-over-container"
    gameOver.innerHTML = `
        <h1 id="game-over-title" class="comicSans30bold">Game Over!</h1>
        <h2>Your Score: 0</h2>
    `
    let playAgainButton = document.createElement('div')
    playAgainButton.id = "play-again-button"
    playAgainButton.classList.add('comicSans30bold')
    playAgainButton.textContent = 'play again'

    gameOver.append(playAgainButton)
    gameContainer.append(gameOver)
}
