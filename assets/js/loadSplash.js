import { loadGame } from "./loadGame.js";

export function loadSplash(gameContainer) {
    gameContainer.style.background = "pink"
    
    let splash = document.createElement("div")
    splash.id = 'splash'
    splash.innerHTML = `
            <h1 id="game-title" class="comicSans30bold">Boba Falls</h1>
        `

    let playButton = document.createElement("div")
    playButton.id = "play-game-button"
    playButton.classList.add("comicSans30bold")
    playButton.textContent = "play"

    splash.append(playButton)
    gameContainer.append(splash)


    document.getElementById("play-game-button").addEventListener("click", () => {
        gameContainer.innerHTML = ""
        loadGame(gameContainer)
    } , false)     
}