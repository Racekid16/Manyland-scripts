// improved copy script eliminates the need to scan beforehand.
// directly requests block data from the server- much faster
// first specify the area you want to copy
// then specify the coordinates of the top left block in the area you want to copy
// then specify the coordinates of the bottom right block in the area you want to copy
// a rectangular formed by the coordinates you specified will be copied
// note: 0,0 corresponds to the area's center location
// if sectors keep failing to load, decrease the value of sectorChunkSize.

const delay = async (ms = 1000) =>  new Promise(resolve => setTimeout(resolve, ms));

async function getDeobfuscator() {
    if (typeof Deobfuscator === 'undefined') {
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js");
    }
};

async function copyArea() {
    await getDeobfuscator();
    // if continuing where you left off, change sectorStarX and sectorStartY to appropriate values
    // and set differentStartX and differentStartY to true.
    sectorStartX = 0;
    sectorStartY = 0;
    differentStartX = false;
    differentStartY = false;
    itemEquip = Deobfuscator.function(ig.game.attachmentManager,'(c);!e&&!a.O',true);
    map = Deobfuscator.object(ig.game,'queuePerformDelayMs',true);
    place = Deobfuscator.function(ig.game[map],'n:b||0,flip:c},d,!',true);
    ig.game.errorManager.originalKickedFunc = ig.game.errorManager.kicked;
    tired = false;
    alreadyStopped = false;
    waitForNextBlock = false;
    placeDelay = 35;
    callCount = 0;
    offset = {
        x: 0,
        y: 0
    };
    centerLoc = {
        x: 15,
        y: 15
    };
    placeHistory = [];
    sectorArray = [];
    sectorChunkSize = 64;
    minChunkSize = 8;
    maxChunkSize = 512;
    ig.game.player.kill = function(){};
    getWearable = async function(id) {
        if (typeof ig.game.player.attachments.w == 'undefined' || ig.game.player.attachments?.w === null) {
            ig.game.attachmentManager[itemEquip](ig.game.player,ig.game.attachmentManager.slots.WEARABLE,id,null,"STACKWEAR");
        } else if (ig.game.player.attachments.w.id != id) {
            ig.game.attachmentManager[itemEquip](ig.game.player,ig.game.attachmentManager.slots.WEARABLE,null,null,"STACKWEAR");
            await delay(100);
            ig.game.attachmentManager[itemEquip](ig.game.player,ig.game.attachmentManager.slots.WEARABLE,id,null,"STACKWEAR");
        }
    };
    ig.game.errorManager.kicked = function(a){
        if (blockIndex > 10) {
            alert(`You got an info rift. 
            sectorX: ${sectorX}
            sectorY: ${sectorY}
            blockIndex: ${blockIndex - 10}`);
        } else {
            alert(`You got an info rift. 
            sectorX: ${sectorX}
            sectorY: ${sectorY}
            blockIndex: 0`);
        }
        ig.game.errorManager.originalKickedFunc(a);
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
    setInterval(() => {
        playerPos = {
            x: Math.round(ig.game.player.pos.x / 19),
            y: Math.round(ig.game.player.pos.y / 19)
        }
    }, 0);
    await delay(500);
    distanceToNextBlock = function(blockX, blockY) {
        return Math.sqrt(Math.pow(playerPos.x - blockX, 2) + Math.pow(playerPos.y - blockY, 2));
    };
    area = prompt("Enter the name of the area whose bodies you'd like to inspect: ","3").replace(/\s+/g, '');
    if (area == '1' || area == '2' || area == '3' || area == '4' || area == '5' || area == '6' || area == '7' || area == '8') {
        plane = 1;
        area = parseInt(area);
        areaId = area;
        if (areaId == 1) {
            centerLoc.x = 477;
            centerLoc.y = -327;
        } else if (areaId == 2 || areaId == 3 || areaId == 4) {
            centerLoc.x = 0;
            centerLoc.y = -50;
        }
    } else if (area == 'inner ring') {
        plane = 2;
        areaId = 1;
        centerLoc.x = 477;
        centerLoc.y = -327;
    } else {
        plane = 0;
        try {
            areaData = await jQuery.ajax({
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
        } catch (error) {
            ig.game.player.say("invalid area name!");
            return;
        }
        areaId = areaData.aid;
    }
    offset.x = ig.game.areaCenterLocation.x - centerLoc.x;
    offset.y = ig.game.areaCenterLocation.y - centerLoc.y;
    await delay(500);
    topLeftCoordsResponse = prompt("Specify the top left coordinates of the section to copy", "-100,-100").replaceAll(' ','').split(',').map(Number);
    topLeftCoords = {
        x: topLeftCoordsResponse[0] + centerLoc.x,
        y: topLeftCoordsResponse[1] + centerLoc.y
    };
    startSector = {
        x: Math.floor(topLeftCoords.x / 32), 
        y: Math.floor(topLeftCoords.y / 32)
    };
    await delay(500);
    bottomRightCoordsResponse = prompt("Specify the bottom right coordinates of the section to copy", "100,100").replaceAll(' ','').split(',').map(Number);
    bottomRightCoords = {
        x: bottomRightCoordsResponse[0] + centerLoc.x,
        y: bottomRightCoordsResponse[1] + centerLoc.y
    };
    endSector = {
        x: Math.floor(bottomRightCoords.x / 32), 
        y: Math.floor(bottomRightCoords.y / 32)
    };
    if (startSector.x > endSector.x || startSector.y > endSector.y) {
        ig.game.player.say("invalid coordinates!")
        getWearable(null);
        ig.game.errorManager.kicked = ig.game.errorManager.originalKickedFunc;
        return;
    }
    getWearable("62b5eba64b4994128421214a");
    await delay(1000);
    for (sectorY = startSector.y; sectorY <= endSector.y; sectorY++) {
        if (differentStartY) {
            sectorY = sectorStartY - 1;
            differentStartY = false;
            continue;
        }
        for (sectorX = startSector.x; sectorX <= endSector.x; sectorX++) {
            if (differentStartX) {
                sectorX = sectorStartX - 1;
                differentStartX = false;
                continue;
            }
            sectorArray.push([sectorX,sectorY]);
        }
    }
    for (sectorArrayIndex = 0; sectorArrayIndex < sectorArray.length; sectorArrayIndex++) {
        sectorLoaded = false;
        ig.game.player.say("loading sector data...");
        while (!sectorLoaded) {
            try {
                startTime = Date.now();
                sectorChunkData = await jQuery.ajax({
                    type: "POST",
                    url: "/j/m/s/",
                    data: {
                        s: JSON.stringify(sectorArray.filter((element, index)=> index >= sectorArrayIndex && index < sectorArrayIndex + sectorChunkSize)),
                        p: plane,
                        a: areaId
                    },
                    success: function() {
                        sectorLoaded = true;
                        ig.game.player.say("sector data loaded!");
                        sectorArrayIndex += sectorChunkSize;
                        fetchTime = (Date.now() - startTime) / 1000;
                        if (fetchTime < 3 && Math.round(sectorChunkSize * 5 / 4) < maxChunkSize) {
                            sectorChunkSize = Math.round(sectorChunkSize * 5 / 4);
                        }
                    },
                });
            } catch (error) {
                ig.game.player.say("failed to load sector. retrying...");
                if (Math.round(sectorChunkSize * 3 / 4) > minChunkSize) {
                    sectorChunkSize = Math.round(sectorChunkSize * 3 / 4);
                }
            }
        }
        if (sectorChunkData.length == 0) {
            continue;
        }
        ig.game.gravity = 0;
        for (sectorIndex = 0; sectorIndex < sectorChunkData.length; sectorIndex++) {
            sectorData = sectorChunkData[sectorIndex];
            sectorX = sectorData.x;
            sectorY = sectorData.y;
            sectorData.ps = sectorData.ps.filter(block => block[0] !== null && block[1] !== null && block[2] !== null && block[3] !== null && block[4] !== null);
            if (sectorX * 32 < topLeftCoords.x) {
                sectorData.ps = sectorData.ps.filter(block => block[0] + 32 * sectorX >= topLeftCoords.x);
            }
            if ((sectorX + 1) * 32 - 1 > bottomRightCoords.x) {
                sectorData.ps = sectorData.ps.filter(block => block[0] + 32 * sectorX <= bottomRightCoords.x);
            }
            if (sectorY * 32 < topLeftCoords.y) {
                sectorData.ps = sectorData.ps.filter(block => block[1] + 32 * sectorY >= topLeftCoords.y);
            }
            if ((sectorY + 1) * 32 - 1 > bottomRightCoords.y) {
                sectorData.ps = sectorData.ps.filter(block => block[1] + 32 * sectorY <= bottomRightCoords.y);
            }
            for (blockIndex = 0; blockIndex < sectorData.ps.length; blockIndex++) {
                if (!tired) {
                    currentBlock = sectorData.ps[blockIndex];
                    blockPos = {
                        x: currentBlock[0] + 32 * sectorX + offset.x,
                        y: currentBlock[1] + 32 * sectorY + offset.y
                    };
                    if (blockIndex == 0) {
                        if (distanceToNextBlock(blockPos.x, blockPos.y) > 60) {
                            waitForNextBlock = true;
                        }
                    }
                    ig.game.player.pos = {
                        x: blockPos.x * 19,
                        y: blockPos.y * 19
                    };
                    if (waitForNextBlock) {
                        await delay(2000);
                        waitForNextBlock = false;
                    }
                    ig.game[map][place](sectorData.iix[currentBlock[2]], currentBlock[3], currentBlock[4], {x: blockPos.x, y: blockPos.y}, null, !0);
                    placeHistory.push([sectorIndex, blockIndex]);
                    if (placeHistory.length > 30) {
                        placeHistory.shift();
                    }
                    await delay(placeDelay);
                } else {
                    if (sectorIndex != placeHistory[0][0]) {
                        if (distanceToNextBlock(blockPos.x, blockPos.y) > 60) {
                            waitForNextBlock = true;
                        }
                    }
                    sectorIndex = placeHistory[0][0];
                    sectorData = sectorChunkData[sectorIndex];
                    sectorX = sectorData.x;
                    sectorY = sectorData.y;
                    blockIndex = placeHistory[0][1];
                    currentBlock = sectorData.ps[blockIndex];
                    blockPos = {
                        x: currentBlock[0] + 32 * sectorX + offset.x,
                        y: currentBlock[1] + 32 * sectorY + offset.y
                    };
                    ig.game.player.pos = {
                        x: blockPos.x * 19,
                        y: blockPos.y * 19
                    };
                    if (waitForNextBlock) {
                        await delay(2000);
                        waitForNextBlock = false;
                    }
                    ig.game[map].deleteThingAt(blockPos.x, blockPos.y);
                    await delay(100);
                    ig.game[map][place](sectorData.iix[currentBlock[2]], currentBlock[3], currentBlock[4], {x: blockPos.x, y: blockPos.y}, null, !0);
                    await delay(400);
                }
            }
        }      
    }
    ig.game.gravity = 800;
    getWearable(null);
    ig.game.errorManager.kicked = ig.game.errorManager.originalKickedFunc;
    ig.game.player.say("finished copying!");    
}

copyArea();
