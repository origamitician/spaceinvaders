var shots = []

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
            shots[i].y -=10
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

