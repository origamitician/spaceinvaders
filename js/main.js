const canvas = document.getElementById("myCanvas");
const c = canvas.getContext("2d");
c.imageSmoothingEnabled = false;
var collisionRadius = 16;
var borderThickness = collisionRadius/5
var alienSpeed = 3
var shipSize = 30
var score = 0;
var alienInterval; 
var abilityRequirement = 10;
var abilityShotDown = 0;
var abilityActivated = false;
var abilityTimeLeft = -1;

var powerupActivated = false;
var powerupTimeLeft = -1;

var blackHoleX = window.innerWidth / 2;
var blackHoleY = window.innerHeight * (0.35);

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
    listOfAliens = []; //clear
    let target = listOfWaves[sector-1][id-1];
    cleared = 0;
    clearedByShip = 0;
    initWave(target.command, target.length, target.pattern, parseFloat(target.coords.split(",")[0]), parseFloat(target.coords.split(",")[1]), target.double, false, acceleration)
    alienInterval = setInterval(initAlien, Math.round(250/waveInfo.speedIncrease))
}

let multiplier = 1;
let waveNumber = 2;
let waveInitialized = false;
initWaveID(1, 1, 1)
function frame(){
    c.clearRect(0, 0, canvas.width, canvas.height);
    cloneAliens()
    updateAlienCoords()
    //console.log(listOfAliens)
    drawShip(xPos, yPos-5)
    if(Date.now() - start > shotInfo.fireIncrement){

        /*for(let i = 1; i < 18; i++){
            shots.push({x: xPos, y: yPos-10, shotAngleX: 90-((i-9)*7), type: shotInfo.type, hitboxLeft: shotInfo.hitboxLeft, hitboxRight: shotInfo.hitboxRight, hitboxTop: shotInfo.hitboxTop, hitboxBottom: shotInfo.hitboxBottom, exploding: false, alpha: 1.0, fireSpeed: shotInfo.fireSpeed})
        }*/

        shots.push({x: xPos, y: yPos-10, shotAngleX: 90, type: shotInfo.type, hitboxLeft: shotInfo.hitboxLeft, hitboxRight: shotInfo.hitboxRight, hitboxTop: shotInfo.hitboxTop, hitboxBottom: shotInfo.hitboxBottom, exploding: false, alpha: 1.0, fireSpeed: shotInfo.fireSpeed})
        
        start = Date.now()
        //console.log(shotInfo);
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
    renderAbilityBar();
    renderPowerupBar();
    drawMiscEffects();
    updateMiscEffects();

    multiplier += 0.0001;

    //render black hole, if needed
    if(blackHoleRadius > 0){
        c.beginPath();
        c.save();
        
        c.arc(blackHoleX, blackHoleY, blackHoleRadius*(3/4), 0, Math.PI*2)
        c.globalAlpha = 0.5;
        const gradient = c.createRadialGradient(blackHoleX, blackHoleY, 0, blackHoleX, blackHoleY, blackHoleRadius*(3/4));
        gradient.addColorStop(0, "lightgreen");
        gradient.addColorStop(1, "black");
        c.fillStyle = gradient;
        //c.fillStyle = "#6ecfe0";
        c.fill();
        c.closePath();
        c.restore();
    }
    
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

    //console.log(filter());
}

function filter(){
    let arr = [];
    listOfAliens.forEach(e => {
        if(e != null && e.escaped){
            arr.push(e);
        }
    })
    return arr;
}

function renderAbilityBar(){
    c.beginPath();
    //default value of 1280x600: 256x18
    c.rect(window.innerWidth*(0.05), window.innerHeight*(0.05), window.innerWidth*(0.15), window.innerHeight*(0.03));
    c.strokeStyle = "lightblue"
    c.lineWidth = 3;
    c.stroke()
    c.closePath()

    
    //create progress bar
    c.beginPath();
    if(!abilityActivated){
        c.rect(window.innerWidth*(0.05), window.innerHeight*(0.05), window.innerWidth*(0.15*(abilityShotDown/abilityRequirement)), window.innerHeight*(0.03))
    }else{
        c.rect(window.innerWidth*(0.05), window.innerHeight*(0.05), window.innerWidth*(0.15*(abilityTimeLeft/1000)), window.innerHeight*(0.03))
        abilityTimeLeft--;

        if(abilityTimeLeft < 0){
            //restore defaults
            shotInfo.hitboxLeft = 3;
            shotInfo.hitboxRight = 3;
            shotInfo.hitboxTop = 20;
            shotInfo.hitboxBottom = 20;
            shotInfo.fireSpeed = 15;
            shotInfo.type = "normal";
            shotInfo.fireIncrement = 225;
            abilityActivated = false; 

            if(blackHoleRadius > 0){
                
                const colors = ["lightgreen", "#4bf542", "#17ba0f", "#278f22", "#71bd6d", "#a3ed9f", "gray", "white"];
                let subDeathParticles = []
                
                //create fancy explosion after blackhole explodes
                let radius = 5
                let numParticles = Math.floor(Math.random()*blackHoleTotals*2)+20 

                for (let k = 0; k < numParticles; k++){
                    subDeathParticles.push({
                        x: blackHoleX+(radius*Math.cos(k*((Math.PI*2)/numParticles))),
                        y: blackHoleY+(radius*Math.sin(k*((Math.PI*2)/numParticles))),
                        variationX: (Math.random()*8)-4,
                        variationY: (Math.random()*8)-4,
                        angle: k*((Math.PI*2)/numParticles),
                        size: Math.floor(Math.random()*10)+1,
                        initGravity: 2.75,
                        particleColor: colors[Math.floor(Math.random()*colors.length)],
                        loop: 0,
                        life: 250,
                    })
                }

                deathParticles.push(subDeathParticles)

                score += Math.round((10*multiplier*blackHoleTotals) / 2)

                textsOnScreen.push({text: "+" + Math.round((10*multiplier*blackHoleTotals) / 2), font: "85px Inconsolata", x: blackHoleX, y: blackHoleY, life: 100, offset: 60, loop: 0})
              
                document.getElementById("scoreDiv").innerHTML = score;
                blackHoleRadius = 0;
                blackHoleTotals = 0;
                clearInterval(blackHoleIterator); //this might cause problems
            }
        }
    }
    
    c.fillStyle = "lightblue"
    c.lineWidth = 3;
    c.fill()
    c.closePath()
}

function renderPowerupBar(){
    c.beginPath();
    //default value of 1280x600: 256x18
    c.rect(window.innerWidth*(0.05), window.innerHeight*(0.1), window.innerWidth*(0.15), window.innerHeight*(0.03));
    c.strokeStyle = "goldenrod"
    c.lineWidth = 3;
    c.stroke()
    c.closePath()
}

function shake(interval, strength, loop){}


document.getElementById("myCanvas").addEventListener("mousemove", updateMousePos)
var interval = setInterval(frame, 10)
