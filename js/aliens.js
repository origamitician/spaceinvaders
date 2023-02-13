var listOfAliens = []
var memoryCommandList = []

let alienImages = [document.getElementsByClassName("alienImg")[0], document.getElementsByClassName("alienImg")[1], document.getElementsByClassName("alienImg")[2]]

var waveInfo = {wavelength: -1, commandList: [], pattern: -1, currentID: -1, startX: -1, startY: -1, initDirection: -1, double: false}

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

function initWave(command, wavelength, pattern, startX, startY, double){
    memoryCommandList = [];
    waveInfo.commandList = command.split('-')
    waveInfo.wavelength = wavelength
    waveInfo.pattern = pattern
    waveInfo.currentID = 0
    waveInfo.startX = startX
    waveInfo.startY = startY
    waveInfo.double = double

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
}

function initAlien(){
    if (waveInfo.currentID < waveInfo.wavelength){
        listOfAliens.push({x: waveInfo.startX, y: waveInfo.startY, angle: 0, outerLoop: 0, innerLoop: 0, wave: "original", type: parseInt(waveInfo.pattern[waveInfo.currentID%waveInfo.pattern.length])-1})
        

        if(waveInfo.double){
            console.log("doubling")
            listOfAliens.push({x: window.innerWidth-waveInfo.startX, y: waveInfo.startY, angle: (Math.PI), outerLoop: 0, innerLoop: 0, wave: "reflected", type: parseInt(waveInfo.pattern[waveInfo.currentID%waveInfo.pattern.length])-1})
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
                    listOfAliens[i].x += alienSpeed*Math.cos(listOfAliens[i].angle)
                    listOfAliens[i].y += alienSpeed*Math.sin(listOfAliens[i].angle)
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

            //clone projectile
            if(parseInt(Math.random()*1500) == 1){
                let projectileAngle;
                if(listOfAliens[i].x>xPos){
                    projectileAngle = Math.PI + Math.atan((yPos+15-listOfAliens[i].y)/(xPos-listOfAliens[i].x))
                }else{
                    projectileAngle = Math.atan((yPos+15-listOfAliens[i].y)/(xPos-listOfAliens[i].x))
                }
                
                projectiles.push({x: listOfAliens[i].x, y: listOfAliens[i].y, angle: projectileAngle})
            }

            //detect collision
            let j = 0;
            while(j < shots.length){
                try{
                    if ((shots[j].x-3 < listOfAliens[i].x+collisionRadius) && 
                    (shots[j].x+3 > listOfAliens[i].x-collisionRadius) &&
                    (shots[j].y-20 < listOfAliens[i].y+collisionRadius) && 
                    (shots[j].y+20 > listOfAliens[i].y-collisionRadius)){
                        score += Math.round(10*multiplier)
                        document.getElementById("scoreDiv").innerHTML = score;
                        let originX = listOfAliens[i].x
                        let originY = listOfAliens[i].y
                        let alienType = listOfAliens[i].type
                        listOfAliens.splice(i, 1)
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
        }else{
            if(listOfAliens[i].outerLoop >= waveInfo.commandList.length){
                listOfAliens.splice(i, 1)
                cleared ++;
                i--;
            }
        }
        i++;
        
    }
}

function cloneAliens(){
    for (let i = 0; i < listOfAliens.length; i++){
        cloneAlien(listOfAliens[i].x, listOfAliens[i].y, listOfAliens[i].type, listOfAliens[i].angle)
    }
}