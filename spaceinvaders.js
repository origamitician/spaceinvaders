const canvas = document.getElementById("myCanvas");
const c = canvas.getContext("2d");
c.imageSmoothingEnabled = false;
collisionRadius = 15;
borderThickness = collisionRadius/5
alienSpeed = 3
shipSize = 35

canvas.setAttribute('height', window.innerHeight + "px");
canvas.setAttribute('width', window.innerWidth + "px");

var listOfAliens = []
var memoryCommandList = []
var shots = []
var deathParticles = []
var xPos = -1
var yPos = -1
var waveInfo = {wavelength: -1, commandList: [], pattern: -1, currentID: -1, startX: -1, startY: -1, initDirection: -1}

//sounds
var shotSound = new Audio("./sounds/laser.wav")


function cloneAlien(startX, startY, type, angle){
    //console.log(type + angle)
    //console.log(startX + startY)
 
    c.save()
    c.beginPath()
    c.translate(startX, startY)
    c.rotate(angle)
    //c.rect(startX-collisionRadius, startY-collisionRadius, collisionRadius*2, collisionRadius*2)
    c.rect(0-collisionRadius, 0-collisionRadius, collisionRadius*2, collisionRadius*2)
    c.fillStyle = "gray";
    c.fill();
    c.closePath();

    c.beginPath()
    c.rect(0-collisionRadius+borderThickness, 0-collisionRadius+borderThickness, (collisionRadius*2)-(borderThickness*2), (collisionRadius*2)-(borderThickness*2))
    c.fillStyle = "#00ff08";
    c.fill()
    c.closePath()

    c.lineWidth = borderThickness+2
    c.beginPath()
    c.moveTo(0-borderThickness, 0-collisionRadius+borderThickness)
    //c.lineTo(startX+(Math.sqrt(3)-1.5)*collisionRadius+borderThickness, startY)
    c.lineTo(0+collisionRadius-borderThickness, 0)
    c.lineTo(0-borderThickness, 0+collisionRadius-borderThickness)
    c.lineTo(0-borderThickness, 0-collisionRadius+borderThickness)
    c.strokeStyle = "gray"
    c.stroke()
    c.fillStyle = "red"
    c.fill()

    c.restore()
}

function initWave(command, wavelength, pattern, startX, startY, initDirection){
    waveInfo.commandList = command.split('-')
    waveInfo.wavelength = wavelength
    waveInfo.pattern = pattern
    waveInfo.currentID = 0
    waveInfo.startX = startX
    waveInfo.startY = startY
    waveInfo.initDirection = initDirection
    for (let i = 0; i < waveInfo.commandList.length; i++){
        let subcmd = waveInfo.commandList[i]
        for (let j = 0; j < subcmd.length; j++){
            if(isAlpha(subcmd.charAt(j))){
                memoryCommandList.push({subCommand: subcmd, breakpoint: j, breakletter: subcmd.charAt(j)})
                break
            }
        }
    }
}

function initAlien(){
    if (waveInfo.currentID < waveInfo.wavelength){
        listOfAliens.push({x: waveInfo.startX, y: waveInfo.startY, angle: waveInfo.initDirection, outerLoop: 0, innerLoop: 0, /*species: pattern.charAt(i%pattern.length),*/ wave: "original"})
        waveInfo.currentID +=1;
    }
}

function cloneShots(){
    let i = 0;
    while (i<shots.length){
        c.beginPath()
        c.rect(shots[i].x-3, shots[i].y-30, 6, 40)
        c.fillStyle = "lightblue"
        c.fill()
        c.closePath()
        i++
    }
    
}

function initShot(x, y, type){
    shots.push({x: x, y: y, type: type})
}

function updateShotCoords(){
    let i = 0;
    while (i < shots.length){
        if (shots[i].type == "normal"){
            shots[i].y -=7
        }else if (shots[i].type == "fast"){
            shots[i].y -= 15
        }

        if (shots[i].y <= 0){
            shots.splice(i, 1)
            i--
        }
        i++
    }
}

function drawShip(x, y){
    const img = new Image()
    img.src = "./aliens/ship1.png"
    c.drawImage(img, x-shipSize, y-shipSize, shipSize*2, shipSize*2)
}

function isAlpha(ch){
    return /^[A-Z]$/i.test(ch);
}

