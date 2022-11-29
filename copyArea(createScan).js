// directly requests block data from the server- much faster
// first specify the area you want to scan
// then specify the coordinates of the top left block in the area you want to scan
// then specify the coordinates of the bottom right block in the area you want to scan
// a rectangular formed by the coordinates you specified will be copied
// note: 0,0 corresponds to the area's center location
// returns a script to the console that you can copy; pasting it will place all the scanned blocks
// if sectors keep failing to load, decrease the value of sectorChunkSize.

const delay = async (ms = 1000) =>  new Promise(resolve => setTimeout(resolve, ms));

async function getDeobfuscator() {
    if (typeof Deobfuscator === 'undefined') {
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js");
    }
};

async function scanArea() {
    await getDeobfuscator();
    sectorStartX = 0;
    sectorStartY = 0;
    placeArr = [];
    sectorArray = [];
    sectorChunkSize = 64;
    minChunkSize = 8;
    maxChunkSize = 512;
    area = prompt("Enter the name of the area you'd like to scan: ","3").replace(/\s+/g, '');
    if (area == '1' || area == '2' || area == '3' || area == '4' || area == '5' || area == '6' || area == '7' || area == '8') {
        plane = 1;
        area = parseInt(area);
        areaId = area;
    } else if (area == 'inner ring') {
        plane = 2;
        area = 1;
        areaId = 1;
    } else {
        plane = 0;
    }
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
        ig.game.alertDialog.open("<p>invalid area name!</p>", true);
        return;
    }
    if (plane == 0) {
        areaId = areaData.aid;
    }
    await delay(500);
    topLeftCoordsResponse = prompt("Specify the top left coordinates of the section to scan", "-100,-100").replaceAll(' ','').split(',').map(Number);
    topLeftCoords = {
        x: topLeftCoordsResponse[0] + areaData.acl.x,
        y: topLeftCoordsResponse[1] + areaData.acl.y
    };
    startSector = {
        x: Math.floor(topLeftCoords.x / 32), 
        y: Math.floor(topLeftCoords.y / 32)
    };
    await delay(500);
    bottomRightCoordsResponse = prompt("Specify the bottom right coordinates of the section to scan", "100,100").replaceAll(' ','').split(',').map(Number);
    bottomRightCoords = {
        x: bottomRightCoordsResponse[0] + areaData.acl.x,
        y: bottomRightCoordsResponse[1] + areaData.acl.y
    };
    //TODO: calculate offset here
    endSector = {
        x: Math.floor(bottomRightCoords.x / 32), 
        y: Math.floor(bottomRightCoords.y / 32)
    };
    if (startSector.x > endSector.x || startSector.y > endSector.y) {
        ig.game.alertDialog.open("<p>invalid coordinates!</p>", true);
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
                currentBlock = sectorData.ps[blockIndex];
                blockPos = {
                    x: currentBlock[0] + 32 * sectorX,
                    y: currentBlock[1] + 32 * sectorY
                };
                placeArr.push([blockPos.x, blockPos.y, sectorData.iix[currentBlock[2]], currentBlock[3], currentBlock[4]]);
            }
        }      
    }
    copyText = `
// if you're only placing a section, you'll input the top left and bottom right coordinates 
// of that section (right clicking blocks will print their map location to the console)
// if you stop pasting due to an info rift
// a new script will be copied to your clipboard that will make you start again at the right place.
// if you keep getting info rifts increase placeWait
const delay = async (ms = 1000) =>  new Promise(resolve => setTimeout(resolve, ms));

async function getDeobfuscator() {
    if (typeof Deobfuscator === 'undefined') {
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js");
    }
};

async function init() {
    await getDeobfuscator();
    ig.game.player.kill = function(){};
    map = Deobfuscator.object(ig.game,'queuePerformDelayMs',true);
    place = Deobfuscator.function(ig.game[map],'n:b||0,flip:c},d,!',true);
    itemEquip = Deobfuscator.function(ig.game.attachmentManager,'(c);!e&&!a.O',true);
    maxVelFunc = Deobfuscator.function(ig.game.player, '.x;this.maxVel.y=this.', true);
    collideFunc = Deobfuscator.function(ig.Entity,'&&b instanceof EntityCrumbling||b.',true);
    pushFunc = Deobfuscator.function(window.Item.prototype,'Item.prototype.BASE_TYPES[this.base]==Item.prototype.BASE_TYPES.PUSH',true);
    diagPushFunc = Deobfuscator.function(window.Item.prototype,'Item.prototype.BASE_TYPES[this.base]==Item.prototype.BASE_TYPES.PUSHDIAG',true);
    info = Deobfuscator.object(ig.game,'mnt_P',true);
    player = Deobfuscator.object(ig.game, 'screenName', true);
    id = Deobfuscator.keyBetween(ig.game.spawnEntity,']=a);a.','&&(this.');
    goTo = Deobfuscator.function(ig.game.portaller,\`(String(a),ig.game.\${player}.\${id});b||(this.\`,true);
    ig.game.player.originalVelFunc = ig.game.player[maxVelFunc];
    ig.Entity.originalCollideFunc = ig.Entity[collideFunc];
    window.Item.prototype.originalPushFunc = window.Item.prototype[pushFunc];
    window.Item.prototype.originalDiagPushFunc = window.Item.prototype[diagPushFunc];
    ig.game.errorManager.originalKickedFunc = ig.game.errorManager.kicked;
    originalPortallerFunction = ig.game.portaller[goTo];
    offset = {
        x: ig.game.areaCenterLocation.x - ${areaData.acl.x},
        y: ig.game.areaCenterLocation.y - ${areaData.acl.y}
    }
    placeArr = ${JSON.stringify(placeArr)}; 
    placeHistory = [];
    tired = false;
    callCount = 0; 
    placeWait = 35;
    startBlockIndex = 0;
    waitForNextBlock = false;
    alreadyGotInfoRift = false;
    alreadyGotPeaceParked = false;
    $('div').remove();
    ig.system.resize(window.innerWidth, window.innerHeight);
    ig.game.panelSet.init();
    ig.game.camera.init();
    setInterval(() => {
        playerPos = {
            x: Math.round(ig.game.player.pos.x / 19),
            y: Math.round(ig.game.player.pos.y / 19)
        }
    }, 0);
    await delay(100);
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
    ig.game[info].getItemStats_P = function(a) {   
        selectedBlock = Deobfuscator.object(ig.game.itemContextMenu,'rotation',false);  
        if (typeof selectedBlock !== 'undefined') {
            if (selectedBlock.thing?.name !== null) {
                consoleref.log(\`blockName: \${selectedBlock.thing.name}, mapLoc: {\${ig.game.itemContextMenu.maploc.x} , \${ig.game.itemContextMenu.maploc.y}}\`);
            }
        }
        return jQuery.ajax({
            url: "/j/i/st/" + a
        })
    }
    async function wait() {
        let initialCallCount = callCount;
        await delay(3000);
        if (callCount == initialCallCount) {
            tired = false;
        }
    }
    getWearable = async function(id) {
        if (typeof ig.game.player.attachments.w == 'undefined' || ig.game.player.attachments?.w === null) {
            ig.game.attachmentManager[itemEquip](ig.game.player,ig.game.attachmentManager.slots.WEARABLE,id,null,"STACKWEAR");
        } else if (ig.game.player.attachments.w.id != id) {
            ig.game.attachmentManager[itemEquip](ig.game.player,ig.game.attachmentManager.slots.WEARABLE,null,null,"STACKWEAR");
            await delay(100);
            ig.game.attachmentManager[itemEquip](ig.game.player,ig.game.attachmentManager.slots.WEARABLE,id,null,"STACKWEAR");
        }
    };
    ig.game.errorManager.kicked = async function(a){
        if (!alreadyGotInfoRift) {
            alreadyGotInfoRift = true;
            if (blockIndex > 10) {
                let regex = new RegExp(\`startBlockIndex = \${startBlockIndex}\`);
                lastBlockIndex = blockIndex - 10;
                alert("You got an info rift. Click 'OK', and an updated script will be copied to your clipboard.");
                await delay(500);
                previousPaste = await navigator.clipboard.readText();
                newPaste = previousPaste.replace(regex, \`startBlockIndex = \${lastBlockIndex}\`);
                navigator.clipboard.writeText(newPaste);
            }
            ig.game.errorManager.originalKickedFunc(a);
        }
    }
    ig.game.portaller[goTo] = async function(a, b) {
        if (a == "peacepark" && !alreadyGotPeaceParked && blockIndex > 10) {
            alreadyGotPeaceParked = true;
            let regex = new RegExp(\`startBlockIndex = \${startBlockIndex}\`);
            lastBlockIndex = blockIndex - 10;
            alert("You got an peace parked. Click 'OK', and an updated script will be copied to your clipboard.");
            await delay(500);
            previousPaste = await navigator.clipboard.readText();
            newPaste = previousPaste.replace(regex, \`startBlockIndex = \${lastBlockIndex}\`);
            navigator.clipboard.writeText(newPaste);
        }
        originalPortallerFunction(a, b);
    }
    distanceToNextBlock = function(blockX, blockY) {
        return Math.sqrt(Math.pow(playerPos.x - blockX, 2) + Math.pow(playerPos.y - blockY, 2));
    };
    let wantsPasteAll = confirm("Would you like to paste the entire scan ('OK') or just a partial section ('Cancel')?");
    if (wantsPasteAll) {
        pasteArea()
    } else {
        ig.game.alertDialog.open("<p>type javascript:paste_section() in the url to place the scanned blocks.</p>", true); 
    }
}

async function paste_section() {
    //function for placing a specific part of the scan
    //in a <= x <= b and c <= y <= d
    topLeftCoordsResponse = prompt("Specify the top left coordinates of the section to paste", "-100,-100").replaceAll(' ','').split(',').map(Number);
    let a = topLeftCoordsResponse[0];
    let c = topLeftCoordsResponse[1];
    await delay(500);
    bottomRightCoordsResponse = prompt("Specify the bottom right coordinates of the section to paste", "100,100").replaceAll(' ','').split(',').map(Number);
    let b = bottomRightCoordsResponse[0];
    let d = bottomRightCoordsResponse[1];
    if (b <= a || d <= c) {
        ig.game.alertDialog.open("<p>invalid coordinates!</p>", true);
    }
    placeArr = placeArr.filter((blockInfo) => blockInfo[0] + offset.x >= a && blockInfo[0] + offset.x <= b && blockInfo[1] + offset.y >= c && blockInfo[1] + offset.y <= d);
    pasteArea();    
}

let pasteArea = async function() {
    ig.game.gravity = 0;
    ig.game.player[maxVelFunc] = function() {
        this.maxVel.x = 0;
        this.maxVel.y = 0;
    };
    ig.Entity[collideFunc] = function(){};
    window.Item.prototype[pushFunc] = function(){return false};
    window.Item.prototype[diagPushFunc] = function(){return false};
    getWearable("62b5eba64b4994128421214a");
    ig.game.settings.glueWearable = true;
    ig.game.player.pos.x = (placeArr[startBlockIndex][0] + offset.x) * 19;
    ig.game.player.pos.y = (placeArr[startBlockIndex][1] + offset.y) * 19;
    await delay(2000);
    for (blockIndex = startBlockIndex; blockIndex < placeArr.length; blockIndex++) {
        if (!tired) {
            if (distanceToNextBlock(placeArr[blockIndex][0] + offset.x, placeArr[blockIndex][1] + offset.y) > 60) {
                waitForNextBlock = true;
            }
            ig.game.player.pos.x = (placeArr[blockIndex][0] + offset.x) * 19;
            ig.game.player.pos.y = (placeArr[blockIndex][1] + offset.y) * 19;
            if (waitForNextBlock) {
                await delay(2000);
                waitForNextBlock = false;
            }
            ig.game[map][place](placeArr[blockIndex][2], placeArr[blockIndex][3], placeArr[blockIndex][4], {x: placeArr[blockIndex][0] + offset.x, y: placeArr[blockIndex][1] + offset.y}, null, !0);
            placeHistory.push([blockIndex, placeArr[blockIndex]]);
            if (placeHistory.length > 20) {
                placeHistory.shift();
            }
            await delay(placeWait);
        } else {
            blockIndex = placeHistory[0][0];
            if (distanceToNextBlock(placeArr[blockIndex][0] + offset.x, placeArr[blockIndex][1] + offset.y) > 60) {
                waitForNextBlock = true;
            }
            ig.game.player.pos.x = (placeHistory[0][1][0] + offset.x) * 19;
            ig.game.player.pos.y = (placeHistory[0][1][1] + offset.y) * 19;
            if (waitForNextBlock) {
                await delay(2000);
                waitForNextBlock = false;
            }
            ig.game[map].deleteThingAt(placeHistory[0][1][0], placeHistory[0][1][1]);
            await delay(100);
            ig.game[map][place](placeHistory[0][1][2], placeHistory[0][1][3], placeHistory[0][1][4], {x: placeHistory[0][1][0] + offset.x, y: placeHistory[0][1][1] + offset.y}, null, !0);
            await delay(400);
        }
    }
    stopPasting();
}

async function stopPasting() {
    ig.game.gravity = 800;
    ig.game.player[maxVelFunc] = ig.game.player.originalVelFunc;
    ig.Entity[collideFunc] = ig.Entity.originalCollideFunc;
    window.Item.prototype[pushFunc] = window.Item.prototype.originalPushFunc;
    window.Item.prototype[diagPushFunc] = window.Item.prototype.originalDiagPushFunc;
    ig.game.settings.glueWearable = false;
    getWearable(null);
    await delay(1000);
    placeArr.length = 0;
    ig.game.alertDialog.open("<p>finished placing!</p>", true); 
}

init();`;
    if (location.protocol === 'https:') {
        navigator.clipboard.writeText(copyText).then(function() {
            ig.game.alertDialog.open("<p>finished scanning! block data copied to clipboard.</p>", true); 
        }, 
        function() {
            ig.game.alertDialog.open("<p>finished scanning! could not copy data. manually copy block data from the console.</p>", true); 
            consoleref.log(copyText);
        });
    } else {
        ig.game.alertDialog.open("<p>finished scanning! copy block data from the console.</p>", true); 
        consoleref.log(copyText);
    }
}

scanArea();
