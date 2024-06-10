import { howToPlay } from "./howToPlay.js";
import { loadGame } from "./loadGame.js";

export function loadSplash(gameContainer) {
    gameContainer.style.backgroundImage = "url('./assets/img/splash-background.png')"

    let splash = document.createElement("div")
    splash.id = 'splash'
    splash.innerHTML = `
            <h1 id="game-title" class="comicSans30bold">Boba Falls</h1>
        `

    gameContainer.append(splash)

    let playButton = document.createElement("div")
    playButton.id = "play-game-button"
    playButton.classList.add("comicSans30bold")
    playButton.textContent = "play"

    splash.append(playButton)

    let howToPlayButton = document.createElement('div')
    howToPlayButton.id = "how-to-play-button"
    howToPlayButton.classList.add("comicSans30bold")
    howToPlayButton.textContent = "how to play"

    splash.append(howToPlayButton)

    document.getElementById('how-to-play-button').addEventListener('click', () => {
        gameContainer.innerHTML = ""
        howToPlay(gameContainer)
    }, false)

    document.getElementById("play-game-button").addEventListener("click", () => {
        console.log('Play button clicked!')
        gameContainer.innerHTML = ""
        loadGame(gameContainer)
    } , false)     
}