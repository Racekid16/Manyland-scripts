// finds the map location of all placements of the specified block in the specified area and section
// gives the option to delete all found instances of the block (if conditions met)
// set blockId to the id of the block you want to find.
// note: when specifying the area to search, 0,0 corresponds to the area's center location
// but the given coordinates of the specified block is its real location in the area
// if sectors keep failing to load, decrease the value of sectorChunkSize.

const delay = async (ms = 1000) =>  new Promise(resolve => setTimeout(resolve, ms));

async function getDeobfuscator() {
    if (typeof Deobfuscator === 'undefined') {
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js");
    }
};

async function findBlock() {
    await getDeobfuscator();
    ig.game.area = Deobfuscator.object(ig.game,'currentArea',false);
    obfVar = Deobfuscator.object(ig.game,'mnt_P',false);
    currentPlane = Deobfuscator.keyBetween(obfVar.mnt_P,"{p:b.",",a:b.c");
    ig.game.player.kill = function(){};
    sectorArray = [];
    blockId = "60c126203e2c000b01cf249c";
    wantsDeleteBlock = false;
    blockPlacementCoordinates = [];
    sectorChunkSize = 128;
    minChunkSize = 64;
    maxChunkSize = 4096;
    centerLoc = {
        x: 15,
        y: 15
    };
    area = prompt("Enter the name of the area you'd like to search: ","3").replace(/\s+/g, '');
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
        } catch (error) {
            ig.game.player.say("invalid area name!");
            return;
        }
        areaId = areaInformation.aid;
    }
    if (ig.game.isEditorHere && ig.game.area.currentArea == areaId && ig.game.area[currentPlane] == plane) {
        await delay(500);
        wantsDeleteBlockResponse = prompt("Do you want to delete all found instances of the specified block?\n(yes/no)","no").toLowerCase();
        if (wantsDeleteBlockResponse == "yes") {
            wantsDeleteBlock = true;
        }
    }
    await delay(500);
    topLeftCoordsResponse = prompt("Specify the top left coordinates of the section", "-500,-500").replaceAll(' ','').split(',').map(Number);
    topLeftCoords = {
        x: topLeftCoordsResponse[0] + centerLoc.x,
        y: topLeftCoordsResponse[1] + centerLoc.y
    };
    startSector = {
        x: Math.floor(topLeftCoords.x / 32), 
        y: Math.floor(topLeftCoords.y / 32)
    };
    await delay(500);
    bottomRightCoordsResponse = prompt("Specify the bottom right coordinates of the section", "500,500").replaceAll(' ','').split(',').map(Number);
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
        return;
    }
    for (sectorY = startSector.y; sectorY <= endSector.y; sectorY++) {
        for (sectorX = startSector.x; sectorX <= endSector.x; sectorX++) {
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
                    }
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
        for (sectorIndex = 0; sectorIndex < sectorChunkData.length; sectorIndex++) {
            sectorData = sectorChunkData[sectorIndex];
            if (!sectorData.iix.includes(blockId)) {
                continue;
            }
            sectorX = sectorData.x;
            sectorY = sectorData.y;
            for (blockIndex = 0; blockIndex < sectorData.ps.length; blockIndex++) {
                currentBlock = sectorData.ps[blockIndex];
                if (sectorData.iix[currentBlock[2]] == blockId) {
                    blockPos = {
                        x: currentBlock[0] + 32 * sectorX,
                        y: currentBlock[1] + 32 * sectorY
                    };
                    blockPlacementCoordinates.push([blockPos.x, blockPos.y]);
                    consoleref.log(JSON.stringify([blockPos.x,blockPos.y]));
                }
            }
        }
    }
    if (blockPlacementCoordinates.length == 0) {
        ig.game.player.say("finished. found no placements of the specified block.");
    } else {
        ig.game.player.say(`finished. ${blockPlacementCoordinates.length} placements of the specified block were found.`);   
    } 
    consoleref.log(blockPlacementCoordinates);
    if (wantsDeleteBlock) {
        deleteFoundBlock();
    }
}

async function deleteFoundBlock() {
    if (typeof Deobfuscator === 'undefined') {
        await getDeobfuscator();
    }
    map = Deobfuscator.object(ig.game,'queuePerformDelayMs',true);
    place = Deobfuscator.function(ig.game[map],'n:b||0,flip:c},d,!',true);
    ig.game.gravity = 0;
    tired = false;
    waitForNextBlock = false;
    callCount = 0;
    deleteHistory = [];
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
    for (let i = 0; i < blockPlacementCoordinates.length; i++) {
        if (!tired) {
            blockPos = {
                x: blockPlacementCoordinates[i][0],
                y: blockPlacementCoordinates[i][1]
            };
            if (distanceToNextBlock(blockPos.x, blockPos.y) > 46) {
                ig.game.player.pos = {
                    x: (blockPos.x - 64) * 19,
                    y: (blockPos.y - 64) * 19
                };
                while (ig.game.player.pos.x < blockPos.x * 19) {
                    ig.game.player.pos.x += 19;
                    await delay(10);
                }
                while (ig.game.player.pos.y < blockPos.y * 19) {
                    ig.game.player.pos.y += 19;
                    await delay(10);
                }
            } else {
                ig.game.player.pos = {
                    x: blockPos.x * 19,
                    y: blockPos.y * 19
                };
            }
            ig.game[map].deleteThingAt(blockPos.x, blockPos.y);
            deleteHistory.push(i);
            if (deleteHistory.length > 10) {
                deleteHistory.shift();
            }
            await delay(50);
        } else {
            if (i != deleteHistory[0]) {
                if (distanceToNextBlock(blockPlacementCoordinates[i][0], blockPlacementCoordinates[i][1]) > 60) {
                    waitForNextBlock = true;
                }
            }
            i = deleteHistory[0];
            blockPos = {
                x: blockPlacementCoordinates[i][0],
                y: blockPlacementCoordinates[i][1]
            };
            ig.game.player.pos = {
                x: blockPos.x * 19,
                y: blockPos.y * 19
            };
            if (waitForNextBlock) {
                await delay(2000);
                waitForNextBlock = false;
            }
            ig.game[map][place]("59ff6c69c2928463131dbf69", 0, 0, {x: blockPos.x, y: blockPos.y}, null, !0);
            await delay(400);
        }
    }
    ig.game.gravity = 800;
    ig.game.player.say("finished deleting block!");
}

findBlock();
