// automatically collects the id and collect count for each body in the specified area
// note: when specifying the area to search, 0,0 corresponds to the area's center location
// can JSON.stringify bodyData, save it to a .txt file, then JSON.parse it to read it again later
// by default, does not store each body's name and creator name,
// but it can be enabled by changing wantsAdditionalBodyData to true
// although that can significantly increase execution time if there's lots of bodies
// type stopPlacing() in console to stop placing bodies.

const delay = async (ms = 1000) =>  new Promise(resolve => setTimeout(resolve, ms));

async function getDeobfuscator() {
    if (typeof Deobfuscator === 'undefined') {
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js");
    }
};

async function getBodyData() {
    await getDeobfuscator();
    wantsPlaceBodies = false;
    wantsAdditionalBodyData = false;
    ig.game.player.kill = function(){};
    sectorArray = [];
    bodyCollectMap = new Map();
    // 50000 seems to be around the max sector chunk size
    sectorChunkSize = 128;
    minChunkSize = 16;
    maxChunkSize = 2048
    centerLoc = {
        x: 15,
        y: 15
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
        ig.game.player.say("invalid coordinates!");
        return;
    }
    for (sectorY = startSector.y; sectorY <= endSector.y; sectorY++) {
        for (sectorX = startSector.x; sectorX <= endSector.x; sectorX++) {
            sectorArray.push([sectorX,sectorY]);
        }
    }
    if (ig.game.isEditorHere) {
        await delay(500);
        wantsPlaceBodiesResponse = prompt("Do you want to place the bodies found when scanning is finished? (yes/no)","no").toLowerCase();
        if (wantsPlaceBodiesResponse == "yes") {
            wantsPlaceBodies = true;
        }
    }
    updateBodyCollectMap = async function(id) {
        if (!bodyCollectMap.has(id)) {
            bodyCollectMap.set(id, null);
        } else {
            return;
        }
        let fetchedData = false;
        while (!fetchedData) {
            try {
                var collectData = await jQuery.ajax({
                    url: "/j/i/st/" + id,
                    success: function () {
                        fetchedData = true;
                    }
                });
            } catch (error) {
                //nothing
            }
        }
        bodyCollectMap.set(id, collectData.timesCd);
    }
    updateBodyDataBodyName = async function(arrayIndex, id) {
        let fetchedData = false;
        while (!fetchedData) {
            try {
                var blockData = await jQuery.ajax({
                    url: "/j/i/def/" + id,
                    context: null,
                    success: function () {
                        fetchedData = true;
                    }
                });
            } catch (error) {
                if (requestSize - 1 >= minRequestSize) {
                    requestSize--;
                }
            }
        }
        bodyData[arrayIndex][1].bodyName = blockData.name;
    }
    updateBodyDataCreatorName = async function(arrayIndex, id) {
        let fetchedData = false
        while (!fetchedData) {
            try {
                var creatorData = await jQuery.ajax({
                    url: "/j/i/cin/" + id,
                    context: null,
                    success: function () {
                        fetchedData = true;
                    }
                });
            } catch (error) {
                if (requestSize - 1 >= minRequestSize) {
                    requestSize--;
                }
            }
        }
        bodyData[arrayIndex][1].creatorId = creatorData.id;
        bodyData[arrayIndex][1].creatorName = creatorData.name;
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
                        if (fetchTime < 3) {
                            if (Math.round(sectorChunkSize * 5 / 4) < maxChunkSize) {
                                sectorChunkSize = Math.round(sectorChunkSize * 5 / 4);
                            } else {
                                sectorChunkSize = maxChunkSize;
                            }
                        }
                    },
                });
            } catch (error) {
                ig.game.player.say("failed to load sector. retrying...");
                if (Math.round(sectorChunkSize * 3 / 4) > minChunkSize) {
                    sectorChunkSize = Math.round(sectorChunkSize * 3 / 4);
                } else {
                    sectorChunkSize = minChunkSize;
                }
            }
        }
        if (sectorChunkData.length == 0) {
            continue;
        }
        for (sectorIndex = 0; sectorIndex < sectorChunkData.length; sectorIndex++) {
            sectorData = sectorChunkData[sectorIndex];
            if (!sectorData.i.b.includes("STACKWEARB")) {
                continue;
            }
            sectorX = sectorData.x;
            sectorY = sectorData.y;
            for (blockIndex = 0; blockIndex < sectorData.ps.length; blockIndex++) {
                currentBlock = sectorData.ps[blockIndex];
                if (sectorData.i.b[currentBlock[2]] == "STACKWEARB") {
                    updateBodyCollectMap(sectorData.iix[currentBlock[2]]);
                }
            }
        }
    }
    allBodyCollectsLoaded = false;
    while (!allBodyCollectsLoaded) {
        mapValues = Array.from(bodyCollectMap.values());
        if (!mapValues.includes(null)) {
            allBodyCollectsLoaded = true;
        } else {
            await delay(1000);
        }
    }
    bodyData = [];
    bodyCollectMap.forEach((value, key) => {
        bodyData.push([key, {
            bodyName: null,
            numCollects: value,
            creatorId: null,
            creatorName: null,
            spriteSheet: 'http://images1.manyland.netdna-cdn.com/' + key
        }]);
    });
    bodyData.sort((a,b) => a[1].numCollects - b[1].numCollects);
    ig.game.player.say(`finished getting body ids! ${bodyData.length} unique bodies were found.`); 
    /* getting the additonal body data can be slow, and somewhat unnecessary if you plan to place the bodies.
    but, if you want to save all the data including body name, creator id and creator name
    you can toggle this setting.*/
    if (wantsAdditionalBodyData) {
        ig.game.player.say("loading body names...");
        minRequestSize = 250;
        maxRequestSize = 1000;
        requestSize = maxRequestSize;
        for (let i = 0; i < bodyData.length; ) {
            i + requestSize < bodyData.length? endIndex = i + requestSize : endIndex = bodyData.length;
            for (let j = i; j < endIndex; j++) {
                updateBodyDataBodyName(j, bodyData[j][0]);
            }
            allBodyNamesLoaded = false;
            while (!allBodyNamesLoaded) {
                nullFound = false;
                for (let k = i; k < endIndex; k++) {
                    if (bodyData[k][1].bodyName === null) {
                        nullFound = true;
                        break;
                    }
                }
                if (!nullFound) {
                    allBodyNamesLoaded = true;
                } else {
                    await delay(1000);
                }
            }
            i = endIndex;
            requestSize = Math.round((requestSize + maxRequestSize) / 2);
        }
        ig.game.player.say("body names loaded! now loading creator names...");
        for (let i = 0; i < bodyData.length; ) {
            i + requestSize < bodyData.length? endIndex = i + requestSize : endIndex = bodyData.length;
            for (let j = i; j < endIndex; j++) {
                updateBodyDataCreatorName(j, bodyData[j][0]);
            }
            allCreatorNamesLoaded = false;
            while (!allCreatorNamesLoaded) {
                nullFound = false;
                for (let k = i; k < endIndex; k++) {
                    if (bodyData[k][1].creatorName === null) {
                        nullFound = true;
                        break;
                    }
                }
                if (!nullFound) {
                    allCreatorNamesLoaded = true;
                } else {
                    await delay(1000);
                }
            }
            i += requestSize;
            requestSize = Math.round((requestSize + maxRequestSize) / 2);
        }
        await delay(1000);
        ig.game.player.say('finished loading creator names!');
    } 
    consoleref.log(bodyData);
    if (wantsPlaceBodies) {
        placeBodies();
    }
}

