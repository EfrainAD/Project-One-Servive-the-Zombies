const p = (str) => {console.log(str)}
const game = document.getElementById('canvas')
const messageBoard = document.getElementById('movement')
let killCount = 0
const spriteHeight = 25
const spriteWidth = 20
const playerSpeed = 8
const zombieSpeed = 3
// const swingRange = spriteHeight + 10 //That is a huge sword.
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
    constructor(x, y, direction, speed, color, width, height) {
        this.x = x,
        this.y = y,
        this.direction = direction
        this.speed = speed
        this.color = color,
        this.width = width,
        this.height = height
        
        this.alive = true,
        this.shiftyness = 10
        this.shiftynessTimer = 0
        
        //methods
        this.changeDirection = function(direction) {
            this.direction = direction
        }
        
        this.move = function() {
            //if change direction
            this.shiftynessTimer++
            // p(`shiftynessTimer: ${this.shiftynessTimer}`)
            if (this.shiftynessTimer === this.shiftyness) {
                p('changing direction.')
                this.shiftynessTimer = 0
                randomDirectionChange(this)}
                
            // p(this.direction)
            //if direction
            switch (this.direction) {
                case ('up'):
                    this.y -= this.speed
                    if (this.y <= 0) { //Need ask about = in <=
                        this.y = 0
                        this.direction = 'down'}
                break;
                case ('left'):
                    this.x -= this.speed
                    if (this.x <= 0 ){
                        this.x = 0
                        this.direction = 'right'}
                break;
                case ('down'):
                    this.y += this.speed
                    if (this.y >= game.height){
                        this.y = game.height
                        this.direction = 'up'}
                break;
                case ('right'):
                    this.x += this.speed
                    if (this.x >= game.width){
                        this.x = game.width
                        this.direction = 'left'}   
                break;
            }    
        } 
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

//Make players on the board.
let player = new Sprite(100, game.height/4, 'up', playerSpeed, 'lightsteelblue', spriteWidth, spriteHeight)
let zombie = []
for (let i = 0; i < 1; i++){
    // zombie.push(new Sprite(
    //     Math.floor(Math.random() * (game.width - (spriteWidth + (10 * 2)))) + 10, 
    //     Math.floor(Math.random() * (game.height - (spriteHeight + (10 * 2)))) + 10, 
    //     'up', '#bada55', spriteWidth, spriteHeight))
    zombie.push(new Sprite(
        (game.width/2), 
        (game.height/2), 
        'right', zombieSpeed, '#bada55', spriteWidth, spriteHeight))
} 

// MAIN FUNCTION \\
const gameLoop = () => {
    
    ctx.clearRect(0, 0, game.width, game.height)
    
    messageBoard.textContent = player.x + ', ' + player.y + '\nKills: ' + killCount 
    
    // const str = "Zombie X: "+zombie[0].x+"\nZombe Y: "+zombie[0].y
    // p(str)
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
            player.changeDirection('up')
            player.y -= player.speed
            if (player.y <= 0){
                player.y = 0}    
            break
        case ('a'):
        case ('ArrowLeft'):
        // case (40):
            // this moves the player left
            player.changeDirection('left')
                player.x -= player.speed
            if (player.x < 0){
                player.x = 0}
        break
        case ('s'):
        case ('ArrowDown'):
            player.changeDirection('down')
            player.y += player.speed
            if (player.y > game.height)
                player.y = game.height
        break
        case ('d'):
        case ('ArrowRight'):
            // this moves the player to the right
            player.changeDirection('right')
            player.x += player.speed
            if (player.x > game.width){
                player.x = game.width                
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
    // p("Inside function")
    const leftOrRight = Math.round(Math.random())
    // p("leftOrRigth: " + leftOrRight)
    let newDirectionInt = null
    if (leftOrRight === 0) {
        newDirectionInt = convertDirectionNumber(sprite) + 3 //no - num
    } else { 
        newDirectionInt = convertDirectionNumber(sprite) + 1}
    // p("newDirection in Int: "+newDirectionInt)
    newDirectionInt %= 4
    // p("NDirection %4: "+newDirectionInt)

    if (newDirectionInt === 0){
        sprite.direction = 'up'}
    if (newDirectionInt === 1){
        sprite.direction = 'right'}
    if (newDirectionInt === 2){
        sprite.direction = 'down'}
    if (newDirectionInt === 3){
        sprite.direction = 'left'}
}