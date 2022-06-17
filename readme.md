<h1>The game</h1>
This is a zoombie game about serviving by hiding and taking out the zoombie before they eat you.

User-Story
Game starts with zombie getting another person and a figure feeling out of view.
The view changes to him and he says "They are here, Lewie told me about them, and he's gone!"

Then a view of player status show up.
Health: Alive
double-barreled rifle: 0 // just call gun from here on,
machete: 0 //I am just calling this a knife from here.

WARNING: zombes can hear, and they are the dead rising up!

First time Player? <checkboxs>
Press any key to continue

cd seen "Servive"

cd Playmap.

Map will show zombies, machete, buildings and many grave stones. A message block will show up, "I need a weapen, or if one these things sees me I am a goner"

When he gets the knife two messages "Zobies can only be killed from the back or sides with this.\n press SPACEBAR to swing. *animation swing* "Now I need find who died and became one of these things with the key out of here!"

When he walks by one of the many he has a grave starts to make noise and one brakes out of it. and targets the user.

user runs but needs to brake sight from the zoombie while not running into another one. And the others around hom are heading to the brake out noise but least normal speed.

he goes around tree brakes sight. Zombes are not smart it seem and can't perdict where to look next. he'll go for a bit before slowing down.

The player at this point starts to sneak up on zommbes. He using the building, trees, and to sneak up behind them.

He can't avoid the graves unfortinatly because as he doing this at anyone one brakes from the ground. and he has to lose them again.

Now only that but user notices that sometimes zombie are add from the sides of the map.

But in one of the graves a gun is found. user grabs it.

message "guns can kill at any distense, but are loud and will attrack every zommbie on the map. you get two rounds." *the screen will update with gun icon and a 2.

he will runinot a zoombei wiht a key. The Zilda musie for when you get an idiam will play, and "Great, now I can get out of here."

![](Project-One-img/Project-One-img-1.jpg)
![](Project-One-img/Project-One-img-2.jpg)
![](Project-One-img/Project-One-img-3.jpg)
![](Project-One-img/Project-One-img-4.jpg)
![](Project-One-img/Project-One-img-5.jpg)
![](Project-One-img/Project-One-img-6.jpg)
//Test

How to do this
//Map
    // Map with be randomized at least for the start. If I choose to keep it that way or it genirates a map I think is good.
    // kife will be random. but only the first half of the game.
    // grave and, 
    // graves with sleeping zoombie will be random too.
    // Zoombie will placed randomly exept from the players area. So they can span from 3/4 of hight (starting from the top) of the playmat to only. 
    //two three building depending the the size of the playmat. They will start up random, untill enough game time test been done to deside there set location.
    //Tress (Under the hood will be small skinny building, User might need more places to hide)
    //object list of loactions. 
    //gate out. game end wen user clides with it with key value === 'true' will be plased on the top center.
zoombie 
    ///will walk randomly but never do a 180. So you'll want aim for beind them. You can attack from the sides but riskier. They will always be moving so they only change from right or left. 
    //property of their's will be how often to change direction (Randomized from a given list ranges.) They way it's not all the same.
    // They should have a walking speed and chase speed.
    //They will need a state for chase, walking, running, that will hold speed and anything else.
    // state changes when spotted player.
    // state changes back when they lost the player for 3 seconds. (Will need test. I am going to assume the reader undertands this from here on out.)
    // check see function will check if the player in front, by 30px and double the the zombies hight. this should give how far he can see and give with to his view.
        The check will need to have a function to lower the front view based on an object test. If player spotted do a isThereAnObject test first. This need be in a loop to go px by px becuause I dont want half the user hidden but sticking out and not be seen.
        I am not sure how to do this diagnally. I thinking maybe a line equestion to the user and and zoombie. If search shows no object move on in the loop. check will only done if it git a git. 
        //of time He'll grab very near zombies and send him in the same direction in chaise mode.
        Also have a chaseSoundMode Will run to that spot. They stay in this spot untill they have gotton to spot + sightrange then change to notchase mode.
// user 
    // he start with his chase mode on 0. He will definitly be move faster. I'll be playing this game a lot. And I'd like it on a more faster pace side, though it's a hide and kill them game.
    // His chase mode will have him move a little faster with a timer on it.
    knife
        If he has a knife he can use it. 
        //It will do a check to see if 
            Zombie is in range by using only hiw sides and back boarder. if front boarder detected return flase. (NOt sure if that needed.)
        Gun 
        //fired will have no range but will be only a px long.
        //there be check if user has one. 
        //the sound will have no range either.
        The bulit counter will drop one. if 0 the gun value be turn to false.
        key
        //This start with a false
        //when triggers true hit will make noise. 
graves with sleepers
    //Will have a range.
    //make noise and image to show state changing. Give player heads up.
    //brake out and then do a check for player location and go straite for him. in chase mode. Change to chase mode will change user state to chase mode too.
    //This leave behind a open grave. So rave value will change from sleeper to open grave.
    //open grave will 
        //1. if user hits it. move user in location and turn off his move. Untill he hold a direction for 5seconds. (I dont know how to do this. mabye get a counter that goes up when he's in stuck mode that will be 5 sconds long (or a view that takes 5 seconds of holding key to get) Or maybe record the time clicked in a time range. Not sure.
        //2. hide user if in it. (if his state in nonchase)
        //3. if zoombie hit it. He's moved to it, with He moveing turn off. That way he can still kill user if he falls in it.
        //4. There should be a value if the grave has a gun inside. this will have a set amount when the game places the graves. the location the only thing random.
building/trees
    // Will stop the player from moving in that direction. I assume the move function will do a check if object there by refersing a object sheet that be made when map loads.
    //will stop sites the just note that these need be set into the move function.
Key
    //This will not be attached to a zoombie. it will show up when the kill counter hit kill goal that the player will not be awair of. it will grab the location and spown there. should be in a function zombie dies.
