// stores all the same information as before except placements
// much faster
// better for searching large areas with lots of bodies like 3 or stockpile.
// type placeBodies() in console to place the bodies once finished getting body data.

const delay = async (ms = 1000) =>  new Promise(resolve => setTimeout(resolve, ms));

async function getDeobfuscator() {
    if (typeof Deobfuscator === 'undefined') {
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js");
    }
};

async function getBodyData() {
    await getDeobfuscator();
    wantsAdditionalBodyData = false;
    ig.game.player.kill = function(){};
    sectorArray = [];
    class ArraySet extends Set {
        add(arr) {
            super.add(JSON.stringify(arr));
        }
        has(arr) {
            return super.has(JSON.stringify(arr));
        }
    }
    bodyIdSet = new ArraySet();
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
    updateBodyIdSet = async function(id) {
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
                await delay(100);
            }
        }
        bodyIdSet.add([id, collectData.timesCd]);
    }
    updateBodyData = async function(arrayIndex, id) {
        let fetchedData = [false, false];
        while (!fetchedData[0]) {
            try {
                var blockData = await jQuery.ajax({
                    url: "/j/i/def/" + id,
                    context: null,
                    success: function () {
                        fetchedData[0] = true;
                    }
                });
            } catch (error) {
                await delay(100);
            }
        }
        while (!fetchedData[1]) {
            try {
                var creatorData = await jQuery.ajax({
                    url: "/j/i/cin/" + id,
                    context: null,
                    success: function () {
                        fetchedData[1] = true;
                    }
                });
            } catch (error) {
                await delay(100);
            }
        }
        bodyData[arrayIndex][1].bodyName = blockData.name;
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
                    updateBodyIdSet(sectorData.iix[currentBlock[2]]);
                }
            }
        }
    }
    await delay(3000);
    bodyData = [];
    bodyIdSet.forEach((element) => {
        let parsedElement = JSON.parse(element);
        bodyData.push([parsedElement[0], {
            bodyName: null,
            numCollects: parsedElement[1],
            creatorId: null,
            creatorName: null,
            spriteSheet: 'http://images1.manyland.netdna-cdn.com/' + parsedElement[0]
        }]);
    });
    ig.game.player.say(`finished getting body ids! ${bodyData.length} unique bodies were found.`); 
    bodyData.sort((a,b) => a[1].numCollects - b[1].numCollects);
    /* getting the additonal body data can be slow, and somewhat unnecessary if you plan to place the bodies.
    but, if you want to save all the data including body name, creator id and creator name
    you can toggle this setting.*/
    if (wantsAdditionalBodyData) {
        for (i = 0; i < bodyData.length; i++) {
            updateBodyData(i, bodyData[i][0]);
        }
    }
    await delay(1000);
    ig.game.player.say('type bodyData in console to view the bodies\' data!');
    await delay(3000);
    ig.game.player.say('type placeBodies() in console to place the bodies.');
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
    row = 0;
    rowHeight = 3;
    colWidth = 2;
    bodiesPerRow = 6;
    stopPlacing = false;
    for (let bodyDataIndex = 0; bodyDataIndex < bodyData.length; bodyDataIndex++, row += rowHeight) {
        col = 0;
        if (!stopPlacing) {
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
            bodyDataIndex += bodiesPerRow;
        } else {
            break;
        }
    }
    ig.game.gravity = 800;
    ig.game.player.say("finished placing bodies!");
}

getBodyData();
