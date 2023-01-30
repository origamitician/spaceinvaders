let currentSector = 1
let currentSectorDetails = []

fetch("./waves.json")
.then((response) => response.text())
.then((json) => {
    currentSectorDetails = JSON.parse(json)
})

initWave("120F6-120L0.5-50R3-50F6-3R40-120F6-60L1-100F6", 70, "112233", 0, 300, 0, true)

let start = Date.now();


function frame(){
    c.clearRect(0, 0, canvas.width, canvas.height);
    cloneAliens()
    updateAlienCoords()
    //console.log(listOfAliens)
    drawShip(xPos, yPos-5)
    if(Date.now() - start >100){

        initShot(xPos-shipSize, yPos-10, "fast")
        initShot(xPos+shipSize, yPos-10, "fast")
   
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