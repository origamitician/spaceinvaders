var listOfAliens = []
var memoryCommandList = []
var gridWidth;

let alienImages = [document.getElementsByClassName("alienImg")[0], document.getElementsByClassName("alienImg")[1], document.getElementsByClassName("alienImg")[2]]

var waveInfo = {wavelength: -1, commandList: [], pattern: -1, currentID: -1, startX: -1, startY: -1, initDirection: -1, double: false, grid: false}

function isAlpha(ch){
    return /^[A-Z]$/i.test(ch);
}

function cloneAlien(startX, startY, type, angle){
    c.save()
    c.beginPath()
    c.translate(startX, startY)
    c.rotate(angle)
    c.drawImage(alienImages[parseInt(type)], 0-collisionRadius, 0-collisionRadius, collisionRadius*2, collisionRadius*2)
    c.closePath()
    c.restore()
    
    /*hitbox*/
    c.beginPath()
    c.strokeStyle = "#ffc7c7";
    c.lineWidth = 1;
    c.rect(startX-collisionRadius, startY-collisionRadius, collisionRadius*2, collisionRadius*2);

    c.stroke();
    c.closePath();
    
}

function initWave(command, wavelength, pattern, startX, startY, double, grid, speedIncrease){
    memoryCommandList = [];
    waveInfo.commandList = command.split('-')
    waveInfo.wavelength = wavelength
    waveInfo.pattern = pattern
    waveInfo.currentID = 0
    waveInfo.startX = startX
    waveInfo.startY = startY
    waveInfo.double = double
    waveInfo.speedIncrease = parseFloat(speedIncrease);

    //console.log("Wave info is: " + JSON.stringify(waveInfo))

    if (grid == true){
        waveInfo.grid = true;

        //grid setup

        gridWidth = Math.floor((Math.random()*4)+9); //9, 10, 11, or 12
        
    }
    //console.log(JSON.stringify(waveInfo))

    for (let i = 0; i < waveInfo.commandList.length; i++){
        let subcmd = waveInfo.commandList[i]
        for (let j = 0; j < subcmd.length; j++){
            if(isAlpha(subcmd.charAt(j))){
                memoryCommandList.push({subCommand: subcmd, breakpoint: j, breakletter: subcmd.charAt(j)})
                break
            }
        }
    }
    //console.log("Old: " + JSON.stringify(memoryCommandList))
    //edit CommandList from acceleration
    memoryCommandList.forEach(c => {
        
        let total;
        let newSpeed;
        let newLoop;

        total = parseInt(c.subCommand.substring(0, c.breakpoint))*parseFloat(c.subCommand.substring(c.breakpoint+1))
        newSpeed = parseFloat(c.subCommand.substring(c.breakpoint+1))*speedIncrease
        newLoop = Math.ceil(total / newSpeed);

        c.breakpoint = newLoop.toString().length; 
        c.subCommand = newLoop + c.breakletter + newSpeed
        
    })

    //console.log("New: " + JSON.stringify(memoryCommandList))

    
}

function initAlien(){
    if ((!waveInfo.double && waveInfo.currentID < waveInfo.wavelength) || (waveInfo.double && waveInfo.currentID < waveInfo.wavelength*2)){
        listOfAliens.push({
            x: waveInfo.startX, y: waveInfo.startY, 
            angle: 0, outerLoop: 0, innerLoop: 0, wave: "original", 
            type: parseInt(waveInfo.pattern[waveInfo.currentID%waveInfo.pattern.length])-1, 
            alienID: waveInfo.currentID, escaped: false})
        

        if(waveInfo.double){
            //console.log("is doubled")
            waveInfo.currentID += 1;
            listOfAliens.push({
                x: window.innerWidth-waveInfo.startX, y: waveInfo.startY, 
                angle: (Math.PI), 
                outerLoop: 0, innerLoop: 0, wave: "reflected", 
                type: parseInt(waveInfo.pattern[waveInfo.currentID%waveInfo.pattern.length])-1, 
                alienID: waveInfo.currentID, escaped: false})
            
        }
        waveInfo.currentID +=1;
    }
    
}

