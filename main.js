let currentSector = 1
let currentSectorDetails = []

fetch("./waves.json")
.then((response) => response.text())
.then((json) => {
    currentSectorDetails = JSON.parse(json)
})

//initWave("120F6-120L0.5-50R3-50F6-3R40-120F6-60L1-100F6", 70, "112233", 0, 300, 0, true)
initWave("120F6-45L2-35R3-120F6-180L1.5-100F6-20R7-100F6-45L2-150F6", 45, "12131", 0, 300, 0, true)
let start = Date.now();


function frame(){
    c.clearRect(0, 0, canvas.width, canvas.height);
    cloneAliens()
    updateAlienCoords()
    //console.log(listOfAliens)
    drawShip(xPos, yPos-5)
    if(Date.now() - start >150){

        initShot(xPos, yPos-10, "normal")
        console.log(projectiles)
   
        start = Date.now()
    }
    updateShotCoords()
    cloneShots()
    updateDeathParticles()
    drawDeathParticles()
    drawProjectiles()
    updateProjectileCoords()

    /*c.font = "50px Arial";
    c.fillStyle = "white";
    c.fillText("Hello World", 5, 50);*/
    
    
}



document.getElementById("myCanvas").addEventListener("mousemove", updateMousePos)
var interval = setInterval(frame, 10)
var alienInterval = setInterval(initAlien, 250)