var textsOnScreen = [];

function updateText(){
    let i = 0;
    while (i < textsOnScreen.length){
        if(textsOnScreen[i].life + textsOnScreen[i].offset> textsOnScreen[i].loop){
            textsOnScreen[i].loop++;
            textsOnScreen[i].y--;
            i++;
        }else{
            textsOnScreen.splice(i, 1)
        }  
    }
}

function renderText(){
    let i = 0;
    while (i < textsOnScreen.length){
        c.beginPath()
        c.save();
        c.font = textsOnScreen[i].font;
        c.textAlign = "center";
        c.globalAlpha = 1-((1/textsOnScreen[i].life)*(textsOnScreen[i].loop-textsOnScreen[i].offset))
        c.fillStyle = "white";
        c.fillText(textsOnScreen[i].text, textsOnScreen[i].x, textsOnScreen[i].y);
        c.restore()
        c.closePath()
        i++;
    }
    
}