function updateAlienCoords(){
    let i = 0;
    while (i < listOfAliens.length){
        if(listOfAliens[i] == null){
            i++;
        }else{
            let outerLoopLocation = memoryCommandList[listOfAliens[i].outerLoop]
            let angle;
            //console.log(i);
            if(listOfAliens[i].outerLoop < waveInfo.commandList.length && !listOfAliens[i].escaped){
                if(outerLoopLocation.breakletter == "R" ){
                    if(listOfAliens[i].innerLoop < parseInt(outerLoopLocation.subCommand.substring(0, outerLoopLocation.breakpoint))){
                        angle = parseFloat(outerLoopLocation.subCommand.substring(outerLoopLocation.breakpoint+1))
                        if(listOfAliens[i].wave == "reflected"){
                            listOfAliens[i].angle -= (angle/360)*(2*Math.PI)
                        }else{
                            listOfAliens[i].angle += (angle/360)*(2*Math.PI)
                        }
                        listOfAliens[i].innerLoop += 1;
                        listOfAliens[i].x += alienSpeed*waveInfo.speedIncrease*Math.cos(listOfAliens[i].angle)
                        listOfAliens[i].y += alienSpeed*waveInfo.speedIncrease*Math.sin(listOfAliens[i].angle)
                    }else{
                        listOfAliens[i].innerLoop = 0;
                        listOfAliens[i].outerLoop += 1;
                    }
        
                }else if (outerLoopLocation.breakletter == "L"){
                    if(listOfAliens[i].innerLoop < parseInt(outerLoopLocation.subCommand.substring(0, outerLoopLocation.breakpoint))){
                        angle = parseFloat(outerLoopLocation.subCommand.substring(outerLoopLocation.breakpoint+1))
                        if(listOfAliens[i].wave == "reflected"){
                            listOfAliens[i].angle += (angle/360)*(2*Math.PI)
                        }else{
                            listOfAliens[i].angle -= (angle/360)*(2*Math.PI)
                        }
                        
                        listOfAliens[i].innerLoop += 1;
                        
                        listOfAliens[i].x += alienSpeed*waveInfo.speedIncrease*Math.cos(listOfAliens[i].angle)
                        listOfAliens[i].y += alienSpeed*waveInfo.speedIncrease*Math.sin(listOfAliens[i].angle)
                    }else{
                        listOfAliens[i].innerLoop = 0;
                        listOfAliens[i].outerLoop += 1;
                    }
        
                }else{
                    let speed = parseFloat(outerLoopLocation.subCommand.substring(outerLoopLocation.breakpoint+1))
                    if(listOfAliens[i].innerLoop < parseInt(outerLoopLocation.subCommand.substring(0, outerLoopLocation.breakpoint))){
                        listOfAliens[i].innerLoop += 1;
                        listOfAliens[i].x += speed*Math.cos(listOfAliens[i].angle)
                        listOfAliens[i].y += speed*Math.sin(listOfAliens[i].angle)
                    }else{
                        listOfAliens[i].innerLoop = 0;
                        listOfAliens[i].outerLoop += 1;
                    }
                }
                //clone projectile
                
                
            }else{
                if(listOfAliens[i].outerLoop >= waveInfo.commandList.length && waveInfo.grid != true){
                    listOfAliens[i] = null;
                    cleared ++;
                    
                }

                if(waveInfo.grid){
                    //calculate angle 
                    //console.log(listOfAliens)
                    if(!listOfAliens[i].escaped){
                        var goalX = (window.innerWidth/2)-(gridWidth-1)*(collisionRadius*2) + (listOfAliens[i].alienID % gridWidth)*(collisionRadius*4);
                        var goalY = 50 + Math.floor(listOfAliens[i].alienID / gridWidth)*(collisionRadius*4)
                        
                        if(listOfAliens[i].x > goalX){
                            listOfAliens[i].angle = Math.PI+Math.atan((goalY-listOfAliens[i].y)/(goalX-listOfAliens[i].x))
                        }else{
                            listOfAliens[i].angle = Math.atan((goalY-listOfAliens[i].y)/(goalX-listOfAliens[i].x))
                        }
                        
                        listOfAliens[i].goalX = goalX;
                        listOfAliens[i].goalY = goalY;

                        let distance = Math.sqrt(Math.pow(goalX-listOfAliens[i].x, 2)+Math.pow(goalY-listOfAliens[i].y, 2))
                        listOfAliens[i].gridLoop = 1;
                        listOfAliens[i].requiredGridLoop = Math.ceil(distance/(alienSpeed*waveInfo.speedIncrease)) 

                        listOfAliens[i].calculated = true;

                        //set escape loop
                        listOfAliens[i].fixedLife = (Math.floor(Math.random()*33)+28)*25; //7 to 15 seconds
                        listOfAliens[i].fixedLifeLoop = 0;

                        //determine if its going to head directly towards ship, or circle and leave
                        //if (Math.floor(Math.random()*2) == 0){
                            listOfAliens[i].escapeAngle = (Math.floor(Math.random()*17)-8)*0.25;
                            listOfAliens[i].requiredEscapeAngleLoop = Math.floor(Math.random()*100)+25;
                            listOfAliens[i].escapeAngleLoop = 0;
                        /*}else{

                        }*/
                    }

                    if(listOfAliens[i].gridLoop < listOfAliens[i].requiredGridLoop){
                        //on the way to assemble in grid
                        listOfAliens[i].x += (alienSpeed*waveInfo.speedIncrease)*Math.cos(listOfAliens[i].angle)
                        listOfAliens[i].y += (alienSpeed*waveInfo.speedIncrease)*Math.sin(listOfAliens[i].angle)
                        listOfAliens[i].gridLoop++;

                    }else if (listOfAliens[i].fixedLifeLoop < listOfAliens[i].fixedLife){
                        //counting down until grid disbands
                        listOfAliens[i].x = listOfAliens[i].goalX;
                        listOfAliens[i].y = listOfAliens[i].goalY;
                        listOfAliens[i].angle = Math.PI/2
                        listOfAliens[i].fixedLifeLoop++;

                    }else{
                        //escape method
                        escape(i)
                    }
                }
            }
            if(parseInt(Math.random()*1500) == 1 && listOfAliens[i] != null){
                cloneProjectile(i);
            }

            if (listOfAliens[i] != null){
                if(listOfAliens[i].escaped || (parseInt(Math.random()*3000) == 1 && !listOfAliens[i].escaped)){
                    escape(i);
                }
            }

            if(listOfAliens[i] != null){
                detectCollision(i);
            }
            i++;
        }
    }
}

