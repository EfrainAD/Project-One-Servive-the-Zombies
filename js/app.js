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
game.width = 528
game.height = 368
game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height'])

const image = new Image()
image.src = 'img/map2.bmp'

const playerImgRaw = new Image()
playerImgRaw.src = 'img/goblinsword.png'
const playerImg = {
    img: playerImgRaw,
    copXIndex: 0, //* (zombie5ImgRaw.width/3),
    copYIndex: 0,
    maxXIndex: 6, //9 imgaes
    maxYIndex: 4, //2 imgaes, one for each direction.
    width: playerImgRaw.width/11, 
    height: (playerImgRaw.height/5)
}
const zombie5ImgRaw = new Image()
zombie5ImgRaw.src = 'img/zombie_0.png'
// zombie5ImgRaw.set_size(0.5)
// zombie5ImgRaw.height = 30
const zombieImg = {
    img: zombie5ImgRaw,
    // frameX: 0,
    // frameY: 0,
    copXIndex: 4, //* (zombie5ImgRaw.width/3),
    copYIndex: 2, //6: down 0: left 2: up 4:
    // copYIndex: 0, //6: down, 0: left, 2: up, 4: right
    maxXIndex: 11, //3 imgaes
    maxYIndex: 6, //4 imgaes, one for each direction.
    width: (zombie5ImgRaw.width/36), 
    height: zombie5ImgRaw.height/8,
    // frameWalking: 
}



console.log('this is the canvas width', game.width)
console.log('this is the canvas height', game.height)

// Objects are made of properties(K:v pairs) and methods(functions)
class Player {
    constructor(x, y, direction, speed, skin, width, height) {
        this.x = x,
        this.y = y,
        this.Xsprite = x + 17 //left and right reach.
        this.Ysprite = y + 5     //When adjust the hit box with boundrys do oposite,
        this.spriteWidth = 34
        this.spriteHeight = 57
        this.direction = direction, //I think this will work.
        this.facingDirection = direction
        this.speed = speed,
        this.skin = skin,
        this.width = width,
        this.height = height
        
        this.alive = true,
        this.shiftyness = shiftynessGlobal
        this.shiftynessTimer = 0
        
        p('On creation: '+this.facingDirection)
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
            sprite.facingDirection = direction
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
                this.Ysprite -= this.speed
                if (this.Ysprite <= 0) { //Need ask about = in <=
                    this.Ysprite = 0 
                    this.y = -5
                }
                else{
                    this.changeFrame('up')}
            } 
            else if (this.direction.left === true) {
                this.x -= this.speed
                this.Xsprite -= this.speed
                if (this.Xsprite <= 0) { //Need ask about = in <=
                    this.Xsprite = 0 
                    this.x = -17}
                else{
                    this.changeFrame('left')}
            }
            else if (this.direction.down === true) {
                this.y += this.speed
                this.Ysprite += this.speed
                if (this.Ysprite >= game.height){
                    this.Ysprite = game.height
                    this.y = game.height - 5}
                else{
                    this.changeFrame('down')}
            }
            else if (this.direction.right === true) {
                this.x += this.speed
                this.Xsprite += this.speed
                if (this.Xsprite >= game.width){
                    this.Xsprite = game.width
                    this.x = game.width - 17}
                else{
                    this.changeFrame('right')}
            }
        } 
        this.render = function () {
            ctx.fillStyle = 'green'
            ctx.fillRect(this.x, this.y, this.skin.width, this.skin.height)
            ctx.fillStyle = 'red'
            ctx.fillRect(this.Xsprite, this.Ysprite, this.spriteWidth, this.spriteHeight)
            ctx.drawImage(
                this.skin.img, 
                this.skin.copXIndex * (this.skin.width), 
                this.skin.copYIndex * (this.skin.height), 
                this.skin.width, 
                this.skin.height, 
                this.x, this.y,
                this.skin.width, 
                this.skin.height
                )            
            }
        this.changeFrame = function (direction) {
            //Standing
            if (direction === 'down'){
                this.skin.copYIndex = 0
                this.skin.copXIndex += 1
            }
            if (direction === 'up'){
                this.skin.copYIndex = 2
                this.skin.copXIndex += 1
            }
            if (direction === 'left'){
                this.skin.copYIndex = 3 
                this.skin.copXIndex += 1
            }
            if (direction === 'right'){
                this.skin.copYIndex = 1
                this.skin.copXIndex += 1
            }
            if (this.skin.copXIndex > (this.skin.maxXIndex - 1)) {
                this.skin.copXIndex = 0
            }            
        }
    } 
}
class Zombie { //ClEAN UP - Remove width and height from constructor.
    constructor(x, y, direction, speed, skin, width, height) {
        this.x = x,
        this.y = y,
        this.Xsprite = x + 39 //left and right reach.
        this.Ysprite = y + 46
        this.spriteWidth = 49
        this.spriteHeight =  57
        this.direction = direction, //I think this will work.
        this.speed = speed,
        this.skin = skin,
        this.width = this.skin.width/4,
        this.height = this.skin.height/4,
        
        this.alive = true,
        this.shiftyness = shiftynessGlobal
        this.shiftynessTimer = 0
        
        // p('On creation: '+this.direction)
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
                this.Ysprite -= this.speed
                if (this.Ysprite <= 0) { //Need ask about = in <=
                    this.Ysprite = 0
                    this.y = -46
                    this.changeDirection(this,'down')}
                else{
                    this.changeFrame('up')}
            } 
            else if (this.direction.left === true) {
                this.x -= this.speed
                this.Xsprite -= this.speed
                if (this.Xsprite <= 0 ){
                    this.Xsprite = 0
                    this.x = -39
                    this.changeDirection(this,'right')}
                else{
                    this.changeFrame('left')}
            }
            else if (this.direction.down === true) {
                this.y += this.speed
                this.Ysprite += this.speed
                if (this.Ysprite >= game.height){
                    this.Ysprite = game.height
                    this.y = game.height - 46
                    this.changeDirection(this,'up')}
                else{
                    this.changeFrame('down')}
            }
            else if (this.direction.right === true) {
                this.x += this.speed
                this.Xsprite += this.speed
                if (this.Xsprite >= game.width){
                    this.Xsprite = game.width
                    this.x = game.width -39
                    this.changeDirection(this,'left')}
                else{
                    this.changeFrame('right')}
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
            // ctx.fillStyle = 'green' //box around the img
            // ctx.fillRect(this.x, this.y, this.skin.width, this.skin.height)
            ctx.fillStyle = 'red'
            ctx.fillRect(this.Xsprite, this.Ysprite, this.spriteWidth, this.spriteHeight)
            ctx.drawImage(
                this.skin.img, 
                this.skin.copXIndex * (this.skin.width), 
                this.skin.copYIndex * (this.skin.height), 
                this.skin.width, 
                this.skin.height, 
                this.x, this.y,
                this.skin.width, 
                this.skin.height
            )    
        }
        this.changeFrame = function (direction) {
            if (direction === 'down'){
                this.skin.copYIndex = 6
                this.skin.copXIndex += 1
            }
            if (direction === 'up'){
                this.skin.copYIndex = 2
                this.skin.copXIndex += 1
            }
            if (direction === 'left'){
                this.skin.copYIndex = 0 
                this.skin.copXIndex += 1
            }
            if (direction === 'right'){
                this.skin.copYIndex = 4
                this.skin.copXIndex += 1
            }
            if (this.skin.copXIndex > (this.skin.maxXIndex - 1)) {
                this.skin.copXIndex = 0
            }            
        }
    } 
}

