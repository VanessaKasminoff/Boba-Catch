import { loadSplash } from "./loadSplash.js";

export function howToPlay(gameContainer) {
    gameContainer.style.backgroundImage = "url('./assets/img/splash-background.png')"

    let howToContainer = document.createElement('div')
    howToContainer.id = "how-to-container"
    howToContainer.innerHTML = `
        <h1 id="how-to-title" class="comicSans30bold">How to Play</h1>
        <h2 class="how-to-style">Movement</h2>
        <p class="how-to-style">Use your mouse to move the cup side-to-side.</p>
        <h2 class="how-to-style">Goal</h2>
        <p class="how-to-style">Catch as many falling boba as you can in the time limit while avoiding the creepy crawlers! The more boba you catch in a row, the more points you score.</p>
    `

    gameContainer.append(howToContainer)

    let mainMenuButton = document.createElement('div')
    mainMenuButton.id = "main-menu-button"
    mainMenuButton.classList.add("comicSans30bold")
    mainMenuButton.textContent = "main menu"

    howToContainer.append(mainMenuButton)

    document.getElementById('main-menu-button').addEventListener('click', () => {
        gameContainer.innerHTML = ""
        loadSplash(gameContainer)
    }, false)
}