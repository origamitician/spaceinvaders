function pierceShot(){
    abilityTimeLeft = 1200 //1000 frames
    textsOnScreen.push({text: "Piercing Shot Activated!", font: "35px Inconsolata", x: xPos, y: yPos, life: 100, offset: 20, loop: 0})
    shotInfo.type = "pierce";
    shotInfo.fireIncrement = 17;
    shotInfo.fireSpeed = 18;
    shotInfo.hitboxBottom = 40;
    shotInfo.hitboxTop = 40;
    shotInfo.hitboxLeft = 5;
    shotInfo.hitboxRight = 5;
}

function jumboShot(){
    abilityTimeLeft = 1000 //1000 frames
    textsOnScreen.push({text: "Jumbo Shot Activated!", font: "35px Inconsolata", x: xPos, y: yPos, life: 100, offset: 20, loop: 0})
    shotInfo.type = "jumbo";
    shotInfo.fireIncrement = 185;
    shotInfo.fireSpeed = 15;
    shotInfo.hitboxBottom = 35;
    shotInfo.hitboxTop = 35;
    shotInfo.hitboxLeft = 7;
    shotInfo.hitboxRight = 7;
}

var blackHoleTotals = 0;

function blackHole(){
    abilityTimeLeft = 1000;
    textsOnScreen.push({text: "Black Hole Activated!", font: "35px Inconsolata", x: xPos, y: yPos, life: 100, offset: 20, loop: 0})
}
