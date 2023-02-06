//PROJECTILES
var deathParticles = []
var projectiles = []
let particleColors = [["#46eb34", "#85d166", "grey"], ["#13ede6", "red", "#3c9e9b"], ["orange", "#c4bc27", "#9e873c"]]
let projectileImages = [document.getElementsByClassName("projectile")[0]]

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
            if(/*deathParticles[i][j].y < 625*/ deathParticles[i][j].loop < 100){
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
            c.globalAlpha = 1-0.01*(deathParticles[i][j].loop);
            c.rect(deathParticles[i][j].x-size, deathParticles[i][j].y-size, size*2, size*2)
            c.fillStyle = deathParticles[i][j].particleColor;
            c.fill()
            c.closePath()
            c.restore()
        }
    }
}