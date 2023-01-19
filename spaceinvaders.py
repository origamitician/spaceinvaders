from tkinter import *
from array import *
import time
import math
import random
from playsound import playsound
from threading import Thread
from PIL import Image,ImageTk

canvHeight = 600
canvWidth = 1280
t=Tk()
c = Canvas(t, height=canvHeight, width=canvWidth)
c.pack()
c.create_rectangle(0, 0, canvWidth, canvHeight, fill="black")
listOfAliens = []
listOfAliensImg = []
angles = []
outerLoop = []
innerLoop = []
alienColors = ["white", "lightgreen", "red", "yellow", "skyblue"]
shotList = []
numParticles = 0

alien_1_proper = Image.open(".\\aliens\\alien1.png")
alien_1 = PhotoImage(file=".\\aliens\\alien1.png")
alien_2_proper = Image.open(".\\aliens\\alien2.png")
alien_2 = PhotoImage(file=".\\aliens\\alien2.png")

alien_1_rotated = ImageTk.PhotoImage(alien_1_proper.rotate(40))

#ship_main = c.create_oval((canvWidth/2)-40, 510, (canvWidth/2)+40, 590, outline="skyblue", fill="skyblue")
ship_inner = c.create_polygon((canvWidth/2), 510, (canvWidth/2)+32, 580, (canvWidth/2)-32, 580,outline="skyblue", fill="#db655c")

def moveShip(event):
    x, y = event.x, event.y
    c.moveto(ship_inner, x-32, y-50)

def cloneAliens(pattern, startX, startY, waves, lengthOfWave, offset):
    global numParticles
    for i in range(lengthOfWave):
        numParticles += 1
        #alien = c.create_rectangle((startX-15)-(i*offset), startY-15, (startX+15)-(i*offset), startY+15, fill=alienColors[int(pattern[i%len(pattern):i%len(pattern)+1])])#alienColors[pattern[i % len(pattern)]])
        alien = c.create_image((startX-20)-(i*offset), startY-20, image=alien_1)
        listOfAliens.append(alien)
        listOfAliensImg.append(alien_1_proper)
        angles.append(0)
        outerLoop.append(0)
        innerLoop.append(0)

    print(listOfAliensImg)
commandList = "-"

def cloneShots():
    global numParticles
    numParticles+=1
    coords = c.coords(ship_inner)
    #for i in range(10):
    shots = c.create_rectangle(coords[0]-4, coords[1]-40, coords[0]+4, coords[1], fill="lightblue")
    shotList.append(shots)

def moveShots(speed):
    global numParticles
    i = 0
    while i < len(shotList):
        c.move(shotList[i], 0, 0-speed)
        i+=1
        '''print(i)
        if(c.coords(shotList[i])[1] < 0):
            shotList.pop(i)
            c.delete(shotList[i])
            numParticles -= 1
            i -=1
        i+=1'''


centralX, centralY, centralShotX, centralShotY = 0, 0, 0, 0
def soundEffect():
    playsound("C:\\Users\\mchlc\\mystuff\\spaceinvaders\\gun-gunshot-01.wav")

def deathAnimation(count, xPos, yPos):
    pass

def moveAliens(command, speed):
    commandList = command.split('-')
    
    #loop.append(0)
    i = 0
    a=ImageTk.PhotoImage(alien_2_proper)
    while i < len(listOfAliens):
        cmd = commandList[outerLoop[i]]
        for char in cmd:
            if char.isalpha():
                breakPoint = cmd.index(char)
                breakLetter = char
                break

        if(c.coords(listOfAliens[i])[0] + 15 > 0):
            if (breakLetter == "R"):
                if (innerLoop[i] < int(cmd[0:breakPoint])):
                    innerLoop[i] += 1
                  
                    c.itemconfig(listOfAliens[i], image=alien_1_rotated)
                    angles[i]+= int(cmd[breakPoint+1:len(cmd)])/360*math.pi*2
                    c.move(listOfAliens[i], speed*math.cos(angles[i]), speed*math.sin(angles[i]))
                else:#need to add terminating condition
                    if (outerLoop[i] < len(commandList)-1):
                        innerLoop[i] = 0
                        outerLoop[i] += 1
                    
            elif (breakLetter == "L"):
                if (innerLoop[i] < int(cmd[0:breakPoint])):
                    innerLoop[i] += 1
                    angles[i] -= int(cmd[breakPoint+1:len(cmd)])/360*math.pi*2
                    c.move(listOfAliens[i], speed*math.cos(angles[i]), speed*math.sin(angles[i]))
                else:#need to add terminating condition
                    if (outerLoop[i] < len(commandList)-1):
                        innerLoop[i] = 0
                        outerLoop[i] += 1

            else:
                if (innerLoop[i] < int(cmd[0:breakPoint])):
                    innerLoop[i] += 1
                    c.move(listOfAliens[i], int(cmd[breakPoint+1:len(cmd)])*math.cos(angles[i]), int(cmd[breakPoint+1:len(cmd)])*math.sin(angles[i]))
                else:#need to add terminating condition
                    if (outerLoop[i] < len(commandList)-1):
                        innerLoop[i] = 0
                        outerLoop[i] += 1
            
            k = 0
            while k < len(shotList): #detect collision
                #alien x and y positions
                centralX = c.coords(listOfAliens[i])[0]+15 
                centralY = c.coords(listOfAliens[i])[1]+15
                #shot x and y positions
                centralShotX = c.coords(shotList[k])[0]+3
                centralShotY = c.coords(shotList[k])[1]+20
                if ((centralShotX-3 < centralX+15) and (centralShotX+3> centralX-15) and
                    (centralShotY-20 < centralY+15) and (centralShotY+20 > centralY-15)):
                    #delete alien
                    c.create_text(centralX, centralY, text="10", fill="white", font=("Segoe UI Bold", 20))
                    c.delete(listOfAliens[i])
                    listOfAliens.pop(i)
                    outerLoop.pop(i)
                    innerLoop.pop(i)
                    angles.pop(i)
                    i -= 1
                    
                    global numParticles
                    numParticles-=1

                    #t = Thread(target=soundEffect)
                    #t.start()

                    c.delete(shotList[k])
                    shotList.pop(k)
                    k -= 1
                k+= 1
                
        else:
            c.move(listOfAliens[i], speed, 0)
        
        i+=1
alienSpeed = 6
cloneAliens("01234", 0, 350, 1, 25, alienSpeed*15) #appears every 10 frames

c.bind('<Motion>', moveShip)

startTime = time.time()
print(startTime)
while True: #main game loop
    newTime = time.time()
    if(newTime - startTime > 0.2):
        cloneShots()
        startTime = newTime
    moveShots(11)
    moveAliens("50F6-30L3-35R3-50F6-120L3-65F6", alienSpeed)
    t.update()
    if(numParticles < 60):
        time.sleep(0.001)
    
    
    
    