function cloneAliens(){
    for (let i = 0; i < listOfAliens.length; i++){
        if(listOfAliens[i] == null){
            
        }else{
            cloneAlien(listOfAliens[i].x, listOfAliens[i].y, listOfAliens[i].type, listOfAliens[i].angle)
        }
        
    }
    //console.log(listOfAliens)
}

function escape(id){
    if(!listOfAliens[id].escaped){

        listOfAliens[id].escapeAngleLoop = 0;
        listOfAliens[id].escaped = true;

        if(listOfAliens[id].type == 777){
            //escape method for boss galagas; escape method 3 - circle towards ship and do a 360 to hit ship one more time, and leave
            listOfAliens[id].escapeMethod = 3

        }else{
            let rand = Math.floor(Math.random()*2)+1

            if(rand == 1){
                //stuff needed for escape method 1; randomly spin and leave
                listOfAliens[id].escapeMethod = 1
                listOfAliens[id].requiredEscapeAngleLoop = Math.floor(Math.random()*125)+10;
                listOfAliens[id].escapeAngleIncrement = (Math.floor(Math.random()*17)-8)*0.25

            }else{
                //stuff needed for escape method 2; circle towards ship and leave
                listOfAliens[id].escapeMethod = 2

                listOfAliens[id].distance = Math.PI*(Math.sqrt(Math.pow(listOfAliens[id].x - xPos, 2) + Math.pow(listOfAliens[id].y - yPos, 2)) / 2) //arc length

                if(listOfAliens[id].x>xPos){
                    listOfAliens[id].angle = Math.PI + Math.atan((yPos+15-listOfAliens[id].y)/(xPos-listOfAliens[id].x)) - (Math.PI/2);

                }else{
                    listOfAliens[id].angle = projectileAngle = Math.atan((yPos+15-listOfAliens[id].y)/(xPos-listOfAliens[id].x)) - (Math.PI/2);

                }
                listOfAliens[id].requiredEscapeAngleLoop = Math.ceil(listOfAliens[id].distance /alienSpeed)*1.5;
                listOfAliens[id].escapeAngleIncrement = Math.PI/(listOfAliens[id].distance /alienSpeed);               
            }
        } 
    }

    //actual script to run
    if(listOfAliens[id].escapeAngleLoop < listOfAliens[id].requiredEscapeAngleLoop){
        //rotate
        listOfAliens[id].angle += listOfAliens[id].escapeAngleIncrement
        listOfAliens[id].escapeAngleLoop++;

    }else{
        //go straight until hit edges
        if(listOfAliens[id].x > window.innerWidth || listOfAliens[id].x < 0 || listOfAliens[id].y > window.innerHeight || listOfAliens[id].y < 0 ){
            listOfAliens[id] = null;
            cleared++;
        }
    } 

    if(listOfAliens[id] != null){
        listOfAliens[id].x += alienSpeed*Math.cos(listOfAliens[id].angle)
        listOfAliens[id].y += alienSpeed*Math.sin(listOfAliens[id].angle)
    }
}

