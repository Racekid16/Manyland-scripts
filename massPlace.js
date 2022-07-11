// automatically builds ground and light in the direction you specify
// alt+p to start/stop placing

toggling = false;
togglePlace = false;
setInterval(() => {
    if (ig.input.state("alt") && ig.input.pressed("p")){
        if (!toggling) {
            toggling = true;
            setTimeout(() => {
                togglePlace = !togglePlace;
                if (togglePlace) {
                    build();
                    ig.game.sounds.success.play();
                } else {
                    currentlyPlacing = false;
                    if (typeof placeInterval !== 'undefined') {
                        clearInterval(placeInterval);
                    }
                    if (typeof movePlayer !== 'undefined') {
                        clearInterval(movePlayer);
                    }
                    ig.game.sounds.nocando.play();
                    consoleref.log(`place mode: ${togglePlace}`);
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
};

async function build() {
    await getDeobfuscator();
    var direction = prompt("Enter left or right: ","right");
    if (direction != "left" && direction != "right") {
        consoleref.log("invalid input.")
        return;
    }
    togglePlace = true;
    consoleref.log(`place mode: ${togglePlace}`);
    const delay = async (ms = 1000) =>  new Promise(resolve => setTimeout(resolve, ms))
    tired = false;
    callCount = 0;
    ig.game.player.kill = function() {};
    map = Deobfuscator.object(ig.game,'queuePerformDelayMs',true);
    async function wait() {
        let initialCallCount = callCount;
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
    setInterval(() => {
        playerPos = {
            x: Math.floor(ig.game.player.pos.x/19),
            y: Math.floor(ig.game.player.pos.y/19)
        }
    }, 100)
    blockRotation = 0;  //can be 0, 1, 2, or 3
    blockFlip = 0;      //can be 0 or 1
    setTimeout(() => {
        async function place() {
            blockId1 = "60c18e637b2d430afa59cc53";
            blockId2 = "60c1278914c5a60503f9d5fe";
            if (direction == "left") {
                leftx = 12;
                rightx = 2;
            } else {
                leftx = 2;
                rightx = 12;
            }
            startBlockPos = {
                x: playerPos.x - leftx,
                y: playerPos.y + 1
            }
            endBlockPos = {
                x: playerPos.x + rightx,
                y: playerPos.y + 3
            }
            currentlyPlacing = true
            for (i = startBlockPos.y - 1; i < endBlockPos.y; i++) {
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
                    if (i == startBlockPos.y - 1) {
                        blockInfo = null;
                    }
                    ig.game[map].setMap(currentBlockPos.x, currentBlockPos.y, blockInfo, false);
                    await delay(1);
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
        placeInterval = setInterval(() => {
            if (!currentlyPlacing) {
                place();
            }
        }, 100)
        movePlayer = setInterval(() => {
            if (currentlyPlacing && !tired) {
                if (direction == "left") {
                    ig.game.player.vel.x = -200;
                } else {
                    ig.game.player.vel.x = 200;
                }
            }
        }, 0)
    }, 200)
}

build();