//Make players on the board.
let player = new Player(100, game.height/4, {up:false,down:false,left:false,right:false}, playerSpeed, playerImg, spriteWidth, spriteHeight)
let zombie = []
for (let i = 0; i < 1; i++){
    // zombie.push(new Sprite(
    //     Math.floor(Math.random() * (game.width - (spriteWidth + (10 * 2)))) + 10, 
    //     Math.floor(Math.random() * (game.height - (spriteHeight + (10 * 2)))) + 10, 
    //     'up', '#bada55', spriteWidth, spriteHeight))
    zombie.push(new Zombie(
        (game.width/2), 
        (game.height/2), 
        {up:false,down:false,left:true,right:false}, zombieSpeed, zombieImg, spriteWidth, spriteHeight))
} 

// MAIN FUNCTION \\
const gameLoop = () => {
    
    ctx.clearRect(0, 0, game.width, game.height)
    ctx.drawImage(image, 0,0)
    
    // messageBoard.textContent = player.x + ', ' + player.y + '\nKills: ' + killCount 
    
    // const str = "Zombie X: "+zombie[0].x+"\nZombe Y: "+zombie[0].y
    // p(str)
    zombie.filter(zombie => {
        return zombie.alive === true
    }).forEach(zombie => {
        p('AAALLLIVE')
        detectHit(zombie)
    })

    if (player.alive === true) {
        player.render()
        player.move()
    } 

    zombie.forEach(zombie => {
        if (zombie.alive === true) {
            zombie.render()
            // zombie.moveByAI()
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
    p('swing!')
    let zombieSearch = []
    zombieSearch = zombie.filter(zombie => {
        return zombie.alive === true
    }).filter(zombie => {
        return ((convertDirectionNumber(player) + 2) % 4) !== convertDirectionNumber(zombie)
    })
    // p("I go past filers? yes")
    p("player.Direction: " + convertDirectionNumber(player))
    if (player.facingDirection === 'up') {
        p('I am facing UP!')
        zombieSearch.forEach(zombie => {
            if ((((player.Xsprite)) < (zombie.Xsprite + zombie.spriteWidth) )  
            && ((((player.Xsprite) + player.spriteWidth)) > (zombie.Xsprite))
            && ((player.Ysprite + player.spriteHeight) > zombie.Ysprite)
            && ((player.Ysprite - knifeRange) < (zombie.Ysprite + zombie.spriteHeight)))
                killZombie(zombie)
        })
    } else if (player.facingDirection === 'right') {
        zombieSearch.forEach(zombie => { 
            if ((((player.Xsprite + player.spriteWidth)) < zombie.Xsprite )
            && ((((player.Xsprite + player.spriteWidth) + knifeRange)) > zombie.Xsprite)
            && ((player.Ysprite + player.spriteHeight) > zombie.Ysprite)
            && (player.Ysprite < (zombie.Ysprite + zombie.spriteHeight)))
                killZombie(zombie)
        })
    } else if (player.facingDirection === 'down') {
        zombieSearch.forEach(zombie => {
            if ((((player.Xsprite)) < (zombie.Xsprite + zombie.spriteWidth) )  
                && ((((player.Xsprite) + player.spriteWidth)) > (zombie.Xsprite))
                && ((player.Ysprite + player.spriteHeight + knifeRange) > zombie.Ysprite)
                && ((player.Ysprite) < (zombie.Ysprite)))
                    killZombie(zombie)
        })
    } else if (player.facingDirection === "left") {
        zombieSearch.forEach(zombie => {
            if ((((player.Xsprite)) > (zombie.Xsprite + zombie.spriteWidth) )
            && ((((player.Xsprite) - knifeRange)) < (zombie.Xsprite + zombie.spriteHeight))
            && ((player.Ysprite + player.spriteHeight) > zombie.Ysprite)
            && (player.Ysprite < (zombie.Ysprite + zombie.spriteHeight)))
                killZombie(zombie)
        })
    }
}
const keyuup = e => {
    // p('\n\n\nThe key been let go!')
    // p('keyLock was on '+keyLock)
    
    switch (e.key) {
        case ('w'):
        case ('ArrowUp'):
        case ('a'):
        case ('ArrowLeft'):
        case ('s'):
        case ('ArrowDown'):
        case ('d'):
        case ('ArrowRight'):
        keyLock = false
        // p('key lock been unlocked: '+keyLock)
        // break
        // p('keyLock is now '+keyLock)
        // p(`e.key: ${e.key} keyLast: ${keyLast}`)
        if ((e.key === keyLast)) {
            // p('Before reset all to false.')
            // p(player.direction)
            Object.keys(player.direction).forEach(directionKey => {
                // p('inside the Forloop')
                // p('Was direction '+player.direction.directionKey)
                if (player.direction[directionKey] === true) {
                    player.facingDirection = directionKey
                    player.direction[directionKey] = false
                    return
                }
                // p('Changed direction to '+player.direction.directionKey)
            })
            // p('After reset all flase.')
            // p(player.direction)
            
        }
        else {
            changePlayerDirection(keyLast)
        }
    }
}
// this function is going to be how we move our players around
const movementHandler = (e) => {
    // console.log('\n\n\nIn the key down: '+e.key)
    if (e.key === ' '){ //spacebar
        // console.log("sing!!!!")
        knifeSwing()
        return
    }
    if (!keyLock){
        // p('not locked')
        changePlayerDirection(e.key)
    }
    keyLock = true
    
    
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
        // p('lastkey value given: '+keyLast)
        break
    }
    
    // p('check keyLock as been set to true: '+keyLock+'\n')
}
const changePlayerDirection = (key) => {
    // p('The value of the e.key passed to ChaPlayerDir is: ' + key)
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
const detectHit = (zombie) => { //CLEAN UP - DOES FILTER ALIVE NEED TO BE HERE?
    // zombie.filter(zombie => { //NEED REMOVE DEAD ONES.
    //     return zombie.alive === true
    // }).forEach(zombie => {
        if (player.Xsprite < zombie.Xsprite + zombie.spriteWidth
            && player.Xsprite + player.spriteWidth > zombie.Xsprite
            && player.Ysprite < zombie.Ysprite + zombie.spriteHeight
            && player.Ysprite + player.spriteHeight > zombie.Ysprite) {
            player.alive = false
        }
    // })
}
const killZombie = zombie => {
    zombie.alive = false
    killCount++
    // p('KILLED!!!!!!') 
} 
const convertDirectionNumber = (sprite) => {
    if (sprite.facingDirection === 'up')
        return 0
    if (sprite.facingDirection === 'right')
        return 1
    if (sprite.facingDirection === 'down')
        return 2
    if (sprite.facingDirection === 'left')
        return 3
    return "-1"
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