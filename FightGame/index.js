const canvas = document.querySelector('#mainCanvas')
const canvasContext = canvas.getContext('2d')

canvas.height = 576
canvas.width = 1024
canvasContext.fillRect(0, 0, canvas.width, canvas.height)
const gravity = 0.7

const background = new Sprite({
    position: { x: 0, y: 0 },
    imageSrc: './img/background.png'
}
)
const shop = new Sprite({
    position: { x: 700, y: 198 },
    imageSrc: './img/shop.png',
    scale: 2.2,
    frames: 6,
}
)
const player = new Fighter({
    position: { x: 100, y: 100 },
    velocity: { x: 0, y: 0 },
    imageSrc: './img/samuraiMack/Idle.png',
    frames: 8,
    scale: 2.5,
    offset: { x: 230, y: 155 },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            frames: 8
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            frames: 8
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            frames: 2
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            frames: 2
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            frames:6
        },
        takeHit: {
            imageSrc: './img/samuraiMack/Take Hit.png',
            frames:4
        },
        death: {
            imageSrc: './img/samuraiMack/Death.png',
            frames:6
        },
    },
    attackBox: {
        offset: {
            x: 110,
            y: 20
        },
        width: 190,
        height: 100
    },
}
)


const enemy = new Fighter({
    position: { x: 400, y: 200 },
    velocity: { x: 0, y: 0 },
    imageSrc: './img/kenji/Idle.png',
    frames: 4,
    scale: 2.5,
    offset: { x: 220, y: 167 },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            frames: 4
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            frames: 8
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            frames: 2
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            frames: 2
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            frames:4
        },
        takeHit: {
            imageSrc: './img/kenji/Take Hit.png',
            frames:3
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            frames:7
        },
    },
    attackBox: {
        offset: {
            x: -90,
            y: 20,
        },
        width: 180,
        height: 100
    },
})


console.log(player)

const keys = {
    a: { pressed: false },
    d: { pressed: false },
    ArrowLeft: { pressed: false },
    ArrowRight: { pressed: false }
}



decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    canvasContext.fillStyle = 'black'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    canvasContext.fillStyle = 'rgba(255, 255, 255, 0.2)'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    //Player Movement
    player.velocity.x = 0
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprites('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprites('run')
    } else {
        player.switchSprites('idle')
    }

    //Jump Sprite
    if (player.velocity.y < 0) {
        player.switchSprites('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprites('fall')
    }
    //Enemy Movement
    enemy.velocity.x = 0
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprites('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprites('run')
    }else {
        enemy.switchSprites('idle')
    }
    //Jump Sprite
    if (enemy.velocity.y < 0) {
        enemy.switchSprites('jump')
    } else if (player.velocity.y > 0) {
        enemy.switchSprites('fall')
    }

    //Collusion
    if (rectangularCollision({
        renctangle1: player,
        rectangle2: enemy,
    }) &&
        player.isAttacking && player.currentFrames === 4
    ) {
        enemy.takeHit()
        player.isAttacking = false
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }
    if (player.isAttacking && player.currentFrames === 4) {
        player.isAttacking = false
    }
    if (rectangularCollision({
        renctangle1: enemy,
        rectangle2: player,
    }) &&
        enemy.isAttacking && enemy.currentFrames === 2
    ) {
        player.takeHit()
        enemy.isAttacking = false
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }
    if (enemy.isAttacking && enemy.currentFrames === 2) {
        enemy.isAttacking = false
    }

    //Ending game by health
    if (player.health === 0 || enemy.health === 0) {
        determineWinner({ player, enemy, timerId })
    }
}
animate()

window.addEventListener('keydown', moving)
window.addEventListener('keyup', stoping)

function moving(e) {
    if (!player.isDeath) {
        switch (e.key) {
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break;
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break;
            case 'w':
                player.velocity.y = -20
                break;
            case ' ':
                player.attack()
                break;
            
            default:
                break;
        }
    }
    
    if (!enemy.isDeath) {
        switch(e.key){
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break;
            case 'ArrowUp':
                enemy.velocity.y = -20
                break;
            case 'l':
                enemy.attack()
                break;
        }
    } 
}
function stoping(e) {
    switch (e.key) {
        case 'd':
            keys.d.pressed = false
            break;
        case 'a':
            keys.a.pressed = false
            break;

        default:
            break;
    }
    //For Enemy Movement
    switch (e.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break;

        default:
            break;
    }
}