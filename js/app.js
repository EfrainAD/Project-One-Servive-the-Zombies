const game = document.getElementById('canvas')
const messageBoard = document.getElementById('movement')
let killCount = 0
const playerSpeed = 8

// we also need to define our game context
const ctx = game.getContext('2d')

// so, we have a variable height and width on our canvas, so we need to get that height and width as a reference point so we can do stuff with it later.
game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height'])

console.log('this is the canvas width', game.width)
console.log('this is the canvas height', game.height)

// Objects are made of properties(K:v pairs) and methods(functions)
class Crawler {
    constructor(x, y, color, width, height) {
        this.x = x,
        this.y = y,
        this.color = color,
        this.width = width,
        this.height = height,
        
        this.alive = true,
        //methods
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}
//Make players on the board.
let player = new Crawler(10, 10, 'lightsteelblue', 16, 16)
let ogre = []
for (let i = 0; i < 5; i++){
    ogre.push(new Crawler(Math.floor(Math.random()*game.width), Math.floor(Math.random()*game.height), '#bada55', 32, 48))
}

// MAIN FUNCTION \\
const gameLoop = () => {
    
    ctx.clearRect(0, 0, game.width, game.height)
    
    messageBoard.textContent = player.x + ', ' + player.y + "\nKills: " + killCount
    
    detectHit()

    if (player.alive === true) {
        player.render()
    }

    ogre.forEach(ogre => {
        if (ogre.alive === true) {
            ogre.render()
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
    console.log(e.key)
    switch (e.key) {
        case ('w'):
        case ('ArrowUp'):
            // this moves player up
            player.y -= playerSpeed
            // we also need to break the case
            break
        case ('a'):
        case ('ArrowLeft'):
        // case (40):
            // this moves the player left
            player.x -= playerSpeed
            break
        case ('s'):
        case ('ArrowDown'):
            // this will move the player down
            player.y += playerSpeed
            break
        case ('d'):
        case ('ArrowRight'):
            // this moves the player to the right
            player.x += playerSpeed
            break
    }

}
const detectHit = () => {
    ogre.forEach(ogre => {
        if (player.x < ogre.x + ogre.width
            && player.x + player.width > ogre.x
            && player.y < ogre.y + ogre.height
            && player.y + player.height > ogre.y) {
                if (ogre.alive === true) {
                    ogre.alive = false
                    killCount++
                }
               
                //killCount++
                // document.getElementById('status').textContent = 'You Win!'
            }
    })
}
const bounderies = () => {
    if (player.x < ogre.x + ogre.width
        && player.x + player.width > ogre.x
        && player.y < ogre.y + ogre.height
        && player.y + player.height > ogre.y) {
            ogre.alive = false
            //killCount++
            // document.getElementById('status').textContent = 'You Win!'
        }
}