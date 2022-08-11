// finds the map location of all placements of the specified block in the specified area and section
// note: 0,0 corresponds to the area's center location

const delay = async (ms = 1000) =>  new Promise(resolve => setTimeout(resolve, ms));

async function getDeobfuscator() {
    if (typeof Deobfuscator === 'undefined') {
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js");
    }
};

async function findBlock() {
    await getDeobfuscator();
    ig.game.player.kill = function(){};
    sectorArray = [];
    blockId = '5b0957bbd11a6403a9394e9b';
    blockPlacementCoordinates = [];
    sectorChunkSize = 128;
    sectorChunkArray = [];
    centerLoc = {
        x: 15,
        y: 15
    };
    area = prompt("Enter the name of the area you'd like to search: ","3");
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
    await delay(500);
    topLeftCoordsResponse = prompt("Specify the top left coordinates of the section", "-100,-100").replaceAll(' ','').split(',').map(Number);
    topLeftCoords = {
        x: topLeftCoordsResponse[0] + centerLoc.x,
        y: topLeftCoordsResponse[1] + centerLoc.y
    };
    startSector = {
        x: Math.floor(topLeftCoords.x / 32), 
        y: Math.floor(topLeftCoords.y / 32)
    };
    await delay(500);
    bottomRightCoordsResponse = prompt("Specify the bottom right coordinates of the section", "100,100").replaceAll(' ','').split(',').map(Number);
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
    if (sectorArray.length > sectorChunkSize) {
        for (let i = 0; i < sectorArray.length; i+= sectorChunkSize) {
            if (i + sectorChunkSize < sectorArray.length) {
                sectorChunkArray.push(sectorArray.slice(i, i + sectorChunkSize));
            } else {
                sectorChunkArray.push(sectorArray.slice(i, sectorArray.length))
            }
        }
    } else {
        sectorChunkArray.push(sectorArray);
    }
    for (sectorChunkIndex = 0; sectorChunkIndex < sectorChunkArray.length; sectorChunkIndex++) {
        sectorLoaded = false;
        ig.game.player.say("loading sector data...");
        while (!sectorLoaded) {
            try {
                sectorChunkData = await jQuery.ajax({
                    type: "POST",
                    url: "/j/m/s/",
                    data: {
                        s: JSON.stringify(sectorChunkArray[sectorChunkIndex]),
                        p: plane,
                        a: areaId
                    },
                    success: function() {
                        sectorLoaded = true;
                        ig.game.player.say("sector data loaded!");
                    },
                });
            } catch (error) {
                sectorLoaded = false;
                ig.game.player.say("failed to load sector. retrying...");
            }
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
}

findBlock();