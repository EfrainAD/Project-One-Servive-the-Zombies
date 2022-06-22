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
        this.shiftyness = 10
        this.shiftynessTimer = 0
        
        //methods
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
        
        this.changeDirection = function(direction) {
            this.direction = direction
        }
        
        this.move = function() {
            //if change direction
            this.shiftynessTimer++
            if (this.shiftynessTimer === this.shiftyness) {//////////
                p('changing direction.')
                this.shiftynessTimer = 0
                this.direction = randomDirectionChange(this)}

            p(this.direction)
            //if direction
            switch (this.direction) {
                case ('up'):
                    if (bounderies(this)){
                        this.y -= playerSpeed
                }
                break;
                case ('left'):
                    if (bounderies(this)){
                        this.x -= playerSpeed
                }   
                break;
                case ('down'):
                    if (bounderies(this)){
                        this.y += playerSpeed
                }   
                break;
                case ('right'):
                    if (bounderies(this)){
                        this.x += playerSpeed
                }   
                    break;
            }    
        } 
    }
}

//Make players on the board.
let player = new Sprite(100, game.height/2, 'up', 'lightsteelblue', spriteWidth, spriteHeight)
let zombie = []
for (let i = 0; i < 1; i++){
    // zombie.push(new Sprite(
    //     Math.floor(Math.random() * (game.width - (spriteWidth + (10 * 2)))) + 10, 
    //     Math.floor(Math.random() * (game.height - (spriteHeight + (10 * 2)))) + 10, 
    //     'up', '#bada55', spriteWidth, spriteHeight))
    zombie.push(new Sprite(
        (game.width/2), 
        (game.height/2), 
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
            zombie.move()
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
    let zombieSearch = []
    zombieSearch = zombie.filter(zombie => {
        return zombie.alive === true
    }).filter(zombie => {
        return ((convertDirectionNumber(player) + 2) % 4) !== convertDirectionNumber(zombie)
    })
        p("player.Direction: " + player.direction)
        switch (player.direction) {
            case 'up':
                zombieSearch.forEach(zombie => {
                    if ((((player.x)) < (zombie.x + spriteWidth) )  
                    && ((((player.x) + spriteWidth)) > (zombie.x))
                    && ((player.y + spriteHeight) > zombie.y)
                    && ((player.y - knifeRange) < (zombie.y + spriteHeight)))
                        killZombie(zombie)
                    })
                break;
            case 'right':
                zombieSearch.forEach(zombie => { 
                    if ((((player.x + spriteWidth)) < zombie.x )
                    && ((((player.x + spriteWidth) + knifeRange)) > zombie.x)
                    && ((player.y + spriteHeight) > zombie.y)
                    && (player.y < (zombie.y + spriteHeight)))
                        killZombie(zombie)
                })
                break;
            case 'down':
                zombieSearch.forEach(zombie => {
                    if ((((player.x)) < (zombie.x + spriteWidth) )  
                        && ((((player.x) + spriteWidth)) > (zombie.x))
                        && ((player.y + spriteHeight + knifeRange) > zombie.y)
                        && ((player.y) < (zombie.y)))
                            killZombie(zombie)
                    })
                break;
            default:
                p("left swing!")
                zombieSearch.forEach(zombie => {
                    if ((((player.x)) > (zombie.x + spriteWidth) )
                    && ((((player.x) - knifeRange)) < (zombie.x + spriteHeight))
                    && ((player.y + spriteHeight) > zombie.y)
                    && (player.y < (zombie.y + spriteHeight)))
                        killZombie(zombie)
                })
                break;
        }
}

// this function is going to be how we move our players around
const movementHandler = (e) => {
    //boundery
    // console.log(e.key)
    switch (e.key) {
        case ('w'):
        case ('ArrowUp'):
            if (bounderies(player)){
                player.changeDirection('up')
                player.y -= playerSpeed
            }    
            break
        case ('a'):
        case ('ArrowLeft'):
        // case (40):
            // this moves the player left
            if (bounderies(player)){
                player.changeDirection('left')
                player.x -= playerSpeed
            }
            break
        case ('s'):
        case ('ArrowDown'):
            if (bounderies(player)){
                player.changeDirection('down')
                player.y += playerSpeed
            }
            break
        case ('d'):
        case ('ArrowRight'):
            // this moves the player to the right
            if (bounderies(player)){
                player.changeDirection('right')
                player.x += playerSpeed
            }
            break
        case (' '): //spacebar
            // console.log("sing!!!!")
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
    p('KILLED!!!!!!') 
} 
// Will think about adding asdw keys.
const bounderies = (sprite) => {
    // console.log(`Player.x: ${player.x} game.width: ${game.width}`)
    if (sprite.direction === 'left' && sprite.x - playerSpeed < 0){
        // console.log(player.x + " game.width"+game.width)
        return false 
    }    
    if (sprite.direction === 'right' && sprite.x + playerSpeed + player.width > game.width)
        return false
    if (sprite.direction === 'up' && sprite.y - playerSpeed < 0)
        return false
    if (sprite.direction === 'down' && sprite.y + playerSpeed + player.height > game.height)
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
const randomDirectionChange = (sprite) => {
    p("Inside function")
    const leftOrRight = Math.round(Math.random())
    p("leftOrRigth: " + leftOrRight)
    let newDirectionInt = null
    if (leftOrRight === 0) {
        newDirectionInt = convertDirectionNumber(sprite) + 3 //no - num
    } else { 
        newDirectionInt = convertDirectionNumber(sprite) + 1}
    p("newDirection in Int: "+newDirectionInt)
    newDirectionInt %= 4
    p("NDirection %4: "+newDirectionInt)

    if (newDirectionInt === 0)
        return 'up'
    if (newDirectionInt === 1)
        return 'right'
    if (newDirectionInt === 2)
        return 'down'
    if (newDirectionInt === 3)
        return 'left'
}