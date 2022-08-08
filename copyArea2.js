// improved copy script eliminates the need to scan beforehand.
// directly requests block data from the server- much faster
// first specify the world you want to copy
// then specify the coordinates of the top left block in the area you want to copy
// then specify the coordinates of the bottom right block in the area you want to copy
// a rectangular area at least as big as you specified will be copied

const delay = async (ms = 1000) =>  new Promise(resolve => setTimeout(resolve, ms));

async function getDeobfuscator() {
    if (typeof Deobfuscator === 'undefined') {
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js");
    }
};

async function copyArea() {
    await getDeobfuscator();
    itemEquip = Deobfuscator.function(ig.game.attachmentManager,'(c);!e&&!a.O',true);
    map = Deobfuscator.object(ig.game,'queuePerformDelayMs',true);
    place = Deobfuscator.function(ig.game[map],'n:b||0,flip:c},d,!',true);
    tired = false;
    alreadyStopped = false;
    waitForNextBlock = false;
    placeDelay = 35;
    callCount = 0;
    offset = {
        x: 0,
        y: 0
    }
    areaCenterLocation = {
        x: 15,
        y: 15
    }
    placeHistory = [];
    ig.game.gravity = 0;
    ig.game.player.kill = function(){};
    setInterval(() => {
        playerPos = {
            x: Math.round(ig.game.player.pos.x / 19),
            y: Math.round(ig.game.player.pos.y / 19)
        }
    }, 0);
    await delay(500);
    getWearable = async function(id) {
        if (typeof ig.game.player.attachments.w == 'undefined' || ig.game.player.attachments?.w === null) {
            ig.game.attachmentManager[itemEquip](ig.game.player,ig.game.attachmentManager.slots.WEARABLE,id,null,"STACKWEAR");
        } else if (ig.game.player.attachments.w.id != id) {
            ig.game.attachmentManager[itemEquip](ig.game.player,ig.game.attachmentManager.slots.WEARABLE,null,null,"STACKWEAR");
            await delay(100);
            ig.game.attachmentManager[itemEquip](ig.game.player,ig.game.attachmentManager.slots.WEARABLE,id,null,"STACKWEAR");
        }
    };
    getWearable("62b5eba64b4994128421214a");
    distanceToNextBlock = function(blockX, blockY) {
        return Math.sqrt(Math.pow(playerPos.x - blockX, 2) + Math.pow(playerPos.y - blockY, 2));
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
        };
    }
    async function wait() {
        let initialCallCount = callCount;
        await delay(3000);
        if (callCount == initialCallCount) {
            tired = false;
        }
    }
    area = prompt("Enter the name of the world you'd like to copy: ","3");
    if (area == '1' || area == '2' || area == '3' || area == '4' || area == '5' || area == '6' || area == '7' || area == '8') {
        plane = 1;
        area = parseInt(area);
        areaId = area;
        if (areaId == 3) {
            areaCenterLocation.x = 0;
            areaCenterLocation.y = -50;
        }
    } else if (area == 'inner ring') {
        plane = 2;
        areaId = 1;
        areaCenterLocation.x = 477;
        areaCenterLocation.y = -327;
    } else {
        plane = 0;
        areaInformation = await jQuery.ajax({
            headers: {
                "cache-control": "no-cache"
            },
            url: "/j/i/",
            type: "POST",
            data: {
                urlName: area,
                buster: Date.now()
            }
        });
        areaId = areaInformation.aid;
    }
    offset.x = 15 - areaCenterLocation.x;
    offset.y = 15 - areaCenterLocation.y;
    await delay(500);
    topLeftCoordsResponse = prompt("Specify the top left coordinates of the section to copy", "-100,-100").replaceAll(' ','').split(',').map(Number);
    topLeftCoords = {
        x: topLeftCoordsResponse[0] + areaCenterLocation.x,
        y: topLeftCoordsResponse[1] + areaCenterLocation.y
    };
    startSector = {
        x: Math.floor(topLeftCoords.x / 32), 
        y: Math.floor(topLeftCoords.y / 32)
    };
    await delay(500);
    bottomRightCoordsResponse = prompt("Specify the bottom right coordinates of the section to copy", "100,100").replaceAll(' ','').split(',').map(Number);
    bottomRightCoords = {
        x: bottomRightCoordsResponse[0] + areaCenterLocation.x,
        y: bottomRightCoordsResponse[1] + areaCenterLocation.y
    };
    endSector = {
        x: Math.floor(bottomRightCoords.x / 32), 
        y: Math.floor(bottomRightCoords.y / 32)
    };
    if (startSector.x > endSector.x || startSector.y > endSector.y) {
        ig.game.player.say("invalid coordinates!")
        return;
    }
    await delay(1000);
    for (sectorY = startSector.y; sectorY <= endSector.y; sectorY++) {
        for (sectorX = startSector.x; sectorX <= endSector.x; sectorX++) {
            sectorInformation = await jQuery.ajax({
                type: "POST",
                url: "/j/m/s/",
                data: {
                    s: JSON.stringify([[sectorX,sectorY]]),
                    p: plane,
                    a: areaId
                }
            });
            if (sectorInformation.length === 0) {
                continue;
            }
            sectorInformation[0].ps = sectorInformation[0].ps.filter(block => block[0] !== null && block[1] !== null && block[2] !== null && block[3] !== null && block[4] !== null);
            if (sectorX * 32 < topLeftCoords.x) {
                sectorInformation[0].ps = sectorInformation[0].ps.filter(block => block[0] + 32 * sectorX >= topLeftCoords.x);
            }
            if ((sectorX + 1) * 32 - 1 > bottomRightCoords.x) {
                sectorInformation[0].ps = sectorInformation[0].ps.filter(block => block[0] + 32 * sectorX <= bottomRightCoords.x);
            }
            if (sectorY * 32 < topLeftCoords.y) {
                sectorInformation[0].ps = sectorInformation[0].ps.filter(block => block[1] + 32 * sectorY >= topLeftCoords.y);
            }
            if ((sectorY + 1) * 32 - 1 > bottomRightCoords.y) {
                sectorInformation[0].ps = sectorInformation[0].ps.filter(block => block[1] + 32 * sectorY <= bottomRightCoords.y);
            }
            for (blockIndex = 0; blockIndex < sectorInformation[0].ps.length; blockIndex++) {
                if (!tired) {
                    currentBlock = sectorInformation[0].ps[blockIndex];
                    blockPos = {
                        x: currentBlock[0] + 32 * sectorX + offset.x,
                        y: currentBlock[1] + 32 * sectorY + offset.y
                    }
                    if (distanceToNextBlock(blockPos.x, blockPos.y) > 60) {
                        waitForNextBlock = true;
                    }
                    ig.game.player.pos = {
                        x: blockPos.x * 19,
                        y: blockPos.y * 19
                    };
                    if (waitForNextBlock) {
                        await delay(2000);
                        waitForNextBlock = false;
                    }
                    ig.game[map][place](sectorInformation[0].iix[currentBlock[2]], currentBlock[3], currentBlock[4], {x: blockPos.x, y: blockPos.y}, null, !0);
                    placeHistory.push([sectorX, sectorY, blockIndex]);
                    if (placeHistory.length > 30) {
                        placeHistory.shift();
                    }
                    await delay(placeDelay);
                } else {
                    if (sectorX != placeHistory[0][0] || sectorY != placeHistory[0][1] ) {
                        sectorInformation = await jQuery.ajax({
                            type: "POST",
                            url: "/j/m/s/",
                            data: {
                                s: JSON.stringify([[sectorX,sectorY]]),
                                p: plane,
                                a: areaId
                            }
                        });
                        sectorInformation[0].ps = sectorInformation[0].ps.filter(block => block[0] !== null && block[1] !== null && block[2] !== null && block[3] !== null && block[4] !== null);
                        if (sectorX * 32 < topLeftCoords.x) {
                            sectorInformation[0].ps = sectorInformation[0].ps.filter(block => block[0] + 32 * sectorX >= topLeftCoords.x);
                        }
                        if ((sectorX + 1) * 32 - 1 > bottomRightCoords.x) {
                            sectorInformation[0].ps = sectorInformation[0].ps.filter(block => block[0] + 32 * sectorX <= bottomRightCoords.x);
                        }
                        if (sectorY * 32 < topLeftCoords.y) {
                            sectorInformation[0].ps = sectorInformation[0].ps.filter(block => block[1] + 32 * sectorY >= topLeftCoords.y);
                        }
                        if ((sectorY + 1) * 32 - 1 > bottomRightCoords.y) {
                            sectorInformation[0].ps = sectorInformation[0].ps.filter(block => block[1] + 32 * sectorY <= bottomRightCoords.y);
                        }
                    }
                    sectorX = placeHistory[0][0];
                    sectorY = placeHistory[0][1];
                    blockIndex = placeHistory[0][2];
                    currentBlock = sectorInformation[0].ps[blockIndex];
                    blockPos = {
                        x: currentBlock[0] + 32 * sectorX + offset.x,
                        y: currentBlock[1] + 32 * sectorY + offset.y
                    }
                    ig.game.player.pos.x = blockPos.x * 19;
                    ig.game.player.pos.y = blockPos.y * 19;
                    await delay(400);
                    ig.game[map].deleteThingAt(blockPos.x, blockPos.y);
                    await delay(100);
                    ig.game[map][place](sectorInformation[0].iix[currentBlock[2]], currentBlock[3], currentBlock[4], {x: blockPos.x, y: blockPos.y}, null, !0);
                }
            }
        }
    }
    ig.game.gravity = 800;
    getWearable(null);
}

copyArea();
