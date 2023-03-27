var shots = []

var shotInfo = {
    hitboxLeft: 3,
    hitboxRight: 3,
    hitboxTop: 20,
    hitboxBottom: 20,
    fireSpeed: 15,
    type: "normal",
    fireIncrement: 200, //200 ms per shot
} //this variable does not change and is a reference to default shot properties


function cloneShots(){
    let i = 0;
    while (i<shots.length){
        c.globalAlpha = shots[i].alpha;
        if(shots[i].type != "pierce"){
            //typical rectangular shot
            c.beginPath()
            c.save()
            c.rect(shots[i].x-shots[i].hitboxLeft, shots[i].y-shots[i].hitboxTop, shots[i].hitboxLeft+shots[i].hitboxRight, shots[i].hitboxTop+shots[i].hitboxBottom)

            if(shots[i].alpha >= 0.99){
                c.fillStyle = "lightblue"
            }else{
                const gradient = c.createRadialGradient(shots[i].x, shots[i].y, 0, shots[i].x, shots[i].y, shots[i].hitboxLeft);
                gradient.addColorStop(0, "white");
                gradient.addColorStop(1, "lightblue");
                c.fillStyle = gradient;
            }
            
            
        }else{
            //draw arrow shot (piercing)
            c.beginPath();     
            c.lineWidth = "3";
            c.strokeStyle = "lightgreen"
            const gradient = c.createLinearGradient(shots[i].x, shots[i].y+shots[i].hitboxBottom, shots[i].x, shots[i].y-shots[i].hitboxTop);
            gradient.addColorStop(0, "white");
            gradient.addColorStop(1, "lightgreen");
            c.fillStyle = "lightgreen"
            c.moveTo(shots[i].x, shots[i].y+shots[i].hitboxBottom)
            
            c.lineTo(shots[i].x+shots[i].hitboxRight, shots[i].y-shots[i].hitboxTop+(shots[i].hitboxRight*2));
            c.lineTo(shots[i].x, shots[i].y-shots[i].hitboxTop);
            c.lineTo(shots[i].x-shots[i].hitboxLeft, shots[i].y-shots[i].hitboxTop+(shots[i].hitboxRight*2))
            c.lineTo(shots[i].x, shots[i].y+shots[i].hitboxBottom);
            c.stroke();
            c.closePath();
        }
        
        c.fill()
        c.restore();
        c.closePath()
        i++
    }
}

function updateShotCoords(){
    let i = 0;
    while (i < shots.length){
        if(!shots[i].exploding){
            
            shots[i].y -= shots[i].fireSpeed
            

            if (shots[i].y <= 0){
                shots.splice(i, 1)
                i--
            }
           
        }else{
            //console.log("shots are exploding");
            if(shots[i].explosionLoop < shots[i].explosionRequiredLoop){
                
                shots[i].hitboxLeft = 5+shots[i].explosionLoop;
                shots[i].hitboxRight = 5+shots[i].explosionLoop;
                shots[i].hitboxTop = 5+shots[i].explosionLoop;
                shots[i].hitboxBottom = 5+shots[i].explosionLoop;
                shots[i].explosionLoop+=1;
                
                if(shots[i].alpha > 1/shots[i].explosionRequiredLoop){
                    shots[i].alpha -= 1/shots[i].explosionRequiredLoop;
                }
            }else{
                shots.splice(i, 1)
                i--;
            }
        }
        i++
    }
}

