const game = document.getElementById('canvas')
const playerSpeed = 8
let killCount = 0
const numberOfZombies = 10 //number of zombies in the game.
const winCondition = numberOfZombies //The number of zombie to win game.
const zombieSpeed = 3
let keyLock = false //lock the directional keys untill the direction buttons have been keyed up.
let keyLast = null //Keep track of the last direction key was press for when the keylock has been set to false (as in the player has not let go of the direction key he been holding.)
const knifeRange = 20 //Value in px that player can kill a zombie.
// Far as I can tell this is the paintbrush.
const ctx = game.getContext('2d')

// so, we have a variable height and width on our canvas, so we need to get that height and width as a reference point so we can do stuff with it later.
game.width = 528
game.height = 368
//Example code has this in there. So I figured it was there for a reason.
game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height'])

// Images for the sprites in the game. And for the win/lose picture
    // This the map.
const image = new Image()
image.src = 'img/map2.bmp'
    // This is for the player's sprite with no weapen for the menu.
const wonPlayer = new Image()
wonPlayer.src = 'img/goblin.png'
    // Player Sprite image and Frame values.
const playerImgRaw = new Image()
playerImgRaw.src = 'img/goblinsword.png'
const playerImg = {
    img: playerImgRaw,
    copXIndex: 0, 
    copYIndex: 0,
    maxXIndex: 6, //9 imgaes For the frames needed
    maxYIndex: 4, //4 imgaes, one for each direction
    width: playerImgRaw.width/11, 
    height: (playerImgRaw.height/5)
}
    // Zombie Sprite image and Frame value.
const zombieImageRaw = new Image()
zombieImageRaw.src = 'img/zombie_0.png'
const zombieImg = {
    img: zombieImageRaw,
    copXIndex: 4, //* (zombieImageRaw.width/3),
    copYIndex: 2, //6: down, 0: left, 2: up, 4: right
    maxXIndex: 11, 
    maxYIndex: 6, //4 imgaes, one for each direction.
    width: (zombieImageRaw.width/36), 
    height: zombieImageRaw.height/8,
}

console.log('this is the canvas width', game.width)
console.log('this is the canvas height', game.height)

// Class with player's varibles and functions for moving and displaying.
class Player {
    constructor(x, y, direction, speed, skin) {
            // Starting point for the img not the sprite.
        this.x = x, 
        this.y = y,
            // This the location of where you can actoually see the sprite.
            //These value are used for the collition dection and kill range.
        this.Xsprite = x + 17  //When img is reset for hitting a boundry this need
        this.Ysprite = y + 5   //to be reset too by these numbers
        this.spriteWidth = 34
        this.spriteHeight = 57
        this.direction = direction, //this the direction only when moving.
        this.facingDirection = direction //this is the actoul direction the sprite is facing.
        this.speed = speed, 
            //this is the image object of the sprite.
        this.skin = skin,
        
        this.alive = true
    }

