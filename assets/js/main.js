// 0 - 900 px side to side

const gameContainer = document.getElementById('game-container');
const cup = document.getElementById('cup');

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
    if (mouseX >= 900) {
        cup.style.left = 900 + 'px'
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
            boba.style.display = 'none';
        }
    }
    setInterval(fallingBoba, 30);
    setTimeout(createBoba, 1100);

}

createBoba();