function cloneProjectile(id){
    console.log("projectile cloning");
    let projectileAngle;
    if(listOfAliens[id].x>xPos){
        projectileAngle = Math.PI + Math.atan((yPos+15-listOfAliens[id].y)/(xPos-listOfAliens[id].x))
    }else{
        projectileAngle = Math.atan((yPos+15-listOfAliens[id].y)/(xPos-listOfAliens[id].x))
    }
    projectiles.push({x: listOfAliens[id].x, y: listOfAliens[id].y, angle: projectileAngle})
}

function detectCollision(id){
    //detect collision
    let j = 0;
    var originX = 0;
    var originY = 0;
    var variationY = 4
    while(j < shots.length){
    try{
      
        if ((shots[j].x-shots[j].hitboxLeft < listOfAliens[id].x+collisionRadius) && 
        (shots[j].x+shots[j].hitboxRight > listOfAliens[id].x-collisionRadius) &&
        (shots[j].y-shots[j].hitboxBottom < listOfAliens[id].y+collisionRadius) && 
        (shots[j].y+shots[j].hitboxTop > listOfAliens[id].y-collisionRadius)){
            score += Math.round(10*multiplier)
            document.getElementById("scoreDiv").innerHTML = score;
            originX = listOfAliens[id].x
            originY = listOfAliens[id].y
            let alienType = listOfAliens[id].type
            listOfAliens[id] = null;
            //i--;
            cleared++;
            clearedByShip++;
            if(!abilityActivated){
                abilityShotDown++;
            }
            
            if(abilityShotDown >= abilityRequirement){
                abilityActivated = true;
                pierceShot();
                abilityShotDown = 0;
            }

            if(shots[j].type == "jumbo" && !shots[j].exploding){
                console.log("explosion activated");
                shots[j].y = originY;
                shots[j].exploding = true;
                shots[j].explosionRequiredLoop = 50;
                shots[j].explosionLoop = 0;

            }else if(shots[j].type == "pierce"){
                variationY = 5.5
                var angle1 = Math.floor(Math.random()*61)+15
                miscEffects.push({x: originX, y: originY, loop: 0, life: Math.floor(Math.random()*20)+50, angle: angle1})
                miscEffects.push({x: originX, y: originY, loop: 0, life: Math.floor(Math.random()*20)+50, angle: 0-angle1})
            }else{
                //normal shot
                if(shots[j].type != "jumbo"){
                    shots.splice(j, 1)
                    j--;
                }
            }
            
            textsOnScreen.push({text: Math.round(10*multiplier), font: "35px Inconsolata", x: originX, y: originY, life: 30, offset: 20, loop: 0})

            let subDeathParticles = []
            let radius = 5
            let numParticles = Math.floor(Math.random()*10)+50 

            for (let k = 0; k < numParticles; k++){
                subDeathParticles.push({
                    x: originX+(radius*Math.cos(k*((Math.PI*2)/numParticles))),
                    y: originY+(radius*Math.sin(k*((Math.PI*2)/numParticles))),
                    variationX: (Math.random()*4)-2,
                    variationY: (Math.random()*variationY)-2,
                    angle: k*((Math.PI*2)/numParticles),
                    size: Math.floor(Math.random()*4)+1,
                    initGravity: 4,
                    particleColor: particleColors[alienType][Math.floor(Math.random()*3)],
                    loop: 0
                })
            }
            deathParticles.push(subDeathParticles)
            
        }
        //console.log(originX + ", " + originY)
        
 
    }catch (e){
        //do nothing
    }
    j++;
    }
}

function initDeathParticles(x, y){
    //initiate particles
    
    
}