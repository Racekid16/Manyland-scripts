// automatically collects the id, name, text data, and map location of the placements of all bodies in the specified area and section
// note: when specifying the area to search, 0,0 corresponds to the area's center location
// but the given coordinates of each body's location is its real location in the area
// can JSON.stringify the body data, save it to a .txt file, then JSON.parse it to read it again later
// if sectors keep failing to load, decrease the value of sectorChunkSize.

const delay = async (ms = 1000) =>  new Promise(resolve => setTimeout(resolve, ms));

async function getDeobfuscator() {
    if (typeof Deobfuscator === 'undefined') {
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js");
    }
};

async function getBodyData() {
    await getDeobfuscator();
    ig.game.player.kill = function(){};
    sectorArray = [];
    bodyData = {};
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
                    if (typeof bodyData[sectorData.iix[currentBlock[2]]] === 'undefined') {
                        blockData = await jQuery.ajax({
                            url: "/j/i/def/" + sectorData.iix[currentBlock[2]],
                            context: null
                        });
                        collectData = await jQuery.ajax({
                            url: "/j/i/st/" + sectorData.iix[currentBlock[2]]
                        });
                        creatorData = await jQuery.ajax({
                            url: "/j/i/cin/" + sectorData.iix[currentBlock[2]],
                            context: null
                        });
                        bodyData[sectorData.iix[currentBlock[2]]] = {
                            bodyName: blockData.name,
                            creatorName: creatorData.name,
                            numCollects: collectData.timesCd,
                            spriteSheet: 'http://images1.manyland.netdna-cdn.com/' + sectorData.iix[currentBlock[2]],
                            placements: [],
                        };
                    }
                    blockPos = {
                        x: currentBlock[0] + 32 * sectorX,
                        y: currentBlock[1] + 32 * sectorY
                    };
                    if (currentBlock[0] !== null && currentBlock[1] !== null) {
                        /* if you want to know who placed the body, uncomment the follow lines
                        but note this makes the script slower */
                        // placerInfo = await jQuery.ajax({
                        //     url: "/j/m/placer/" + blockPos.x + "/" + blockPos.y + "/" + plane + "/" + areaId,
                        //     context: null
                        // });
                        bodyData[sectorData.iix[currentBlock[2]]].placements.push({
                            x: blockPos.x, 
                            y: blockPos.y,
                            // placerId: placerInfo.id,
                            // placerName: placerInfo.name
                        });
                        ig.game.player.say("body found!");
                    }
                }
            }
        }
    }
    /* leastCollectedBodies[0] should be the id of the least collected body, 
    and leastCollectedBodies[leastCollectedBodies.length - 1] should be the id of the most collected body.
    as such, bodyData[leastCollectedBodies[1]] for example should return the data on the least collected body */
    leastCollectedBodies = Object.keys(bodyData)
    .sort((key1, key2) => bodyData[key1].numCollects - bodyData[key2].numCollects);
    ig.game.player.say(`finished gathering body data! ${leastCollectedBodies.length} unique bodies were found.`);    
    consoleref.log(bodyData);
}

getBodyData();
