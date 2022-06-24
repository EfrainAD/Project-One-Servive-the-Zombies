const p = (str) => {console.log(str)}
const game = document.getElementById('canvas')
// const messageBoard = document.getElementById('movement')
let killCount = 0
const spriteHeight = 16
const spriteWidth = 16
const playerSpeed = 8
const zombieSpeed = 3
const shiftynessGlobal = 10
let keyLock = false
let keyLast = null
// const swingRange = spriteHeight + 10 //That is a huge sword.
const knifeRange = 20

// we also need to define our game context
const ctx = game.getContext('2d')

// so, we have a variable height and width on our canvas, so we need to get that height and width as a reference point so we can do stuff with it later.
game.width = 524
game.height = 376
// game.setAttribute('width', getComputedStyle(game)['width'])
// game.setAttribute('height', getComputedStyle(game)['height'])
const image = new Image()
image.src = '../img/Graveyard_Keeper.jpeg'
image.onload = () => {
    ctx.drawImage(image, 0.0)
}





console.log('this is the canvas width', game.width)
console.log('this is the canvas height', game.height)

// Objects are made of properties(K:v pairs) and methods(functions)
class Sprite {
    constructor(x, y, direction, speed, color, width, height) {
        this.x = x,
        this.y = y,
        this.direction = direction, //I think this will work.
        this.speed = speed,
        this.color = color,
        this.width = width,
        this.height = height
        
        this.alive = true,
        this.shiftyness = shiftynessGlobal
        this.shiftynessTimer = 0
        
        p('On creation: '+this.direction)
        //methods`
        this.changeDirection = function(sprite, direction) {
            // p('in the changeDirection \n before the changes')
            // p(sprite.direction)
            // p(sprite.direction.up)
            // p(sprite.direction.down)
            // p(sprite.direction.right)
            // p(sprite.direction.left)
            Object.keys(sprite.direction).forEach(key => {
                sprite.direction[key] = false;
            })
            // p('The changeed string to false')
            // p(sprite.direction)
            // p(sprite.direction.up)
            // p(sprite.direction.down)
            // p(sprite.direction.right)
            // p(sprite.direction.left)

            sprite.direction[direction] = true
            // p('A changeed to true')
            // p(sprite.direction)
            // p(sprite.direction.up)
            // p(sprite.direction.down)
            // p(sprite.direction.right)
            // p(sprite.direction.left)
            // p('made it')
            // eval(`sprite.direction.${direction} = true`)
            //Try this in sprite.direction.[direction] = true
            //this.direction =  direction
        }

        this.moveByAI = function() {
            //if change direction
            this.shiftynessTimer++
            // p(`shiftynessTimer: ${this.shiftynessTimer}`)
            if (this.shiftynessTimer === this.shiftyness) {
                // p('changing direction.')
                this.shiftynessTimer = 0
                randomDirectionChange(this)}
                
            // p(this.direction)
            //if direction
            if (this.direction.up === true) {
                this.y -= this.speed
                if (this.y <= 0) { //Need ask about = in <=
                    this.y = 0
                    this.changeDirection(this,'down')}
            } 
            else if (this.direction.left === true) {
                this.x -= this.speed
                if (this.x <= 0 ){
                    this.x = 0
                    this.changeDirection(this,'right')}
            }
            else if (this.direction.down === true) {
                this.y += this.speed
                if (this.y >= game.height){
                    this.y = game.height
                    this.changeDirection(this,'up')}
            }
            else if (this.direction.right === true) {
                this.x += this.speed
                if (this.x >= game.width){
                    this.x = game.width
                    this.changeDirection(this,'left')}
            }
        }
        this.move = function () {
            // p('In the player.move')
            // p('up: '+this.direction.up)
            // p('down: '+this.direction.down)
            // p('right: '+this.direction.right)
            // p('left: '+this.direction.left)
            if (this.direction.up === true) {
                this.y -= this.speed
                if (this.y <= 0) { //Need ask about = in <=
                    this.y = 0}
            } 
            else if (this.direction.left === true) {
                this.x -= this.speed
                if (this.x <= 0 ){
                    this.x = 0}
            }
            else if (this.direction.down === true) {
                this.y += this.speed
                if (this.y >= game.height){
                    this.y = game.height}
            }
            else if (this.direction.right === true) {
                this.x += this.speed
                if (this.x >= game.width){
                    this.x = game.width}
            }
        } 
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

//Make players on the board.
let player = new Sprite(100, game.height/4, {up:false,down:false,left:false,right:false}, playerSpeed, 'lightsteelblue', spriteWidth, spriteHeight)
let zombie = []
for (let i = 0; i < 5; i++){
    // zombie.push(new Sprite(
    //     Math.floor(Math.random() * (game.width - (spriteWidth + (10 * 2)))) + 10, 
    //     Math.floor(Math.random() * (game.height - (spriteHeight + (10 * 2)))) + 10, 
    //     'up', '#bada55', spriteWidth, spriteHeight))
    zombie.push(new Sprite(
        (game.width/2), 
        (game.height/2), 
        {up:false,down:false,left:false,right:true}, zombieSpeed, '#bada55', spriteWidth, spriteHeight))
} 

// MAIN FUNCTION \\
const gameLoop = () => {
    
    ctx.clearRect(0, 0, game.width, game.height)
    
    // messageBoard.textContent = player.x + ', ' + player.y + '\nKills: ' + killCount 
    
    // const str = "Zombie X: "+zombie[0].x+"\nZombe Y: "+zombie[0].y
    // p(str)
    detectHit()

    if (player.alive === true) {
        player.render()
        player.move()
    } 

    zombie.forEach(zombie => {
        if (zombie.alive === true) {
            zombie.render()
            zombie.moveByAI()
        }
    })
}

// we're going to do this, when the content loads
document.addEventListener('DOMContentLoaded', function () {
    // in here, we need to have our movement handler
document.addEventListener('keydown', movementHandler)
document.addEventListener('keyup', keyuup)
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
        p("player.Direction: I would need to make a function for that.")
        if (player.direction.up === true) {
            zombieSearch.forEach(zombie => {
                if ((((player.x)) < (zombie.x + spriteWidth) )  
                && ((((player.x) + spriteWidth)) > (zombie.x))
                && ((player.y + spriteHeight) > zombie.y)
                && ((player.y - knifeRange) < (zombie.y + spriteHeight)))
                    killZombie(zombie)
            })
        } else if (player.direction.right === true) {
            zombieSearch.forEach(zombie => { 
                if ((((player.x + spriteWidth)) < zombie.x )
                && ((((player.x + spriteWidth) + knifeRange)) > zombie.x)
                && ((player.y + spriteHeight) > zombie.y)
                && (player.y < (zombie.y + spriteHeight)))
                    killZombie(zombie)
            })
        } else if (player.direction.down === true) {
            zombieSearch.forEach(zombie => {
                if ((((player.x)) < (zombie.x + spriteWidth) )  
                    && ((((player.x) + spriteWidth)) > (zombie.x))
                    && ((player.y + spriteHeight + knifeRange) > zombie.y)
                    && ((player.y) < (zombie.y)))
                        killZombie(zombie)
            })
        } else if (player.direction.left === true) {
            zombieSearch.forEach(zombie => {
                if ((((player.x)) > (zombie.x + spriteWidth) )
                && ((((player.x) - knifeRange)) < (zombie.x + spriteHeight))
                && ((player.y + spriteHeight) > zombie.y)
                && (player.y < (zombie.y + spriteHeight)))
                    killZombie(zombie)
            })
        }
}
const keyuup = e => {
    p('\n\n\nThe key been let go!')
    p('keyLock was on '+keyLock)
    keyLock = false
    p('keyLock is now '+keyLock)
    p(`e.key: ${e.key} keyLast: ${keyLast}`)
    if (e.key === keyLast) {
        p('Before reset all to false.')
        p(player.direction)
        Object.keys(player.direction).forEach(directionKey => {
            // p('inside the Forloop')
            // p('Was direction '+player.direction.directionKey)
            player.direction[directionKey] = false
            // p('Changed direction to '+player.direction.directionKey)
        })
        p('After reset all flase.')
        p(player.direction)

    }
    else
        changePlayerDirection(keyLast)
}
// this function is going to be how we move our players around
const movementHandler = (e) => {
    console.log('\n\n\nIn the key down: '+e.key)
    if (e.key === ' '){ //spacebar
        console.log("sing!!!!")
        knifeSwing()
        return}
    if (!keyLock){
        p('not locked')
        changePlayerDirection(e.key)
    }
    switch (e.key) {
        case ('w'):
        case ('ArrowUp'):
        case ('a'):
        case ('ArrowLeft'):
        case ('s'):
        case ('ArrowDown'):
        case ('d'):
        case ('ArrowRight'):
        keyLast = e.key 
        p('lastkey value given: '+keyLast)
        break
    }
    keyLock = true
    p('check keyLock as been set to true: '+keyLock+'\n')
}
const changePlayerDirection = (key) => {
    p('The value of the e.key passed to ChaPlayerDir is: ' + key)
    switch (key) {
            
        case ('w'):
        case ('ArrowUp'):
                player.changeDirection(player, 'up')
                // player.y -= player.speed
                // if (player.y <= 0){
                //     player.y = 0} 
        break
        case ('a'):
        case ('ArrowLeft'):
        // case (40):
            // this moves the player left
            player.changeDirection(player, 'left')
                // player.x -= player.speed
            // if (player.x < 0){
            //     player.x = 0}
        break
        case ('s'):
        case ('ArrowDown'):
            player.changeDirection(player, 'down')
            // player.y += player.speed
            // if (player.y > game.height)
            //     player.y = game.height
        break
        case ('d'):
        case ('ArrowRight'):
            // this moves the player to the right
            player.changeDirection(player, 'right')
            // player.x += player.speed
            // if (player.x > game.width){
            //     player.x = game.width}
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
    // p('KILLED!!!!!!') 
} 
const convertDirectionNumber = (sprite) => {
    if (sprite.direction.up === true)
        return 0
    if (sprite.direction.right === true)
        return 1
    if (sprite.direction.down === true)
        return 2
    if (sprite.direction.left === true)
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
        sprite.changeDirection(sprite,'up')}
    if (newDirectionInt === 1){
        sprite.changeDirection(sprite,'right')}
    if (newDirectionInt === 2){
        sprite.changeDirection(sprite,'down')}
    if (newDirectionInt === 3){
        sprite.changeDirection(sprite,'left')}
}
const directionMatch = (sprite, direction) => {
    switch (direction) {
        case 'up':
            if(sprite.direction.up === true)
                return true            
        break;
        case 'down':
            if(sprite.direction.down === true)
                return true 
        break;
        case 'right':
            if(sprite.direction.right === true)
                return true 
        break;
        case 'left':
            if(sprite.direction.left === true)
                return true 
        break;
    }
}