async function placeBodies() {
    if (typeof Deobfuscator === 'undefined') {
        await getDeobfuscator();
    }
    map = Deobfuscator.object(ig.game,'queuePerformDelayMs',true);
    place = Deobfuscator.function(ig.game[map],'n:b||0,flip:c},d,!',true);
    startPos = {
        x: Math.round(ig.game.player.pos.x / 19),
        y: Math.round(ig.game.player.pos.y / 19 + 1),
    };
    ig.game.gravity = 0;
    tired = false;
    callCount = 0;
    row = 0;
    rowHeight = 3;
    colWidth = 2;
    bodiesPerRow = 8;
    placingStopped = false;
    placeHistory = [];
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
    for (let bodyDataIndex = 0; bodyDataIndex < bodyData.length; row += rowHeight) {
        col = 0;
        if (!placingStopped) {
            if (!tired) {
                for (let i = 0; i < colWidth * bodiesPerRow - 1; i++) {
                    blockPos = {
                        x: startPos.x + i, 
                        y: startPos.y - row
                    }
                    ig.game.player.pos = {
                        x: blockPos.x * 19,
                        y: blockPos.y * 19
                    }
                    ig.game[map][place]("60fdc5772021881e90086990", 0, 0, {x: blockPos.x, y: blockPos.y}, null, !0);
                    await delay(50);
                }
                for (let j = bodyDataIndex; j < bodyDataIndex + bodiesPerRow; j++, col += colWidth) {
                    blockPos = {
                        x: startPos.x + col,
                        y: startPos.y - row - 1
                    }
                    ig.game.player.pos = {
                        x: blockPos.x * 19,
                        y: blockPos.y * 19
                    }
                    if (j < bodyData.length) {
                        ig.game[map][place](bodyData[j][0], 0, 0, {x: blockPos.x , y: blockPos.y}, null, !0);
                        await delay(50);
                    }
                }
                placeHistory.push([bodyDataIndex, row]);
                if (placeHistory.length > 4) {
                    placeHistory.shift();
                }
                bodyDataIndex += bodiesPerRow;
            } else {
                bodyDataIndex = placeHistory[0][0];
                row = placeHistory[0][1];
                blockPos = {
                    x: startPos.x,
                    y: startPos.y - row - 1
                };
                ig.game.player.pos = {
                    x: blockPos.x * 19,
                    y: blockPos.y * 19
                }
                ig.game[map].deleteThingAt(blockPos.x, blockPos.y);
                await delay(100);
                ig.game[map][place](bodyData[bodyDataIndex][0], 0, 0, {x: blockPos.x, y: blockPos.y}, null, !0);
                await delay(400);
                bodyDataIndex += bodiesPerRow;
            }
        } else {
            break;
        }
    }
    ig.game.gravity = 800;
    ig.game.player.say("finished placing bodies!");
}

function stopPlacing() {
    placingStopped = true;
}

getBodyData();
