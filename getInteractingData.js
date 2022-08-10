// automatically collects the id, name, text data, and map location of the placements of all interactings in the specified world and section
// note: 0,0 corresponds to the area's center location

const delay = async (ms = 1000) =>  new Promise(resolve => setTimeout(resolve, ms));

async function getDeobfuscator() {
    if (typeof Deobfuscator === 'undefined') {
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js");
    }
};

async function getinteractingData() {
    await getDeobfuscator();
    interactingData = new Map();
    centerLoc = {
        x: 15,
        y: 15
    };
    area = prompt("Enter the name of the world whose interactings you'd like to inspect: ","3");
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
            if (!sectorInformation[0].i.b.includes("INTERACT")) {
                continue;
            }
            for (blockIndex = 0; blockIndex < sectorInformation[0].ps.length; blockIndex++) {
                currentBlock = sectorInformation[0].ps[blockIndex];
                if (sectorInformation[0].i.b[currentBlock[2]] == "INTERACT") {
                    if (typeof interactingData[sectorInformation[0].iix[currentBlock[2]]] === 'undefined') {
                        blockData = await jQuery.ajax({
                            url: "/j/i/def/" + sectorInformation[0].iix[currentBlock[2]],
                            context: null
                        });
                        interactingText = blockData.prop.textData.toLowerCase();
                        /* if you want to only collect info on interactings whose text contains certain substrings
                        uncomment the commented lines */
                        //if (interactingText.includes("/to ") || interactingText.includes("isn't [editor]") || interactingText.includes("is [editor]") || interactingText.includes("/lock ")) {
                            interactingData[sectorInformation[0].iix[currentBlock[2]]] = {
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
                    //if (typeof interactingData[sectorInformation[0].iix[currentBlock[2]]] !== 'undefined') {
                        if (currentBlock[0] !== null && currentBlock[1] !== null) {
                            placerInfo = await jQuery.ajax({
                                url: "/j/m/placer/" + blockPos.x + "/" + blockPos.y + "/" + plane + "/" + areaId,
                                context: null
                            });
                            interactingData[sectorInformation[0].iix[currentBlock[2]]].placements.push({
                                x: blockPos.x, 
                                y: blockPos.y,
                                placerId: placerInfo.id,
                                placerName: placerInfo.name
                            });
                            interactingData[sectorInformation[0].iix[currentBlock[2]]].placementCount++;
                            ig.game.player.say("interacting found!");
                        }
                    //}
                }
            }
        }
    }
    ig.game.player.say("finished gathering interacting information!");    
    consoleref.log(interactingData);
}

getinteractingData();