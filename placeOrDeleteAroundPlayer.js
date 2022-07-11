// alt+p to toggle placing blocks on or off- automatically places grass below you
// alt+d to toggle deleting blocks on or off- automatically deletes blocks around you (flying mount recommended)
// only do this in a world you don't mind making messy

togglePlace = false;
toggleDelete = false;
toggling = false;
setInterval(() => {
    if (ig.input.state("alt") && ig.input.pressed("p")){
        if (!toggling) {
            toggling = true;
            setTimeout(() => {
                togglePlace = !togglePlace;
                togglePlace ? ig.game.sounds.success.play() : ig.game.sounds.nocando.play();
                consoleref.log(`place mode: ${togglePlace}`);
                toggling = false;
            }, 500)
        }
    }
    if (ig.input.state("alt") && ig.input.pressed("d")){
        if (!toggling) {
            toggling = true;
            setTimeout(() => {
                toggleDelete = !toggleDelete;
                toggleDelete ? ig.game.sounds.success.play() : ig.game.sounds.nocando.play();
                consoleref.log(`delete mode: ${toggleDelete}`);
                toggling = false;
            }, 500)
        }
    }
}, 0)

async function getDeobfuscator() {
    if (typeof Deobfuscator === 'undefined') {
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js"); 
    }   
};

async function placeBlocks() {
    await getDeobfuscator();
    ig.game.player.kill = function() {};
    map = Deobfuscator.object(ig.game,'queuePerformDelayMs',true);
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
                    togglePlace = false;
                    consoleref.log(`place mode: ${togglePlace}`);
                    toggleDelete = false;
                    consoleref.log(`delete mode: ${toggleDelete}`);
                    ig.game.sounds.nocando.play();
                    
                }
                "tiredFromActionLessMoving" != a && ig.game[keyboard].say("_nl")
            }
        }
    }
    setInterval(() => {
        playerPos = {
            x: Math.floor(ig.game.player.pos.x/19),
            y: Math.floor(ig.game.player.pos.y/19)
        }
    }, 100)
    blockRotation = 0;  //can be 0, 1, 2, or 3
    blockFlip = 0;      //can be 0 or 1
    setTimeout(() => {
        const delay = async (ms = 1000) =>  new Promise(resolve => setTimeout(resolve, ms))
        async function place() {
            blockId1 = "60c18e637b2d430afa59cc53";
            blockId2 = "60c1278914c5a60503f9d5fe";
            if (ig.game.player.vel.x < 0) {
                leftx = 14;
                rightx = 2;
            } else {
                leftx = 2;
                rightx = 14;
            }
            startBlockPos = {
                x: playerPos.x - leftx,
                y: playerPos.y + 1
            }
            endBlockPos = {
                x: playerPos.x + rightx,
                y: playerPos.y + 4
            }
            currentlyPlacing = true
            for (i = startBlockPos.y; i < endBlockPos.y; i++) {
                for (j = startBlockPos.x; j < endBlockPos.x; j++) {
                    if (i == startBlockPos.y) {
                        blockId = blockId1;
                    } else {
                        blockId = blockId2;
                    }
                    blockInfo = {
                        tid: blockId,
                        rotation: blockRotation,
                        flip: blockFlip
                    }
                    currentBlockPos = {
                        x: j,
                        y: i
                    }
                    ig.game[map].setMap(currentBlockPos.x, currentBlockPos.y, blockInfo, false);
                    await delay(10);
                }
            }
            lightId = '51e460bd134794940a000009';
            lightInfo = {
                tid: lightId,
                rotation: blockRotation,
                flip: blockFlip
            }
            ig.game[map].setMap(currentBlockPos.x, currentBlockPos.y - 8, lightInfo, false)
            currentlyPlacing = false;
        }
        currentlyPlacing = false;
        setInterval(() => {
            if (!currentlyPlacing && togglePlace && ig.game.player.vel.y == 0 && ig.game.player.vel.x != 0) {
                place();
            }
        }, 100)
    }, 200)
}

async function deleteBlocks() {
    await getDeobfuscator();
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
    };
    setTimeout(() => {
        async function remove() {
            getDynamic('6283d8b31a976b05bc17a1d3')
            startBlockPos = {
                x: playerPos.x - 5,
                y: playerPos.y - 5
            }
            endBlockPos = {
                x: playerPos.x + 5,
                y: playerPos.y + 5
            }
            for (i = startBlockPos.y; i < endBlockPos.y; i++) {
                for (j = startBlockPos.x; j < endBlockPos.x; j++) {
                    currentBlockPos = {
                        x: j,
                        y: i
                    }
                    ig.game[map].deleteThingAt(currentBlockPos.x, currentBlockPos.y);
                }
            }
        }
        setInterval(() => {
            if (toggleDelete) {
                remove();
            }
        }, 100)
    }, 200)
}

placeBlocks();
deleteBlocks();
