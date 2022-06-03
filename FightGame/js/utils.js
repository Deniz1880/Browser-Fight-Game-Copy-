function rectangularCollision({ renctangle1, rectangle2 }) {
    return (
        renctangle1.attackBox.position.x + renctangle1.attackBox.width >= rectangle2.position.x &&
        renctangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width / 2 &&
        renctangle1.attackBox.position.y - renctangle1.attackBox.height >= rectangle2.height &&
        renctangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height / 1.1
    )
}

function determineWinner({player, enemy, timerId}) {
    clearTimeout(timerId)
    const text = document.querySelector('#displayText')
    text.style.display = 'flex'
    if (player.health === enemy.health) { 
        text.innerHTML = 'Tie'
    }else if(player.health >enemy.health){
        text.innerHTML = 'Player 1 Wins'
    }else {text.innerHTML = 'Player 2 Wins'}
    
}

let timer = 60
let timerId
function decreaseTimer() {
    if (timer >= 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        document.querySelector('#timer').innerHTML = timer
        timer--
    }
    if (timer === 0) {
        determineWinner({player, enemy, timerId})
    }
    
}