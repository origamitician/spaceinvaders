//PROJECTILES
var deathParticles = []
var projectiles = []
var stars = []
let particleColors = [["#46eb34", "#85d166", "grey"], ["#13ede6", "red", "#3c9e9b"], ["orange", "#c4bc27", "#9e873c"]]
let projectileImages = [document.getElementsByClassName("projectile")[0]]

let miscEffects = []
//effects n stuff from piercing shots, etc...

function drawProjectiles(){
    let i = 0;
    while(i < projectiles.length){
        c.save()
        c.beginPath()
        c.translate(projectiles[i].x-3, projectiles[i].y-20)
        c.rotate(projectiles[i].angle + Math.PI)
        c.drawImage(projectileImages[0], 25, 5, 50, 10)
        c.fill()
        c.closePath()
        c.restore()
        i++;
    }
}

function drawMiscEffects(){
    let i = 0;
    while(i < miscEffects.length){
        if(miscEffects[i].type == "pierce"){
            //draw ellipse for piercing shot
            c.save()
       
            c.translate(miscEffects[i].x, miscEffects[i].y)
        
            c.rotate(miscEffects[i].angle*(Math.PI/180))
            c.scale(6, 1)
            c.beginPath()
            c.globalAlpha = 1 - (miscEffects[i].loop / miscEffects[i].life)
            c.arc(0, 0, 2+miscEffects[i].loop/5, 0, Math.PI*2)
            
            c.fillStyle = "lightgreen";
            c.fill();
            c.lineWidth = 1;
            c.strokeStyle = "lightblue";
            c.stroke();
            c.closePath();
            c.restore();
        }else if(miscEffects[i].type == "black_hole"){
            //draw black hole's concentric circles
            c.beginPath();
            c.save();
            c.globalAlpha = 0.8;
            c.arc(miscEffects[i].x, miscEffects[i].y, blackHoleRadius-(blackHoleRadius*(miscEffects[i].loop/miscEffects[i].life)), 0, Math.PI*2)
            c.lineWidth = 6;
            c.strokeStyle = "lightgreen";
            c.stroke();
            c.closePath();
            c.restore();
        }
        
        i++;
    }
}

function updateMiscEffects(){
    //console.log(miscEffects)
    let i = 0;
    while(i < miscEffects.length){
        if(miscEffects[i].loop < miscEffects[i].life){
            miscEffects[i].loop++;
        }else{
            miscEffects.splice(i, 1);
            i--;
        }
        i++;
    }

}

function updateStars(){
    let i = 0;
    while (i < stars.length){
        if (stars[i].y < 625){
            stars[i].y += stars[i].gravity;
            i++;
        }else{
            stars.splice(i, 1)
        }
    }
}

function drawStars(){
    let i = 0;
    while(i < stars.length){
        
        c.beginPath()
        c.rect(stars[i].x, stars[i].y, 5, 5+(stars[i].gravity-4)*2)
        c.fillStyle = "white"
        c.save()
        c.globalAlpha = 0.4;
        c.fill()
        c.closePath()
        c.restore()
        i++;
    }
}

function updateProjectileCoords(){
    let i = 0;
    while(i < projectiles.length){
        projectiles[i].x +=4*(Math.cos(projectiles[i].angle));
        projectiles[i].y += 4*(Math.sin(projectiles[i].angle));
        if(projectiles[i].x < 0 || projectiles[i].x > window.innerWidth || projectiles[i].y > window.innerHeight || projectiles[i].y < 0){
            projectiles.splice(i, 1);
            i--;
        }
        i++;
    }
}

//DEATH PARTICLES

function updateDeathParticles(){
    let i = 0;
    let j = 0;
    while (i < deathParticles.length){
        j = 0;
        while (j < deathParticles[i].length){
            if(deathParticles[i][j].loop < deathParticles[i][j].life){
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
            c.save()
            c.globalAlpha = 1-(deathParticles[i][j].loop/deathParticles[i][j].life);
            c.rect(deathParticles[i][j].x-size, deathParticles[i][j].y-size, size*2, size*2)
            c.fillStyle = deathParticles[i][j].particleColor;
            c.fill()
            c.closePath()
            c.restore()
        }
    }
}

