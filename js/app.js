const game = document.getElementById('canvas')
const messageBoard = document.getElementById('movement')
let killCount = 0
const playerSpeed = 8
const spriteHeight = 25
const spriteWidth = 20

// we also need to define our game context
const ctx = game.getContext('2d')

// so, we have a variable height and width on our canvas, so we need to get that height and width as a reference point so we can do stuff with it later.
game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height'])

console.log('this is the canvas width', game.width)
console.log('this is the canvas height', game.height)

// Objects are made of properties(K:v pairs) and methods(functions)
class Sprite {
    constructor(x, y, direction, color, width, height) {
        this.x = x,
        this.y = y,
        this.color = color,
        this.width = width,
        this.height = height,
        //Later add if direction 0 randomize it.
        this.direction = 'up' //'up' 'donw' 'right' 'left'
        
        this.alive = true,
        //methods
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}
//Make players on the board.
let player = new Sprite(30, 30, 'up', 'lightsteelblue', spriteWidth, spriteHeight)
let zombie = []
for (let i = 0; i < 5; i++){
    zombie.push(new Sprite(
        Math.floor(Math.random() * (game.width - (spriteWidth + (10 * 2)))) + 10, 
        Math.floor(Math.random() * (game.height - (spriteHeight + (10 * 2)))) + 10, 
        'right', '#bada55', spriteWidth, spriteHeight))
}

// MAIN FUNCTION \\
const gameLoop = () => {
    
    ctx.clearRect(0, 0, game.width, game.height)
    
    messageBoard.textContent = player.x + ', ' + player.y + "\nKills: " + killCount
    
    detectHit()

    if (player.alive === true) {
        player.render()
    }

    zombie.forEach(zombie => {
        if (zombie.alive === true) {
            zombie.render()
        }
    })
}


// we're going to do this, when the content loads
document.addEventListener('DOMContentLoaded', function () {
    // in here, we need to have our movement handler
document.addEventListener('keydown', movementHandler)
    // we also need our game loop running at an interval
setInterval(gameLoop, 60)
})

// this function is going to be how we move our players around
const movementHandler = (e) => {
    //boundery
    // console.log(e.key)
    switch (e.key) {
        case ('w'):
        case ('ArrowUp'):
            if (bounderies(e.key)){player.y -= playerSpeed}
                
            break
        case ('a'):
        case ('ArrowLeft'):
        // case (40):
            // this moves the player left
            if (bounderies(e.key))
                player.x -= playerSpeed
            break
        case ('s'):
        case ('ArrowDown'):
            // this will move the player down
            if (bounderies(e.key))
                player.y += playerSpeed
            break
        case ('d'):
        case ('ArrowRight'):
            // this moves the player to the right
            if (bounderies(e.key))
                player.x += playerSpeed
            break
    }
}
const detectHit = () => {
    zombie.forEach(zombie => {
        if (player.x < zombie.x + zombie.width
            && player.x + player.width > zombie.x
            && player.y < zombie.y + zombie.height
            && player.y + player.height > zombie.y) {
            if (zombie.alive === true) {
                zombie.alive = false
                killCount++ 
            }
        }
    })
}
// Will think about adding asdw keys.
const bounderies = (key) => {
    console.log(`Player.x: ${player.x} game.width: ${game.width}`)
    if (key === 'ArrowLeft' && player.x - playerSpeed < 0){
        console.log(player.x + " game.width"+game.width)
        return false 
    }    
    if (key === 'ArrowRight' && player.x + playerSpeed + player.width > game.width)
        return false
    if (key === 'ArrowUp' && player.y - playerSpeed < 0)
        return false
    if (key === 'ArrowDown' && player.y + playerSpeed + player.height > game.height)
        return false
    return true
}