function updateAlienCoords(){
    let i = 0;
    while (i < listOfAliens.length){
        let outerLoopLocation = memoryCommandList[listOfAliens[i].outerLoop]
        let angle;
        if(listOfAliens[i].outerLoop < waveInfo.commandList.length){
            if(outerLoopLocation.breakletter == "R"){
                if(listOfAliens[i].innerLoop < parseInt(outerLoopLocation.subCommand.substring(0, outerLoopLocation.breakpoint))){
                    angle = parseFloat(outerLoopLocation.subCommand.substring(outerLoopLocation.breakpoint+1))
                    listOfAliens[i].angle += (angle/360)*(2*Math.PI)
                    listOfAliens[i].innerLoop += 1;
                    listOfAliens[i].x += alienSpeed*Math.cos(listOfAliens[i].angle)
                    listOfAliens[i].y += alienSpeed*Math.sin(listOfAliens[i].angle)
                }else{
                    listOfAliens[i].innerLoop = 0;
                    listOfAliens[i].outerLoop += 1;
                }
    
            }else if (outerLoopLocation.breakletter == "L"){
                if(listOfAliens[i].innerLoop < parseInt(outerLoopLocation.subCommand.substring(0, outerLoopLocation.breakpoint))){
                    angle = parseFloat(outerLoopLocation.subCommand.substring(outerLoopLocation.breakpoint+1))
                    listOfAliens[i].angle -= (angle/360)*(2*Math.PI)
                    listOfAliens[i].innerLoop += 1;
                    
                    listOfAliens[i].x += alienSpeed*Math.cos(listOfAliens[i].angle)
                    listOfAliens[i].y += alienSpeed*Math.sin(listOfAliens[i].angle)
                }else{
                    listOfAliens[i].innerLoop = 0;
                    listOfAliens[i].outerLoop += 1;
                }
    
            }else{
                if(listOfAliens[i].innerLoop < parseInt(outerLoopLocation.subCommand.substring(0, outerLoopLocation.breakpoint))){
                    listOfAliens[i].innerLoop += 1;
                    listOfAliens[i].x += 3*Math.cos(listOfAliens[i].angle)
                    listOfAliens[i].y += 3*Math.sin(listOfAliens[i].angle)
                }else{
                    listOfAliens[i].innerLoop = 0;
                    listOfAliens[i].outerLoop += 1;
                }
            }

            //detect collision
            for (let j = 0; j < shots.length; j++){
                if ((shots[j].x-3 < listOfAliens[i].x+collisionRadius) && 
                (shots[j].x+3> listOfAliens[i].x-collisionRadius) &&
                (shots[j].y-20 < listOfAliens[i].y+collisionRadius) && 
                (shots[j].y+20 > listOfAliens[i].y-collisionRadius)){
                    let originX = listOfAliens[i].x
                    let originY = listOfAliens[i].y
                    listOfAliens.splice(i, 1)
                    i--;
                    shots.splice(j, 1)
                    j++;

                    //initiate particles
                    let subDeathParticles = []
                    let radius = 5
                    let numParticles = Math.floor(Math.random()*10)+5
                    let particleColors = ["gray", "#00ff08", "red"]
                    for (let k = 0; k < numParticles; k++){
                        subDeathParticles.push({
                            x: originX+(radius*Math.cos(k*((Math.PI*2)/numParticles))),
                            y: originY+(radius*Math.sin(k*((Math.PI*2)/numParticles))),
                            variationX: (Math.random())-0.5,
                            variationY: (Math.random()*1)-1,
                            angle: k*((Math.PI*2)/numParticles),
                            size: Math.floor(Math.random()*4)+1,
                            initGravity: 3,
                            particleColor: particleColors[Math.floor(Math.random()*3)],
                            loop: 0
                        })
                    }
                    deathParticles.push(subDeathParticles)
                }
            }
        }else{
            if(listOfAliens[i].outerLoop >= waveInfo.commandList.length){
                listOfAliens.splice(i, 1)
            }
        }
        i++;
    }
}

function cloneAliens(){
    for (let i = 0; i < listOfAliens.length; i++){
        cloneAlien(listOfAliens[i].x, listOfAliens[i].y, 1, listOfAliens[i].angle)
    }
}

/*function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }*/
  
function updateDeathParticles(){
    let i = 0;
    let j = 0;
    while (i < deathParticles.length){
        j = 0;
        while (j < deathParticles[i].length){
            if(deathParticles[i][j].y < 625){
                deathParticles[i][j].x += Math.cos(deathParticles[i][j].angle)*0.5 + deathParticles[i][j].variationX
                deathParticles[i][j].y -= Math.sin(deathParticles[i][j].angle)*0.5 + deathParticles[i][j].initGravity + deathParticles[i][j].variationY 
                deathParticles[i][j].initGravity -= 0.1
                deathParticles[i][j].loop++;
                j++
            }else{
                deathParticles[i].splice(j, 1)
            }
        }
        if(deathParticles[i].length == 0){
            deathParticles.splice(i, 1)
            i--;
        }
        i++;
    }
}

let size;
function drawDeathParticles(){
    for(let i = 0; i < deathParticles.length; i++){
        for(let j = 0; j < deathParticles[i].length; j++){
            size = deathParticles[i][j].size
            c.beginPath()
            c.rect(deathParticles[i][j].x-size, deathParticles[i][j].y-size, size*2, size*2)
            c.fillStyle = deathParticles[i][j].particleColor;
            c.fill()
            c.closePath()
        }
    }
}

initWave("120F6-45L2-35R3-120F6-180L1.5-100F6-20R7-100F6-45L2-150F6", 45, "1254", 0, 300, 0)

let start = Date.now();


function frame(event){
    c.clearRect(0, 0, canvas.width, canvas.height);
    cloneAliens()
    updateAlienCoords()
    //console.log(listOfAliens)
    drawShip(xPos, yPos-5)
    if(Date.now() - start > 120){
        initShot(xPos, yPos-10, "fast")
        start = Date.now()
    }
    updateShotCoords()
    cloneShots()
    updateDeathParticles()
    drawDeathParticles()
}

function updateMousePos(event){
    let rect = canvas.getBoundingClientRect();
    xPos = event.clientX - rect.left;
    yPos = event.clientY - rect.top;
}

document.getElementById("myCanvas").addEventListener("mousemove", updateMousePos)
var interval = setInterval(frame, 10)
var alienInterval = setInterval(initAlien, 250)



