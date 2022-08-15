// automatically collects the id and collect count for each body in the specified area
// note: when specifying the area to search, 0,0 corresponds to the area's center location
// can JSON.stringify bodyData, save it to a .txt file, then JSON.parse it to read it again later
// by default, does not store each body's name and creator name,
// but it can be enabled by changing wantsAdditionalBodyData to true
// although that can significantly increase execution time if there's lots of bodies
// type stopPlacing() in console to stop placing bodies.
// if you toggled wantsAdditionalBodyData, also have the option to find bodies by a specific player
// by typing findBodiesByPlayerId(their id) or findBodiesByPlayerName(their name)

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
    bodyDataObject = {};
    // 50000 seems to be around the max sector chunk size
    sectorChunkSize = 256;
    minChunkSize = 16;
    maxChunkSize = 2048;
    minRequestSize = 250;
    maxRequestSize = 1000;
    requestSize = maxRequestSize;
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
    updateBodyData = async function(bodyArray) {
        let endIndex = 0;
        for (let i = 0; i < bodyArray.length; ) {
            i + requestSize < bodyArray.length ? endIndex = i + requestSize : endIndex = bodyArray.length;
            let actualRequestSize = endIndex - i;
            let numBodiesWithDataLoadedIn = {
                count: 0
            }
            for (let j = i; j < endIndex; j++) {
                requestBodyData(bodyArray[j], numBodiesWithDataLoadedIn);
            }
            while (numBodiesWithDataLoadedIn.count != actualRequestSize) {
                await delay(250);
            }
            i = endIndex;
            requestSize = Math.round((requestSize + maxRequestSize) / 2);
        }
    }
    requestBodyData = async function(bodyId, countObject) {
        let fetchedData = [false, false, false];
        while (!fetchedData[0]) {
            try {
                var collectData = await jQuery.ajax({
                    url: "/j/i/st/" + bodyId,
                    success: function () {
                        fetchedData[0] = true;
                    }
                });
            } catch (error) {
                if (requestSize - 1 >= minRequestSize) {
                    requestSize--;
                }
            }
        }
        if (wantsAdditionalBodyData) {
            while (!fetchedData[1]) {
                try {
                    var blockData = await jQuery.ajax({
                        url: "/j/i/def/" + bodyId,
                        context: null,
                        success: function () {
                            fetchedData[1] = true;
                        }
                    });
                } catch (error) {
                    if (requestSize - 1 >= minRequestSize) {
                        requestSize--;
                    }
                }
            }
            if (typeof blockData.prop !== 'undefined') {
                if (typeof blockData.prop.clonedFrom !== 'undefined') {
                    var cloned = true;
                } else {
                    var cloned = false;
                }
            } else {
                var cloned = false;
            }
            while (!fetchedData[2]) {
                try {
                    var creatorData = await jQuery.ajax({
                        url: "/j/i/cin/" + bodyId,
                        context: null,
                        success: function () {
                            fetchedData[2] = true;
                        }
                    });
                } catch (error) {
                    if (requestSize - 1 >= minRequestSize) {
                        requestSize--;
                    }
                }
            }
            bodyDataObject[bodyId].blockName = blockData.name;
            bodyDataObject[bodyId].creatorId = creatorData.id;
            bodyDataObject[bodyId].creatorName = creatorData.name;
            bodyDataObject[bodyId].isCloned = cloned;
        }
        bodyDataObject[bodyId].numCollects = collectData.timesCd;
        countObject.count++;
    }
    numSuccessiveFails = 0;
    numSuccessiveQuickResponses = 0;
    for (sectorArrayIndex = 0; sectorArrayIndex < sectorArray.length; ) {
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
                        numSuccessiveFails = 0;
                        sectorArrayIndex += sectorChunkSize;
                        fetchTime = (Date.now() - startTime) / 1000;
                        if (fetchTime < 3) {
                            if (numSuccessiveQuickResponses > 0) {
                                if (Math.round(sectorChunkSize * 5 / 4) < maxChunkSize) {
                                    sectorChunkSize = Math.round(sectorChunkSize * 5 / 4);
                                } else {
                                    sectorChunkSize = maxChunkSize;
                                }
                            }
                            numSuccessiveQuickResponses++;
                        } else {
                            numSuccessiveQuickResponses = 0;
                        }
                    }
                });
            } catch (error) {
                ig.game.player.say("failed to load sector. retrying...");
                numSuccessiveQuickResponses = 0;
                if (numSuccessiveFails > 0) {
                    if (Math.round(sectorChunkSize * 3 / 4) > minChunkSize) {
                        sectorChunkSize = Math.round(sectorChunkSize * 3 / 4);
                    } else {
                        sectorChunkSize = minChunkSize;
                    }
                }
                numSuccessiveFails++;
            }
        }
        if (sectorChunkData.length == 0) {
            continue;
        }
        let bodiesInSector = [];
        for (sectorIndex = 0; sectorIndex < sectorChunkData.length; sectorIndex++) {
            sectorData = sectorChunkData[sectorIndex];
            if (!sectorData.i.b.includes("STACKWEARB")) {
                continue;
            }
            sectorX = sectorData.x;
            sectorY = sectorData.y;
            for (blockIndex = 0; blockIndex < sectorData.ps.length; blockIndex++) {
                currentBlock = sectorData.ps[blockIndex];
                if (sectorData.i.b[currentBlock[2]] == "STACKWEARB" && currentBlock[0] !== null) {
                    blockPos = {
                        x: currentBlock[0] + 32 * sectorX,
                        y: currentBlock[1] + 32 * sectorY
                    };
                    if (typeof bodyDataObject[sectorData.iix[currentBlock[2]]] === 'undefined') {
                        bodyDataObject[sectorData.iix[currentBlock[2]]] = {
                            placements: [[blockPos.x, blockPos.y]],
                            spriteSheet: 'http://images1.manyland.netdna-cdn.com/' + sectorData.iix[currentBlock[2]]
                        };
                        bodiesInSector.push(sectorData.iix[currentBlock[2]]);
                    } else {
                        bodyDataObject[sectorData.iix[currentBlock[2]]].placements.push([blockPos.x, blockPos.y]);
                    }
                }
            }
        }
        updateBodyData(bodiesInSector);
    }
    allBodyCollectsLoaded = false;
    while (!allBodyCollectsLoaded) {
        hasNull = false;
        for (key in bodyDataObject) {
            if (typeof bodyDataObject[key].numCollects == 'undefined') {
                hasNull = true;
                break;
            }
        }
        if (!hasNull) {
            allBodyCollectsLoaded = true;
        } else {
            await delay(1000);
        }
    }
    bodyData = [];
    for (key in bodyDataObject) {
        bodyData.push([key, bodyDataObject[key]]);
    }
    bodyData.sort((a,b) => a[1].numCollects - b[1].numCollects);
    ig.game.player.say(`finished getting body ids! ${bodyData.length} unique bodies were found.`); 
    consoleref.log(bodyData);
    if (wantsAdditionalBodyData) {
        findBodiesByPlayerId = function(playerId) {
            return bodyData.filter((element) => element[1].creatorId == playerId);
        }
        findBodiesByPlayerName = function(playerName) {
            playerName = playerName.toLowerCase();
            return bodyData.filter((element) => element[1].creatorName == playerName);
        }
    }
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
    stopPlacing = function() {
        placingStopped = true;
    }
    for (let bodyDataIndex = 0; bodyDataIndex < bodyData.length; bodyDataIndex += bodiesPerRow, row += rowHeight) {
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
            }
        } else {
            break;
        }
    }
    ig.game.gravity = 800;
    ig.game.player.say("finished placing bodies!");
}

getBodyData();
