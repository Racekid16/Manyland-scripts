// deletes the area with approximately the size you specify from where you were standing when you ran this script
// stand in the top left corner of where you want to start deleting
// if you leave the window you'll probably be sent to peacepark
// alt+d to start/stop deleting

toggleDelete = false;
toggling = false;
setInterval(() => {
    if (ig.input.state("alt") && ig.input.pressed("d")){
        if (!toggling) {
            toggling = true;
            setTimeout(() => {
                toggleDelete = !toggleDelete;
                if (toggleDelete) {
                    deleteSection();
                    ig.game.sounds.success.play();
                } else {
                    stopDeleting();
                    ig.game.sounds.nocando.play();
                }
                toggling = false;
            }, 500)
        }
    }
}, 0)

async function getDeobfuscator() {
    if (typeof Deobfuscator === 'undefined') {
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js"); 
    }   
}

async function stopDeleting() {
    await getDeobfuscator();
    ig.game.gravity = 800;
    if (typeof trackPlayerPos !== 'undefined') {
        clearInterval(trackPlayerPos);
    }
    if (typeof movePlayer !== 'undefined') {
        clearInterval(movePlayer);
    }
    itemSlots = Deobfuscator.object(ig.game,'lastPressedControlTimer', true);
    itemEquip = Deobfuscator.function(ig.game[itemSlots],'(g=1);c&&(!a.attachments[b]||',true);
    window.getDynamic = function(id){
        if (typeof ig.game.player.attachments.w == 'undefined'){
            ig.game[itemSlots][itemEquip](ig.game.player,ig.game[itemSlots].slots.WEARABLE,id,null,"DYNATHING");
        } else if (ig.game.player.attachments?.w === null){
            ig.game[itemSlots][itemEquip](ig.game.player,ig.game[itemSlots].slots.WEARABLE,id,null,"DYNATHING");
        } else if(ig.game.player.attachments.w.id != id){
            ig.game[itemSlots][itemEquip](ig.game.player,ig.game[itemSlots].slots.WEARABLE,id,null,"DYNATHING");
        }
    }
    getDynamic('6283d8b31a976b05bc17a1d3');
    toggleDelete = false;
    consoleref.log(`delete mode: ${toggleDelete}`);
}

