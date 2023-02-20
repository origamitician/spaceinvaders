const canvas = document.getElementById("myCanvas");
const c = canvas.getContext("2d");
c.imageSmoothingEnabled = false;
collisionRadius = 17;
borderThickness = collisionRadius/5
alienSpeed = 3
shipSize = 35
score = 0;
var alienInterval; 

canvas.setAttribute('height', window.innerHeight+ "px");
canvas.setAttribute('width', window.innerWidth + "px");

var xPos = -1
var yPos = -1

//sounds
var shotSound = new Audio("./sounds/laser.mp3")

//VITAL FUNCTIONS
function updateMousePos(event){
    let rect = canvas.getBoundingClientRect();
    xPos = event.clientX - rect.left;
    yPos = event.clientY - rect.top;
}

function drawShip(x, y){
    const img = new Image()
    img.src = "./assets/ship1.png"
    c.drawImage(img, x-shipSize, y-shipSize, shipSize*2, shipSize*2)
}


//MAIN GAME LOOP
let currentSector = 1
let currentSectorDetails = []

//initWave("120F6-120L0.5-50R3-50F6-3R40-120F6-60L1-100F6", 70, "112233", 0, 300, 0, true)
let start = Date.now();

let cleared = 0;
let clearedByShip = 0;

function initWaveID(sector, id, acceleration){
    clearInterval(alienInterval);
    let target = listOfWaves[sector-1][id-1];
    cleared = 0;
    clearedByShip = 0;
    initWave(target.command, target.length, target.pattern, parseFloat(target.coords.split(",")[0]), parseFloat(target.coords.split(",")[1]), target.double, true, acceleration)
    alienInterval = setInterval(initAlien, Math.round(250/waveInfo.speedIncrease))
}

let multiplier = 1;
let waveNumber = 2;
let waveInitialized = false;
initWaveID(1, 1, 5)
function frame(){
    c.clearRect(0, 0, canvas.width, canvas.height);
    cloneAliens()
    updateAlienCoords()
    //console.log(listOfAliens)
    drawShip(xPos, yPos-5)
    if(Date.now() - start >200){

        initShot(xPos, yPos-10, "fast")
        
        start = Date.now()
    }
    cloneShots()
    updateShotCoords()

    drawDeathParticles()
    updateDeathParticles()
    
    drawProjectiles()
    updateProjectileCoords()

    updateStars()
    if(Math.floor(Math.random()*10) == 1){
        stars.push({x: Math.floor(Math.random()*1280), y: 0, gravity: Math.floor(Math.random()*4)+4})    
    }
    drawStars()

    updateText()
    renderText()

    multiplier += 0.0001;
    
    //actual main game loop
    if(listOfWaves[0][waveNumber-2].double){
        if(cleared >= listOfWaves[0][waveNumber-2].length*2){
            if(clearedByShip == listOfWaves[0][waveNumber-2].length*2){
                textsOnScreen.push({text: "Wave cleared! +" + Math.round(0.5*multiplier*Math.pow(clearedByShip, 2)).toString(), font: "35px Inconsolata", x: 600, y: 300, life: 30, offset: 50, loop: 0})
                score += Math.round(0.5*multiplier*Math.pow(clearedByShip, 2));
                document.getElementById("scoreDiv").innerHTML = score;
            }
            setTimeout(() => {initWaveID(1, waveNumber-1, 1)}, 500) //wavenumber increments
            cleared = 0;
            waveNumber++;
        }
        
    }else{
        if(cleared >= listOfWaves[0][waveNumber-2].length){
            if(clearedByShip == listOfWaves[0][waveNumber-2].length){
                textsOnScreen.push({text: "Wave cleared! +" + Math.round(0.5*multiplier*Math.pow(clearedByShip, 2)).toString(), font: "35px Inconsolata", x: 600, y: 300, life: 30, offset: 50, loop: 0})
                score += Math.round(0.5*multiplier*Math.pow(clearedByShip, 2));
                document.getElementById("scoreDiv").innerHTML = score;
            }
    
            setTimeout(() => {initWaveID(1, waveNumber-1, 1)}, 500)
            cleared = 0;
            waveNumber++;
        }
    }
}

document.getElementById("myCanvas").addEventListener("mousemove", updateMousePos)
var interval = setInterval(frame, 10)
