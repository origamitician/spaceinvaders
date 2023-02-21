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

    console.log("Wave info is: " + JSON.stringify(waveInfo))

    if (grid == true){
        waveInfo.grid = true;

        //grid setup

        gridWidth = Math.floor((Math.random()*4)+9); //9, 10, 11, or 12
        
    }
    console.log(JSON.stringify(waveInfo))

    for (let i = 0; i < waveInfo.commandList.length; i++){
        let subcmd = waveInfo.commandList[i]
        for (let j = 0; j < subcmd.length; j++){
            if(isAlpha(subcmd.charAt(j))){
                memoryCommandList.push({subCommand: subcmd, breakpoint: j, breakletter: subcmd.charAt(j)})
                break
            }
        }
    }
    console.log("Old: " + JSON.stringify(memoryCommandList))
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

    console.log("New: " + JSON.stringify(memoryCommandList))

    
}

function initAlien(){
    if ((!waveInfo.double && waveInfo.currentID < waveInfo.wavelength) || (waveInfo.double && waveInfo.currentID < waveInfo.wavelength*2)){
        listOfAliens.push({
            x: waveInfo.startX, y: waveInfo.startY, 
            angle: 0, outerLoop: 0, innerLoop: 0, wave: "original", 
            type: parseInt(waveInfo.pattern[waveInfo.currentID%waveInfo.pattern.length])-1, 
            alienID: waveInfo.currentID, calculated: false})
        

        if(waveInfo.double){
            console.log("is doubled")
            waveInfo.currentID += 1;
            listOfAliens.push({
                x: window.innerWidth-waveInfo.startX, y: waveInfo.startY, 
                angle: (Math.PI), 
                outerLoop: 0, innerLoop: 0, wave: "reflected", 
                type: parseInt(waveInfo.pattern[waveInfo.currentID%waveInfo.pattern.length])-1, 
                alienID: waveInfo.currentID, calculated: false})
            
        }
        waveInfo.currentID +=1;
    }
    
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
            if(parseInt(Math.random()*1500) == 1){
                cloneProjectile(i);
            }

            detectCollision(i);
        }else{
            if(listOfAliens[i].outerLoop >= waveInfo.commandList.length && waveInfo.grid != true){
                listOfAliens.splice(i, 1)
                cleared ++;
                i--;
            }

            if(waveInfo.grid){
                //calculate angle 
                //console.log(listOfAliens)
                if(!listOfAliens[i].calculated){
                    var goalX = 640-(gridWidth-1)*(collisionRadius*2) + (listOfAliens[i].alienID % gridWidth)*(collisionRadius*4);
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
                    listOfAliens[i].x += (alienSpeed*waveInfo.speedIncrease)*Math.cos(listOfAliens[i].angle)
                    listOfAliens[i].y += (alienSpeed*waveInfo.speedIncrease)*Math.sin(listOfAliens[i].angle)
                    listOfAliens[i].gridLoop++;

                }else if (listOfAliens[i].fixedLifeLoop < listOfAliens[i].fixedLife){
                    listOfAliens[i].x = listOfAliens[i].goalX;
                    listOfAliens[i].y = listOfAliens[i].goalY;
                    listOfAliens[i].angle = Math.PI/2
                    listOfAliens[i].fixedLifeLoop++;
                }else{
                    if(listOfAliens[i].escapeAngleLoop < listOfAliens[i].requiredEscapeAngleLoop){
                        listOfAliens[i].angle += listOfAliens[i].escapeAngle*(Math.PI/180);
                        listOfAliens[i].escapeAngleLoop++;
                    }
                    
                    listOfAliens[i].x += alienSpeed*Math.cos(listOfAliens[i].angle)
                    listOfAliens[i].y += alienSpeed*Math.sin(listOfAliens[i].angle)

                    if(listOfAliens[i].x > window.innerWidth || listOfAliens[i].x < 0 || listOfAliens[i].y > window.innerHeight || listOfAliens[i].height < 0){
                        listOfAliens.splice(i, 1)
                        cleared ++;
                        i--;
                    }
                }

                if(parseInt(Math.random()*1000) == 1){
                    cloneProjectile(i);
                }
                
            }
            detectCollision(i);
        }
        i++;
    }
}

function cloneAliens(){
    for (let i = 0; i < listOfAliens.length; i++){
        cloneAlien(listOfAliens[i].x, listOfAliens[i].y, listOfAliens[i].type, listOfAliens[i].angle)
    }
}

function cloneProjectile(id){
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
    while(j < shots.length){
        try{
            if ((shots[j].x-3 < listOfAliens[id].x+collisionRadius) && 
            (shots[j].x+3 > listOfAliens[id].x-collisionRadius) &&
            (shots[j].y-20 < listOfAliens[id].y+collisionRadius) && 
            (shots[j].y+20 > listOfAliens[id].y-collisionRadius)){
                score += Math.round(10*multiplier)
                document.getElementById("scoreDiv").innerHTML = score;
                let originX = listOfAliens[id].x
                let originY = listOfAliens[id].y
                let alienType = listOfAliens[id].type
                listOfAliens.splice(id, 1)
                //i--;
                cleared++;
                clearedByShip++;
                shots.splice(j, 1)
                j--;
                textsOnScreen.push({text: Math.round(10*multiplier), font: "35px Inconsolata", x: originX, y: originY, life: 30, offset: 20, loop: 0})

                //initiate particles
                let subDeathParticles = []
                let radius = 5
                let numParticles = Math.floor(Math.random()*10)+30
                
                for (let k = 0; k < numParticles; k++){
                    subDeathParticles.push({
                        x: originX+(radius*Math.cos(k*((Math.PI*2)/numParticles))),
                        y: originY+(radius*Math.sin(k*((Math.PI*2)/numParticles))),
                        variationX: (Math.random()*4)-2,
                        variationY: (Math.random()*4)-2,
                        angle: k*((Math.PI*2)/numParticles),
                        size: Math.floor(Math.random()*4)+1,
                        initGravity: 4,
                        particleColor: particleColors[alienType][Math.floor(Math.random()*3)],
                        loop: 0
                    })
                }
                deathParticles.push(subDeathParticles)
            }
        }catch (e){
            //do nothing
        }
        j++;
    }
}