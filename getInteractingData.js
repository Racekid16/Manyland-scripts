// automatically collects the id, name, text data, and map location of the placements of all interactings in the specified area and section
// note: 0,0 corresponds to the area's center location
// can JSON.stringify the interacting data, save it to a .txt file, then JSON.parse it to read it again later

const delay = async (ms = 1000) =>  new Promise(resolve => setTimeout(resolve, ms));

async function getDeobfuscator() {
    if (typeof Deobfuscator === 'undefined') {
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js");
    }
};

async function getinteractingData() {
    await getDeobfuscator();
    ig.game.player.kill = function(){};
    sectorArray = [];
    interactingData = {};
    sectorChunkSize = 128;
    sectorChunkArray = [];
    centerLoc = {
        x: 15,
        y: 15
    };
    area = prompt("Enter the name of the area whose interactings you'd like to inspect: ","3");
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
        if (typeof areaInformation.iid !== 'undefined') {
            blockData = await jQuery.ajax({
                url: "/j/i/def/" + areaInformation.iid,
                context: null
            });
            interactingData["global interacting"] = {
                interactingId: areaInformation.iid,
                name: blockData.name,
                text: blockData.prop.textData.toLowerCase()
            };
        }
        globalInteractingId = areaInformation.iid;
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
            if (!sectorData.i.b.includes("INTERACT")) {
                continue;
            }
            sectorX = sectorData.x;
            sectorY = sectorData.y;
            for (blockIndex = 0; blockIndex < sectorData.ps.length; blockIndex++) {
                currentBlock = sectorData.ps[blockIndex];
                if (sectorData.i.b[currentBlock[2]] == "INTERACT") {
                    if (typeof interactingData[sectorData.iix[currentBlock[2]]] === 'undefined') {
                        blockData = await jQuery.ajax({
                            url: "/j/i/def/" + sectorData.iix[currentBlock[2]],
                            context: null
                        });
                        interactingText = blockData.prop.textData.toLowerCase();
                        /* if you want to only collect info on interactings whose text contains certain substrings
                        uncomment the commented lines */
                        //if (interactingText.includes("/to ") || interactingText.includes("isn't [editor]") || interactingText.includes("is [editor]") || interactingText.includes("/lock ")) {
                            interactingData[sectorData.iix[currentBlock[2]]] = {
                                name: blockData.name,
                                text: interactingText,
                                placements: [],
                                placementCount: 0
                            };
                        //}
                    }
                    blockPos = {
                        x: currentBlock[0] + 32 * sectorX,
                        y: currentBlock[1] + 32 * sectorY
                    };
                    /* if only collecting info on interactings that contain specific substrings, uncomment the following lines */
                    //if (typeof interactingData[sectorData.iix[currentBlock[2]]] !== 'undefined') {
                        if (currentBlock[0] !== null && currentBlock[1] !== null) {
                            placerInfo = await jQuery.ajax({
                                url: "/j/m/placer/" + blockPos.x + "/" + blockPos.y + "/" + plane + "/" + areaId,
                                context: null
                            });
                            interactingData[sectorData.iix[currentBlock[2]]].placements.push({
                                x: blockPos.x, 
                                y: blockPos.y,
                                placerId: placerInfo.id,
                                placerName: placerInfo.name
                            });
                            interactingData[sectorData.iix[currentBlock[2]]].placementCount++;
                            ig.game.player.say("interacting found!");
                        }
                    //}
                }
            }
        }
    }
    /* global interacting will be the first id if there is one
    then it will in the order of highest placement count to lowest placement count
    so mostPlacedInteractings[1] should be the id of the most placed interacting, 
    and mostPlacedInteractins[mostPlacedInteractings.length - 1] should be the id of the least placed interacting.
    as such, interactingData[mostPlacedInteractings[1]] for example should return the information on the most placed interacting */
    mostPlacedInteractings = Object.keys(interactingData)
    .sort((key1, key2) => interactingData[key2].placementCount - interactingData[key1].placementCount);
    ig.game.player.say("finished gathering interacting information!");    
    consoleref.log(interactingData);
}

getinteractingData();
