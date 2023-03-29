var shots = []

var shotInfo = {
    hitboxLeft: 3,
    hitboxRight: 3,
    hitboxTop: 20,
    hitboxBottom: 20,
    fireSpeed: 14,
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

            c.translate(shots[i].x, shots[i].y)
            c.rotate((Math.PI/180)*(90-shots[i].shotAngleX));
            c.rect(0-shots[i].hitboxLeft, 0-shots[i].hitboxTop, shots[i].hitboxLeft+shots[i].hitboxRight, shots[i].hitboxTop+shots[i].hitboxBottom)

           

            if(shots[i].alpha >= 0.99){
                c.fillStyle = "lightblue"
            }else{
                const gradient = c.createRadialGradient(shots[i].x, shots[i].y, 0, shots[i].x, shots[i].y, shots[i].hitboxLeft);
                gradient.addColorStop(0, "white");
                gradient.addColorStop(1, "lightblue");
                c.fillStyle = gradient;
            }

            c.fill()
            c.restore();
            c.closePath()
            
            
        }else{
            //draw arrow shot (piercing)
            c.beginPath();     
            c.lineWidth = "3";
            c.strokeStyle = "lightgreen"
            c.save()

            c.translate(shots[i].x, shots[i].y)
            c.rotate((Math.PI/180)*(90-shots[i].shotAngleX));
            const gradient = c.createLinearGradient(0, shots[i].hitboxBottom, 0, 0-shots[i].hitboxTop);
            gradient.addColorStop(0, "white");
            gradient.addColorStop(1, "lightgreen");
            c.fillStyle = "lightgreen"
            c.moveTo(0, shots[i].hitboxBottom)
            
            c.lineTo(0+shots[i].hitboxRight, 0-shots[i].hitboxTop+(shots[i].hitboxRight*2));
            c.lineTo(0, 0-shots[i].hitboxTop);
            c.lineTo(0-shots[i].hitboxLeft, 0-shots[i].hitboxTop+(shots[i].hitboxRight*2))
            c.lineTo(0, 0+shots[i].hitboxBottom);
            c.stroke();
            c.restore();
            c.closePath();
        }

        //just for hitboxes' sake

        c.beginPath();
        c.rect(shots[i].x-shots[i].hitboxLeft, shots[i].y-shots[i].hitboxTop, shots[i].hitboxLeft*2, shots[i].hitboxTop*2)
        c.lineWidth = 1;
        c.strokeStyle = "red";
        c.stroke();
        c.closePath();
        i++
    }
}

function updateShotCoords(){
    let i = 0;
    while (i < shots.length){
        if(!shots[i].exploding){
            
            shots[i].y -= (Math.sin((Math.PI/180)*(shots[i].shotAngleX)))*shots[i].fireSpeed
            shots[i].x += (Math.cos((Math.PI/180)*(shots[i].shotAngleX)))*shots[i].fireSpeed
            

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