async function deleteSection() {
    await getDeobfuscator();
    areaSize = prompt("Enter the size of the section you want to delete.\n(width,height)",`20,20`)
            .split(',').map(Number);
    if (isNaN(areaSize[0]) || isNaN(areaSize[1])) {
        consoleref.log("invalid input.")
        return;
    }
    if (areaSize[0] >= 0 && areaSize[1] >= 0) {
        quadrant = 4;
        goingRight = true;
    } else if (areaSize[0] >= 0 && areaSize[1] < 0) {
        quadrant = 1;
        goingRight = true;
    } else if (areaSize[0] < 0 && areaSize[1] >= 0) {
        quadrant = 3;
        goingRight = false;
    } else if (areaSize[0] < 0 && areaSize[1] < 0) {
        quadrant = 2;
        goingRight = false;
    }
    toggleDelete = true;
    posHistory = [];
    consoleref.log(`delete mode: ${toggleDelete}`);
    const delay = async (ms = 1000) =>  new Promise(resolve => setTimeout(resolve, ms))
    tired = false;
    ig.game.gravity = 0;
    callCount = 0;
    ig.game.player.kill = function() {};
    map = Deobfuscator.object(ig.game,'queuePerformDelayMs',true);
    async function wait() {
        let initialCallCount = callCount;
        ig.game.player.pos.x = posHistory[0][0];
        ig.game.player.pos.y = posHistory[0][1];
        await delay(3000);
        if (callCount == initialCallCount) {
            tired = false;
        }
    }
    if (typeof keyboard === 'undefined') {
        keyboard = Deobfuscator.object(ig.game,'isSpeaking',true);
        talk = Deobfuscator.function(ig.game[keyboard],'indexOf(a);this.say(a,b);',true);
        obfOb1 = Deobfuscator.keyBetween(ig.game[keyboard][talk],'if(!this.','||1.5<=this.');
        ig.game[keyboard][talk] = function(a) {
            if (!ig.game[keyboard][obfOb1] || 1.5 <= ig.game[keyboard][obfOb1].delta()) {
                ig.game[keyboard][obfOb1] = new ml.Timer;
                0 <= ["centerTooClose", "placenameAlreadyPlaced", "tooManyPeopleAround", "editorOnly", "nonPublicAreasOnly"].indexOf(a) && ig.game.sounds.nocando.play();
                var b = 0 <= ["editorOnly", "howToCollect"].indexOf(a);
                ig.game[keyboard].say(a, b);
                if (a == "tired") {
                    callCount++;
                    tired = true;
                    wait();
                }
                "tiredFromActionLessMoving" != a && ig.game[keyboard].say("_nl");
            }
        }
    }
    trackPlayerPos = setInterval(() => {
        playerPos = {
            x: Math.round(ig.game.player.pos.x/19),
            y: Math.round(ig.game.player.pos.y/19)
        }
        ig.game.player.vel.x = 0;
        ig.game.player.vel.y = 0;
    }, 0)
    sectionWidth = 10;
    rowHeight = 10;
    if (Math.abs(areaSize[0]) < sectionWidth) {
        sectionWidth = Math.abs(areaSize[0]);
    }
    if (Math.abs(areaSize[1]) < rowHeight) {
        rowHeight = Math.abs(areaSize[1]);
    }
    moveDelay = rowHeight * sectionWidth * 10;
    if (moveDelay < 400 && moveDelay != 0 && (areaSize[0] > 50 || areaSize[1] > 50)) {
        moveDelay = 400
    }
    async function remove() {
        if (quadrant == 1 || quadrant == 2) {
            for (let i = Math.round(playerPos.y + rowHeight/2 + 1); i > Math.round(playerPos.y - rowHeight/2 + 1); i--) {
                for (let j = Math.round(playerPos.x - sectionWidth/2); j < Math.round(playerPos.x + sectionWidth/2); j++) {
                    ig.game[map].deleteThingAt(j, i);
                }
                await delay(1);
            }
        }
        if (quadrant == 3 || quadrant == 4) {
            for (let i = Math.round(playerPos.y - rowHeight/2); i < Math.round(playerPos.y + rowHeight/2); i++) {
                for (let j = Math.round(playerPos.x - sectionWidth/2); j < Math.round(playerPos.x + sectionWidth/2); j++) {
                    ig.game[map].deleteThingAt(j, i);
                }
                await delay(1);
            }
        }
    }
    function addToPosHistory() {
        posHistory.push([ig.game.player.pos.x, ig.game.player.pos.y]);
        if (posHistory.length > 2) {
            posHistory.shift();
        }
    }
    setTimeout(() => {
        startBlockPos = {
            x: playerPos.x,
            y: playerPos.y
        }
        if (quadrant == 1) {
            endBlockPos = {
                x: startBlockPos.x + areaSize[0] - 1,
                y: startBlockPos.y + areaSize[1] + 1
            }
        } 
        if (quadrant == 2) {
            endBlockPos = {
                x: startBlockPos.x + areaSize[0] + 1,
                y: startBlockPos.y + areaSize[1] + 1
            }
        } 
        if (quadrant == 3) {
            endBlockPos = {
                x: startBlockPos.x + areaSize[0] + 1,
                y: startBlockPos.y + areaSize[1] - 1
            }
        } if (quadrant == 4) {
            endBlockPos = {
                x: startBlockPos.x + areaSize[0] - 1,
                y: startBlockPos.y + areaSize[1] - 1
            }
        }
        remove();
        movePlayer = setInterval(() => {
            if (!tired) {
                if (goingRight) {
                    if (quadrant == 1) {
                        if (playerPos.x + sectionWidth <= endBlockPos.x) {
                            ig.game.player.pos.x += 19 * sectionWidth;
                        } 
                        if (playerPos.x + sectionWidth > endBlockPos.x && playerPos.y - endBlockPos.y  >= rowHeight) {
                            ig.game.player.pos.y -= 19 * rowHeight;
                            goingRight = false;
                        } 
                        if (playerPos.x + sectionWidth > endBlockPos.x && playerPos.y - endBlockPos.y < rowHeight) {
                            stopDeleting();
                        }
                    }
                    if (quadrant == 2) {
                        if (playerPos.x < startBlockPos.x) {
                            ig.game.player.pos.x += 19 * sectionWidth;
                        } 
                        if (playerPos.x >= startBlockPos.x && playerPos.y - endBlockPos.y  >= rowHeight) {
                            ig.game.player.pos.y -= 19 * rowHeight;
                            goingRight = false;
                        } 
                        if (playerPos.x >= startBlockPos.x && playerPos.y - endBlockPos.y  < rowHeight) {
                            stopDeleting();
                        }
                    }
                    if (quadrant == 3) {
                        if (playerPos.x < startBlockPos.x) {
                            ig.game.player.pos.x += 19 * sectionWidth;
                        } 
                        if (playerPos.x >= startBlockPos.x && endBlockPos.y - playerPos.y >= rowHeight) {
                            ig.game.player.pos.y += 19 * rowHeight;
                            goingRight = false;
                        } 
                        if (playerPos.x >= startBlockPos.x && endBlockPos.y - playerPos.y < rowHeight) {
                            stopDeleting();
                        }
                    }
                    if (quadrant == 4) {
                        if (playerPos.x + sectionWidth <= endBlockPos.x) {
                            ig.game.player.pos.x += 19 * sectionWidth;
                        } 
                        if (playerPos.x + sectionWidth > endBlockPos.x && endBlockPos.y - playerPos.y >= rowHeight) {
                            ig.game.player.pos.y += 19 * rowHeight;
                            goingRight = false;
                        } 
                        if (playerPos.x + sectionWidth > endBlockPos.x && endBlockPos.y - playerPos.y < rowHeight) {
                            stopDeleting();
                        }
                    }
                } else {
                    if (quadrant == 1) {
                        if (playerPos.x > startBlockPos.x) {
                            ig.game.player.pos.x -= 19 * sectionWidth;
                        } 
                        if (playerPos.x <= startBlockPos.x && playerPos.y - endBlockPos.y >= rowHeight) {
                            ig.game.player.pos.y -= 19 * rowHeight;
                            goingRight = true;
                        } 
                        if (playerPos.x <= startBlockPos.x && playerPos.y - endBlockPos.y < rowHeight) {
                            stopDeleting();
                        }
                    }
                    if (quadrant == 2) {
                        if (playerPos.x - sectionWidth >= endBlockPos.x) {
                            ig.game.player.pos.x -= 19 * sectionWidth;
                        } 
                        if (playerPos.x - sectionWidth < endBlockPos.x && playerPos.y - endBlockPos.y >= rowHeight) {
                            ig.game.player.pos.y -= 19 * rowHeight;
                            goingRight = true;
                        } 
                        if (playerPos.x - sectionWidth < endBlockPos.x && playerPos.y - endBlockPos.y < rowHeight) {
                            stopDeleting();
                        }
                    }
                    if (quadrant == 3) {
                        if (playerPos.x - sectionWidth >= endBlockPos.x) {
                            ig.game.player.pos.x -= 19 * sectionWidth;
                        } 
                        if (playerPos.x - sectionWidth < endBlockPos.x && endBlockPos.y - playerPos.y >= rowHeight) {
                            ig.game.player.pos.y += 19 * rowHeight;
                            goingRight = true;
                        } 
                        if (playerPos.x - sectionWidth < endBlockPos.x && endBlockPos.y - playerPos.y < rowHeight) {
                            stopDeleting();
                        }
                    }
                    if (quadrant == 4) {
                        if (playerPos.x > startBlockPos.x) {
                            ig.game.player.pos.x -= 19 * sectionWidth;
                        } 
                        if (playerPos.x <= startBlockPos.x && endBlockPos.y - playerPos.y >= rowHeight) {
                            ig.game.player.pos.y += 19 * rowHeight;
                            goingRight = true;
                        } 
                        if (playerPos.x <= startBlockPos.x && endBlockPos.y - playerPos.y < rowHeight) {
                            stopDeleting();
                        }
                    }
                }
                addToPosHistory();
            }
            remove();
        }, moveDelay)
    }, moveDelay)
}

deleteSection();