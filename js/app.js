const p = (str) => {console.log(str)}
const game = document.getElementById('canvas')
const messageBoard = document.getElementById('movement')
let killCount = 0
const playerSpeed = 8
const spriteHeight = 25
const spriteWidth = 20
const swingRange = spriteHeight + 10
const knifeRange = 20

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
        this.direction = direction
        this.color = color,
        this.width = width,
        this.height = height
        
        this.alive = true,
        //methods
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}
//Make players on the board.
let player = new Sprite(30, 30, 'right', 'lightsteelblue', spriteWidth, spriteHeight)
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

const knifeSwing = () => {
    //detect direction
    let zombieSearch = []
    zombieSearch = zombie.filter(zombie => {
        return zombie.alive === true
    }).filter(zombie => {
        return ((convertDirectionNumber(player) + 2) % 4) !== convertDirectionNumber(zombie)
    })
    // zombieSearch.forEach(()=>{console.log("ok")})
    // console.log("Singing in the start of the knifeSwing")
    
        // console.log("Singing after if direction!")
        //player.direction                 2+2 2
        //switch for each                       1/4 
        //hitbar based on hit detection
        p("player.Direction: " + player.direction)
        
        switch (player.direction) {
            
            case 'up':
                
                break;
            case 'right':
                zombieSearch.forEach(zombie => {
                    p("----stats------")
                    p('PlayerX: ' + player.x)
                    p('spriteX: ' + spriteWidth)
                    p('PlayerX plus spriteWidth: ' + (player.x + spriteWidth))
                    p('knifeRange: ' + knifeRange)
                    p('PlayerX plus spriteWidth and knifeRange: ' + ((player.x + spriteWidth) + knifeRange))
                    p('ZombieX: ' + zombie.x)
                    p("is this x numbers < then zombie x?")
                    p(' ')
                    
                    if ((((player.x + spriteWidth)) < zombie.x )
                        && ((((player.x + spriteWidth) + knifeRange)) > zombie.x)
                        && ((player.y + spriteHeight) > zombie.y)
                        && (player.y < (zombie.y + spriteHeight)))
                        {
                            killZombie(zombie)
                        }
                        
                    // && (player.y + (spriteHeight/4)) < (zombie.y + spriteHeight)
                    // && ((player.y + spriteHeight) - spriteHeight/4) > (zombie.y) )
                    // {
                    //     console.log('HITTTTTTTTTTT')
                    //     zombie.alive = false
                    //     counter++ }
                })
                break;
            case 'down':
                
                break;
            default:

                break;
        }
            // (player.x + spriteWidth/4) ((player.x + spriteWidth) - (spriteWidth/4)) 
                //if yes kill.
    
        //dection range
            //is/if swing in range
                //kill

    //Note move kill to it's on function to keep things dry.
}

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
        case (' '): //spacebar
            console.log("sing!!!!")
            knifeSwing()
            break
    }
}
const detectHit = () => {
    zombie.filter(zombie => {
        return zombie.alive === true
    }).forEach(zombie => {
        if (player.x < zombie.x + zombie.width
            && player.x + player.width > zombie.x
            && player.y < zombie.y + zombie.height
            && player.y + player.height > zombie.y) {
            player.alive = false
        }
    })
}
const killZombie = zombie => {
    zombie.alive = false
    killCount++ 
} 
// Will think about adding asdw keys.
const bounderies = (key) => {
    // console.log(`Player.x: ${player.x} game.width: ${game.width}`)
    if (key === 'ArrowLeft' && player.x - playerSpeed < 0){
        // console.log(player.x + " game.width"+game.width)
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
const convertDirectionNumber = (sprite) => {
    if (sprite.direction === 'up')
        return 0
    if (sprite.direction === 'right')
        return 1
    if (sprite.direction === 'down')
        return 2
    if (sprite.direction === 'left')
        return 3
} 