    move = function () {
        if (this.direction.up === true) {
            this.y -= this.speed //The player img and hit box need to be moved together
            this.Ysprite -= this.speed
            if (this.Ysprite <= 0) { //Need ask about = being <=
                this.Ysprite = 0 
                this.y = -5}
            this.changeFrame('up') //changeFrame change which img will show.
        } 
        else if (this.direction.left === true) {
            this.x -= this.speed 
            this.Xsprite -= this.speed
            if (this.Xsprite <= 0) { //Need ask about = in <=
                this.Xsprite = 0 
                this.x = -17}
            this.changeFrame('left')
        }
        else if (this.direction.down === true) {
            this.y += this.speed
            this.Ysprite += this.speed
            if (this.Ysprite >= (game.height - 82)){
                this.Ysprite = game.height
                this.y = game.height - 5 -82}
            this.changeFrame('down')
        }
        else if (this.direction.right === true) {
            this.x += this.speed
            this.Xsprite += this.speed
            if (this.Xsprite >= game.width-40){
                this.Xsprite = game.width
                this.x = game.width - 17-40}
            this.changeFrame('right')
        }
    } 
    render = function () {
        //THIS is still here for if the img is ever changed. You can turn these back on.
        //     // This to show the actoual img with and hight.
        // ctx.fillStyle = 'green'
        // ctx.fillRect(this.x, this.y, this.skin.width, this.skin.height)
        //     // This to show the hit/collition box for the sprite.
        // ctx.fillStyle = 'red'
        // ctx.fillRect(this.Xsprite, this.Ysprite, this.spriteWidth, this.spriteHeight)
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
    // This fucrion will change which frame of the pictuer will be used when rendered
    changeFrame = function (direction) {
        //Y is this sprite's direction
        //X is this sprite movement frame.
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
class Zombie { //ClEAN UP - Remove width and height from constructor.
    constructor(x, y, direction, speed, skin) {
            // Starting point for the img not the sprite.
        this.x = x,
        this.y = y,
            // This the location of where you can actoually see the sprite.
            // These value are used for the collition dection and kill range.
        this.Xsprite = x + 39 //When img is reset for hitting a boundry this need
        this.Ysprite = y + 46 //to be reset too by these numbers
        this.spriteWidth = 49
        this.spriteHeight =  57
        this.direction = direction, 
        this.speed = speed, 
            // Copy of the object needed her since this object records what frame the sprite is on and there more then one.
        this.skin = {...skin},
        
        this.alive = true,
            //Thise values are used to add randomness to the AI. And give each zombie made his own random levels. Min and max give them a ranch can can be at.
        this.min = 30
        this.max = 70
        this.shiftyness = Math.floor(Math.random() * (this.max-this.min))+this.min
        this.shiftynessTimer = 0 
    } 
    moveByAI = function() {
        //checks to see if it's time to randomly change directions. change direction
        this.shiftynessTimer++
        if (this.shiftynessTimer === this.shiftyness) {
            this.shiftynessTimer = 0
            randomDirectionChange(this)}
        // The rest will move the zombie in the direction that it is moving in.
        // the if else are there because this game set to only ever have one direction at a time.
        if (this.direction.up === true) {
            this.y -= this.speed    //Img and hit box both need to move.
            this.Ysprite -= this.speed
            if (this.Ysprite <= 0) { //Need ask about = in <=
                this.Ysprite = 0
                this.y = -46
                changeDirection(this,'down')}  //unlike player, AI need change direction right away when he hits an object.
            this.changeFrame('up') //updates what frame being used.
        } 
        else if (this.direction.left === true) {
            this.x -= this.speed
            this.Xsprite -= this.speed
            if (this.Xsprite <= 0 ){
                this.Xsprite = 0
                this.x = -39
                changeDirection(this,'right')}
            this.changeFrame('left')
        }
        else if (this.direction.down === true) {
            this.y += this.speed
            this.Ysprite += this.speed
            if (this.Ysprite >= game.height){
                this.Ysprite = game.height
                this.y = game.height - 46
                changeDirection(this,'up')}
            this.changeFrame('down')
        }
        else if (this.direction.right === true) {
            this.x += this.speed
            this.Xsprite += this.speed
            if (this.Xsprite >= game.width){
                this.Xsprite = game.width
                this.x = game.width -39
                changeDirection(this,'left')}
            this.changeFrame('right')
        }
    }
    render = function () {
        // THIS is still here for if the img is ever changed. You can turn these back on.
            // This to show the actoual img with and hight.
        ctx.fillStyle = 'green' //box around the img
        ctx.fillRect(this.x, this.y, this.skin.width, this.skin.height)
            // This show the hit/collition box
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
    changeFrame = function (direction) {
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

//Make players on the board.
let player = new Player(100, game.height/4, {up:false,down:false,left:false,right:false}, playerSpeed, playerImg)
let zombie = []
for (let i = 0; i < numberOfZombies; i++){
    // zombie.push(new Sprite(
    //     Math.floor(Math.random() * (game.width - (spriteWidth + (10 * 2)))) + 10, 
    //     Math.floor(Math.random() * (game.height - (spriteHeight + (10 * 2)))) + 10, 
    //     'up', '#bada55', spriteWidth, spriteHeight))
    zombie.push(new Zombie(
        (game.width/2), 
        (game.height/2), 
        {up:false,down:false,left:true,right:false}, //strech start random.
        zombieSpeed, zombieImg))
} 

// MAIN FUNCTION \\
const gameLoop = () => {
    
    ctx.clearRect(0, 0, game.width, game.height)
    ctx.drawImage(image, 0,0)
    
    zombie.filter(zombie => {
        return zombie.alive === true
    }).forEach(zombie => {
        detectHit(zombie)
    })

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
    if (killCount === winCondition){
        wonGame(true)}
}
const wonGame = (ifWon) => {
    clearInterval(interval)
    setTimeout(() => {
        ctx.fillStyle = 'blue'
        ctx.fillRect(70,30,400,307)
        ctx.fillStyle = 'green' 
        ctx.textAlign = 'center'
        ctx.font = "50px Georgia";
        if (ifWon){
            ctx.fillText('You Win!', game.width/2, game.height/3)
        } else {
            ctx.fillText('You lost!', game.width/2, game.height/3)}
        function ifWonPicture(ifWon) {
            if (ifWon === true)
                return 2 * (playerImg.width)
            else {
                return 4 * (playerImg.width)
            }
        }
        ctx.save()
        ctx.scale(2,2)
        ctx.drawImage(
            wonPlayer, 
            ifWonPicture(ifWon),
            4 * (playerImg.height), 
            playerImg.width, 
            playerImg.height, 
            100, 50,
            playerImg.width, 
            playerImg.height) 
        ctx.restore()
        ctx.font = "20px Georgia";
        if (ifWon) {
            ctx.fillText("Goblen Things You for keeping him alive.", game.width/2, game.width/2)
        } else {
            ctx.fillText("You got Goblen killed.", game.width/2, game.width/2)}
        const replay = document.querySelector('#game-ended')
        replay.style.display = 'inline-block'
        replay.addEventListener('click', () => {window.location.reload()})
    }, 1000)
    
}
// we're going to do this, when the content loads
document.addEventListener('DOMContentLoaded', function () {
    // in here, we need to have our movement handler
document.addEventListener('keydown', movementHandler)
document.addEventListener('keyup', keyuup)
    // we also need our game loop running at an interval
    interval = setInterval(gameLoop, 60)
    
})

const knifeSwing = () => {
    let zombieSearch = []
    zombieSearch = zombie.filter(zombie => {
        return zombie.alive === true
    }).filter(zombie => {
        return (((convertDirectionNumber(player) + 2) % 4) !== convertDirectionNumber(zombie))
    })
    if (player.facingDirection === 'up') {
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
        if ((e.key === keyLast)) {
            Object.keys(player.direction).forEach(directionKey => {
                if (player.direction[directionKey] === true) {
                    player.facingDirection = directionKey
                    player.direction[directionKey] = false
                    return
                }
            })
        }
        else {
            changePlayerDirection(keyLast)
        }
    }
}
// this function is going to be how we move our players around
const movementHandler = (e) => {
    if (e.key === ' '){ //spacebar
        knifeSwing()
        return
    }
    if (!keyLock){
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
}
const changePlayerDirection = (key) => {
    switch (key) {
        case ('w'):
        case ('ArrowUp'):
                changeDirection(player, 'up')
        break
        case ('a'):
        case ('ArrowLeft'):
            changeDirection(player, 'left')
        break
        case ('s'):
        case ('ArrowDown'):
            changeDirection(player, 'down')
        break
        case ('d'):
        case ('ArrowRight'):
            changeDirection(player, 'right')
        break
    }
}
const detectHit = (zombie) => {
        if (player.Xsprite < zombie.Xsprite + zombie.spriteWidth
            && player.Xsprite + player.spriteWidth > zombie.Xsprite
            && player.Ysprite < zombie.Ysprite + zombie.spriteHeight
            && player.Ysprite + player.spriteHeight > zombie.Ysprite) {
            player.alive = false
            wonGame(false)
        }
}
const killZombie = zombie => {
    zombie.alive = false
    killCount++
} 
const convertDirectionNumber = (sprite) => {
    if (sprite.facingDirection){
        if (sprite.facingDirection === 'up')
            return 0
        if (sprite.facingDirection === 'right')
            return 1
        if (sprite.facingDirection === 'down')
            return 2
        if (sprite.facingDirection === 'left')
            return 3}
    else{
        if (sprite.direction.up === true)
            return 0
        if (sprite.direction.right === true)
            return 1
        if (sprite.direction.down === true)
            return 2
        if (sprite.direction.left === true)
            return 3
    }
    return "-1"
} 
const randomDirectionChange = (sprite) => {
    const leftOrRight = Math.round(Math.random())
    let newDirectionInt = null
    if (leftOrRight === 0) {
        newDirectionInt = convertDirectionNumber(sprite) + 3 //no - num
    } else { 
        newDirectionInt = convertDirectionNumber(sprite) + 1}
    newDirectionInt %= 4

    if (newDirectionInt === 0){
        changeDirection(sprite,'up')}
    if (newDirectionInt === 1){
        changeDirection(sprite,'right')}
    if (newDirectionInt === 2){
        changeDirection(sprite,'down')}
    if (newDirectionInt === 3){
        changeDirection(sprite,'left')}
}
// const directionMatch = (sprite, direction) => {
//     switch (direction) {
//         case 'up':
//             if(sprite.direction.up === true)
//                 return true            
//         break;
//         case 'down':
//             if(sprite.direction.down === true)
//                 return true 
//         break;
//         case 'right':
//             if(sprite.direction.right === true)
//                 return true 
//         break;
//         case 'left':
//             if(sprite.direction.left === true)
//                 return true 
//         break;
//     }
// }
changeDirection = function(sprite, direction) {
    Object.keys(sprite.direction).forEach(key => {
        sprite.direction[key] = false;
    })
    sprite.direction[direction] = true
    if (sprite.facingDirection){
        sprite.facingDirection = direction
    }
}