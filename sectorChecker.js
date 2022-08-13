// to try and find hidden areas in worlds

const delay = async (ms = 1000) =>  new Promise(resolve => setTimeout(resolve, ms));

async function getDeobfuscator() {
    if (typeof Deobfuscator === 'undefined') {
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js");
    }
};

async function checkSectors() {
    await getDeobfuscator();
    ig.game.area = Deobfuscator.object(ig.game,'currentArea',false);
    obfVar = Deobfuscator.object(ig.game,'mnt_P',false);
    currentPlane = Deobfuscator.keyBetween(obfVar.mnt_P,"{p:b.",",a:b.c");
    itemEquip = Deobfuscator.function(ig.game.attachmentManager,'(c);!e&&!a.O',true);
    ig.game.player.kill = function(){};
    sectorArray = [];
    // 50000 seems to be around the max sector chunk size
    sectorChunkSize = 5000;
    sectorChunkArray = [];
    sectorsWithBlocks = [];
    canGoToSector = false;
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
    if (ig.game.isEditorHere && ig.game.area.currentArea == areaId && ig.game.area[currentPlane] == plane) {
        canGoToSector = true;
    }
    // if sector checking a sub area, you can manually change plane and area id here
    // plane = 0;
    // areaId = '5751f6e5a9f43d7e0f6563f2';
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
    if (sectorArray.length > sectorChunkSize) {
        for (let i = 0; i < sectorArray.length; i+= sectorChunkSize) {
            if (i + sectorChunkSize < sectorArray.length) {
                sectorChunkArray.push(sectorArray.slice(i, i + sectorChunkSize));
            } else {
                sectorChunkArray.push(sectorArray.slice(i, sectorArray.length));
            }
        }
    } else {
        sectorChunkArray.push(sectorArray);
    }
    getMount = async function(id) {
        if (typeof ig.game.player.attachments.w == 'undefined' || ig.game.player.attachments?.w === null) {
            ig.game.attachmentManager[itemEquip](ig.game.player,ig.game.attachmentManager.slots.MOUNTABLE,id,null,"MNTAIR");
        } else if (ig.game.player.attachments.w.id != id) {
            ig.game.attachmentManager[itemEquip](ig.game.player,ig.game.attachmentManager.slots.MOUNTABLE,null,null,"MNTAIR");
            await delay(100);
            ig.game.attachmentManager[itemEquip](ig.game.player,ig.game.attachmentManager.slots.MOUNTABLE,id,null,"MNTAIR");
        }
    };
    if (canGoToSector) {
        goToSector = async function(sectorX, sectorY) {
            ig.game.gravity = 0;
            ig.game.player.pos = {
                x: (sectorX * 32 + 15) * 19,
                y: ((sectorY - 2) * 32 + 15) * 19
            };
            while (ig.game.player.pos.y < (sectorY * 32 + 15) * 19) {
                ig.game.player.pos.y += 19;
                await delay(10);
            }
            getMount("62f7193fd83c301ed1cdf131");
            ig.game.gravity = 800;
        }
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
                    }
                });
            } catch (error) {
                ig.game.player.say("failed to load sector. retrying...");
            }
        }
        if (sectorChunkData.length == 0) {
            continue;
        }
        for (sectorIndex = 0; sectorIndex < sectorChunkData.length; sectorIndex++) {
            sectorData = sectorChunkData[sectorIndex];
            if (sectorData.ps.length != 0) {
                sectorX = sectorData.x;
                sectorY = sectorData.y;
                sectorsWithBlocks.push([sectorX,  sectorY]);
            }
        }
    }
    ig.game.player.say(`finished checking sectors! ${sectorsWithBlocks.length} sectors contain blocks.`);
    sectorsWithBlocksSortedByX = [...sectorsWithBlocks].sort((a,b) => a[0] - b[0]);
    sectorsWithBlocksSortedByY = [...sectorsWithBlocks].sort((a,b) => a[1] - b[1]);
    consoleref.log(`sectors with blocks sorted by x: ${JSON.stringify(sectorsWithBlocksSortedByX)}`);
    consoleref.log(`sectors with blocks sorted by y: ${JSON.stringify(sectorsWithBlocksSortedByY)}`);
    if (canGoToSector) {
        consoleref.log('type goToSector(sectorX, sectorY) in console to transport to a sector.');
    }
}

checkSectors();