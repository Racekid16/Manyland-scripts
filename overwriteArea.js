/* script by Tommy3#1626
this script lets you copy blocks placed in a different area and place those blocks in your own area

first specify the area you want to scan
then specify the coordinates of the top left block in the area you want to scan
then specify the coordinates of the bottom right block in the area you want to scan
a rectangular formed by the coordinates you specified will be copied
note: 0,0 corresponds to the area's center location
returns a script to the console that you can copy; pasting it will place all the scanned blocks
must be in https for this to work- otherwise the script can't access your clipboard */

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
    blockDataObj = {};
    sectorCoords = [];
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
    let topLeftCoordsResponse = prompt("Specify the top left coordinates of the section to scan.\n(0 , 0) corresponds with the center of the area you're scanning.", "-100,-100").replaceAll(' ','').split(',').map(Number);
    let topLeftCoords = {
        x: topLeftCoordsResponse[0] + areaData.acl.x,
        y: topLeftCoordsResponse[1] + areaData.acl.y
    };
    let startSector = {
        x: Math.floor(topLeftCoords.x / 32), 
        y: Math.floor(topLeftCoords.y / 32)
    };
    await delay(500);
    let bottomRightCoordsResponse = prompt("Specify the bottom right coordinates of the section to scan.\n(0 , 0) corresponds with the center of the area you're scanning.", "100,100").replaceAll(' ','').split(',').map(Number);
    let bottomRightCoords = {
        x: bottomRightCoordsResponse[0] + areaData.acl.x,
        y: bottomRightCoordsResponse[1] + areaData.acl.y
    };
    let endSector = {
        x: Math.floor(bottomRightCoords.x / 32), 
        y: Math.floor(bottomRightCoords.y / 32)
    };
    if (startSector.x > endSector.x || startSector.y > endSector.y) {
        ig.game.alertDialog.open("<p>invalid coordinates!</p>", true);
        return;
    }
    for (let sectorY = startSector.y; sectorY <= endSector.y; sectorY++) {
        for (let sectorX = startSector.x; sectorX <= endSector.x; sectorX++) {
            sectorCoords.push([sectorX,sectorY]);
        }
    }
    let sectorLoaded = false;
    ig.game.player.say("loading sector data...");
    while (!sectorLoaded) {
        try {
            sectorChunkData = await jQuery.ajax({
                type: "POST",
                url: "/j/m/s/",
                data: {
                    s: JSON.stringify(sectorCoords),
                    p: plane,
                    a: areaId
                },
                timeout: 0,
                success: function() {
                    sectorLoaded = true;
                    ig.game.player.say("sector data loaded!");
                }
            });
        } catch (error) {
            ig.game.player.say("failed to load sector. retrying...");
        }
    }
    for (let sectorIndex = 0; sectorIndex < sectorChunkData.length; sectorIndex++) {
        let sectorData = sectorChunkData[sectorIndex];
        let sectorX = sectorData.x;
        let sectorY = sectorData.y;
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
        blockDataObj[`${sectorX},${sectorY}`] = {};
        for (let blockIndex = 0; blockIndex < sectorData.ps.length; blockIndex++) {
            let currentBlock = sectorData.ps[blockIndex];
            let blockPos = {
                x: currentBlock[0] + 32 * sectorX,
                y: currentBlock[1] + 32 * sectorY
            };
            if (typeof blockDataObj[`${sectorX},${sectorY}`][`${blockPos.x}`] === 'undefined') {
                blockDataObj[`${sectorX},${sectorY}`][`${blockPos.x}`] = [];    
            }
            blockDataObj[`${sectorX},${sectorY}`][`${blockPos.x}`].push([blockPos.y, sectorData.iix[currentBlock[2]], currentBlock[3], currentBlock[4]]);
        }
        for (let key in blockDataObj[`${sectorX},${sectorY}`]) {
            blockDataObj[`${sectorX},${sectorY}`][key].sort((block1, block2) => {
                return block1[0] - block2[0];
            })
        }
    }
    sectorCoords.sort((sector1, sector2) => {
        let sector1X = sector1[0];
        let sector1Y = sector1[1];
        let sector2X = sector2[0];
        let sector2Y = sector2[1];
        if (sector1Y != sector2Y) {
            return sector1Y - sector2Y;
        } else {
            if (sector1Y % 2) {
                return sector1X - sector2X;
            } else {
                return sector2X - sector1X;
            }
        }
    });
    copyText = `
    // if you're only placing a section, you'll input the top left and bottom right coordinates 
    // of that section (right clicking blocks will print their map location to the console)
    // if you stop pasting due to an info rift
    // a new script will be copied to your clipboard that will make you start again at the right place.
    // if you keep getting info rifts increase placeWait
    // if pasting an entire scan, use with a tampermonkey script coded like this:
    /* 
    (async function() {
        setTimeout(async () => {
            if (location.protocol === 'https:') {
                isAuto = true;
                const code = await navigator.clipboard.readText();
                const func = new Function(code);
                func();
            } else {
                ig.game.alertDialog.open("<p>must be in https for auto pasting!</p>", true); 
            }
        }, 3000)
    })(); 
    */
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
        currentPlane = Deobfuscator.keyBetween(ig.game[info].mnt_P,"{p:b.",",a:b.c");
        player = Deobfuscator.object(ig.game, 'screenName', true);
        id = Deobfuscator.keyBetween(ig.game.spawnEntity,']=a);a.','&&(this.');
        goTo = Deobfuscator.function(ig.game.portaller,\`(String(a),ig.game.\${player}.\${id});b||(this.\`,true);
        goToLast = Deobfuscator.function(ig.game.portaller, 'eaGroupName");a&&("elsewhere"==a?this.startEx', true);
        ig.game.player.originalVelFunc = ig.game.player[maxVelFunc];
        ig.Entity.originalCollideFunc = ig.Entity[collideFunc];
        window.Item.prototype.originalPushFunc = window.Item.prototype[pushFunc];
        window.Item.prototype.originalDiagPushFunc = window.Item.prototype[diagPushFunc];
        //credit to Heiho for writing this function
        let getWindowProp = function(){
            window.parent = {};
            for(let i in window){
                if (i[0] == "O") {
                    if(typeof window[i].prototype !== "undefined") {   
                        if(typeof window[i].prototype.deleteThingAt !== "undefined"){
                            return i; 
                        }
                    }
                }
            }
        }
        windowProp = getWindowProp();
        whichSectorsLoadFunc = Deobfuscator.function(window[windowProp].prototype,'"n"===d?(a[0]=',true);
        currentAreaInfo = Deobfuscator.object(ig.game,'currentArea',true);
        sectorPos = Deobfuscator.keyBetween(window[windowProp].prototype[whichSectorsLoadFunc], \`a=[],b=ig.game.\${currentAreaInfo}.\`,'.x,c=ig.game.');
        window[windowProp].prototype.originalSecLoadFunc = window[windowProp].prototype[whichSectorsLoadFunc];
        fillBuildFunc = Deobfuscator.function(ig.game[map], 'length){var a=this.fillBuildQueue.shift', true);
        window[windowProp].prototype.originalFillBuildFunc = window[windowProp].prototype[fillBuildFunc];
        fillDeleteFunc = Deobfuscator.function(ig.game[map], 'length){var a=this.fillDeleteQueue.shift', true);
        window[windowProp].prototype.originalFillDeleteFunc = window[windowProp].prototype[fillDeleteFunc];
        offset = {
            x: ig.game.areaCenterLocation.x - ${areaData.acl.x},
            y: ig.game.areaCenterLocation.y - ${areaData.acl.y}
        }
        scanTopLeftCoords = {
            x: ${topLeftCoords.x},
            y: ${topLeftCoords.y}
        }
        scanBottomRightCoords = {
            x: ${bottomRightCoords.x},
            y: ${bottomRightCoords.y}
        }
        blockDataObj = ${JSON.stringify(blockDataObj)}; 
        sectorCoords = ${JSON.stringify(sectorCoords)};
        startSectorIndex = 0;
        placeHistory = [];
        deleteHistory = [];
        tired = false;
        callCount = 0; 
        placeWait = 35;
        deleteWait = 25;
        initialPlaceWait = placeWait;
        waitForNextBlock = false;
        alreadyGotInfoRift = false;
        alreadyGotPeaceParked = false;
        startTime = Date.now();
        // code removing ad bar. credit to person who wrote that
        $('div').remove();
        ig.system.resize(window.innerWidth, window.innerHeight);
        ig.game.panelSet.init();
        ig.game.camera.init();
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
        async function wait() {
            let initialCallCount = callCount;
            await delay(3000);
            if (callCount == initialCallCount) {
                tired = false;
            }
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
        getWearable = async function(id) {
            if (typeof ig.game.player.attachments.w === 'undefined' || ig.game.player.attachments?.w === null) {
                ig.game.attachmentManager[itemEquip](ig.game.player,ig.game.attachmentManager.slots.WEARABLE,id,null,"STACKWEAR");
            } else if (ig.game.player.attachments.w.id != id) {
                ig.game.attachmentManager[itemEquip](ig.game.player,ig.game.attachmentManager.slots.WEARABLE,null,null,"STACKWEAR");
                await delay(100);
                ig.game.attachmentManager[itemEquip](ig.game.player,ig.game.attachmentManager.slots.WEARABLE,id,null,"STACKWEAR");
            }
        };
        if (window.location.pathname == "/peacepark") {
            lastSectorIndex = startSectorIndex;
            let regex = new RegExp(\`startSectorIndex = \${startSectorIndex}\`);
            let regex3 = /blockDataObj = .+?(?=;)/;
            let regex4 = /sectorCoords = .+?(?=;)/;
            await delay(500);
            previousPaste = await navigator.clipboard.readText();
            newPaste = previousPaste.replace(regex, \`startSectorIndex = \${lastSectorIndex}\`);
            newPaste = newPaste.replace(regex3, \`blockDataObj = \${JSON.stringify(blockDataObj)}\`);
            newPaste = newPaste.replace(regex4, \`sectorCoords = \${JSON.stringify(sectorCoords)}\`);
            await navigator.clipboard.writeText(newPaste);
            ig.game.portaller[goToLast]();
        }
        ig.game.errorManager.kicked = async function(a){
            if (!alreadyGotInfoRift) {
                alreadyGotInfoRift = true;
                lastSectorIndex = scanSectorIndex;
                let regex = new RegExp(\`startSectorIndex = \${startSectorIndex}\`);
                let regex2 = new RegExp(\`placeWait = \${initialPlaceWait}\`);
                let regex3 = /blockDataObj = .+?(?=;)/;
                let regex4 = /sectorCoords = .+?(?=;)/;
                await delay(500);
                previousPaste = await navigator.clipboard.readText();
                newPaste = previousPaste.replace(regex, \`startSectorIndex = \${lastSectorIndex}\`);
                if (Date.now() - startTime < 30000 && placeWait < 50) {
                    newPlaceWait = placeWait + 1;
                } else {
                    newPlaceWait = placeWait;
                }
                newPaste = newPaste.replace(regex2, \`placeWait = \${newPlaceWait}\`);
                newPaste = newPaste.replace(regex3, \`blockDataObj = \${JSON.stringify(blockDataObj)}\`);
                newPaste = newPaste.replace(regex4, \`sectorCoords = \${JSON.stringify(sectorCoords)}\`);
                await navigator.clipboard.writeText(newPaste);
                window.location.reload();
            }
        }
        ig.game.portaller[goTo] = async function(a, b) {
            if (a == "peacepark" && !alreadyGotPeaceParked) {
                alreadyGotPeaceParked = true;
                let regex = new RegExp(\`startSectorIndex = \${startSectorIndex}\`);
                let regex3 = /blockDataObj = .+?(?=;)/;
                let regex4 = /sectorCoords = .+?(?=;)/;
                lastSectorIndex = scanSectorIndex;
                await delay(500);
                previousPaste = await navigator.clipboard.readText();
                newPaste = previousPaste.replace(regex, \`startSectorIndex = \${lastSectorIndex}\`);
                newPaste = newPaste.replace(regex3, \`blockDataObj = \${JSON.stringify(blockDataObj)}\`);
                newPaste = newPaste.replace(regex4, \`sectorCoords = \${JSON.stringify(sectorCoords)}\`);
                await navigator.clipboard.writeText(newPaste);
            } else if (a == "peacepark" && alreadyGotPeaceParked) {
                return;
            }
            window.location.reload();
        }
        window[windowProp].prototype[whichSectorsLoadFunc] = function() {
            let a = [];
            let b = ig.game[currentAreaInfo][sectorPos].x;
            let c = ig.game[currentAreaInfo][sectorPos].y;
            for (let i = 0; i < 3; ++i) {
                for (let j = 0; j < 3; ++j) {
                    a.push([b - 1 + i, c - 1 + j]);
                }
            }
            return a;
        }
        closeDialogs = function() {
            ig.game.writableDialog.close();
            ig.game.readableDialog.close();
            ig.game.mediaDialog.close();
            ig.game.holderDialog.close();
            ig.game.alertDialog.close();
        }
        distanceToNextBlock = function(blockX, blockY) {
            return Math.sqrt(Math.pow(Math.round(ig.game.player.pos.x / 19) - blockX, 2) + Math.pow(Math.round(ig.game.player.pos.y / 19) - blockY, 2));
        }
        binarySearch = function(array, value) {
            if (array.length == 0) {
                return -1;
            }
            let low = 0;
            let high = array.length - 1;
            while (high - low > 1) {
                let mid = Math.floor((high + low) / 2);
                if (array[mid][0] < value) {
                    low = mid + 1;
                } else {
                    high = mid;
                }
            }
            if (array[low][0] == value) {
                return low;
            } else if (array[high][0] == value) {
                return high;
            } else {
                return -1;
            }
        } 
        setInterval(()=> {
            if (placeWait > 2) {
                placeWait--;
            }
        }, 120000)
        if (typeof isAuto !== 'undefined') {
            overwriteArea();
        } else {
            wantsPasteAll = confirm("Would you like to paste the entire scan ('OK') or just a partial section ('Cancel')?");
            if (wantsPasteAll) {
                overwriteArea()
            } else {
                ig.game.alertDialog.open("<p>type javascript:paste_section() in the url to place the scanned blocks.</p>", true); 
            }
        }
    }
    
    window.paste_section = async function() {
        //function for placing a specific part of the scan
        //in a <= x <= b and c <= y <= d
        topLeftCoordsResponse = prompt("Specify the top left coordinates of the section to paste", "-100,-100").replaceAll(' ','').split(',').map(Number);
        let a = topLeftCoordsResponse[0] - offset.x;
        let c = topLeftCoordsResponse[1] - offset.y;
        await delay(500);
        bottomRightCoordsResponse = prompt("Specify the bottom right coordinates of the section to paste", "100,100").replaceAll(' ','').split(',').map(Number);
        let b = bottomRightCoordsResponse[0] - offset.x;
        let d = bottomRightCoordsResponse[1] - offset.y;
        scanTopLeftCoords.x = a;
        scanTopLeftCoords.y = c;
        scanBottomRightCoords.x = b;
        scanBottomRightCoords.y = d;
        if (b <= a || d <= c) {
            ig.game.alertDialog.open("<p>invalid coordinates!</p>", true);
        }
        sectionStartSector = {
            x: Math.floor(a / 32), 
            y: Math.floor(c / 32)
        }
        sectionEndSector = {
            x: Math.floor(b / 32), 
            y: Math.floor(d / 32)
        }
        sectorCoords = sectorCoords.filter((coords) => {
            let sectorX = coords[0];
            let sectorY = coords[1];
            return sectorX >= sectionStartSector.x && sectorY >= sectionStartSector.y && sectorX <= sectionEndSector.x && sectorY <= sectionEndSector.y;
        })
        for (let sector of sectorCoords) {
            if (typeof blockDataObj[sector] !== 'undefined') {
                let sectorX = sector[0];
                let sectorY = sector[1];
                if (sectorX * 32 < a) {
                    let xCoors = Object.keys(blockDataObj[sector]);
                    for (let key of xCoors) {
                        let xCoor = parseInt(key, 10);
                        if (xCoor < a) {
                            delete blockDataObj[sector][key];
                        }
                    }
                }
                if ((sectorX + 1) * 32 - 1 > b) {
                    let xCoors = Object.keys(blockDataObj[sector]);
                    for (let key of xCoors) {
                        let xCoor = parseInt(key, 10);
                        if (xCoor > b) {
                            delete blockDataObj[sector][key];
                        }
                    }
                }
                if (sectorY * 32 < c) {
                    for (let key in blockDataObj[sector]) {
                        blockDataObj[sector][key] = blockDataObj[sector][key].filter((blockInfo) => blockInfo[0] >= c);
                    }
                }
                if ((sectorY + 1) * 32 - 1 > d) {
                    for (let key in blockDataObj[sector]) {
                        blockDataObj[sector][key] = blockDataObj[sector][key].filter((blockInfo) => blockInfo[0] <= d);
                    }
                }
            }
        }
        overwriteArea();    
    }
    
    let overwriteArea = async function() {
        ig.game.gravity = 0;
        ig.game.player[maxVelFunc] = function() {
            this.maxVel.x = 0;
            this.maxVel.y = 0;
        };
        ig.Entity[collideFunc] = function(){};
        window.Item.prototype[pushFunc] = function(){return false};
        window.Item.prototype[diagPushFunc] = function(){return false};
        window[windowProp].prototype[fillBuildFunc] = function() {this.fillBuildQueue.length = 0}
        window[windowProp].prototype[fillDeleteFunc] = function() {this.fillDeleteQueue.length = 0}
        closeDialogInterval = setInterval(closeDialogs, 3000);
        getWearable("63875dc578c24f5ad14dad37");
        ig.game.settings.glueWearable = true;
        let currentBlock;
        let destSectorData;
        //scanSectorIndex intentionally global
        for (scanSectorIndex = startSectorIndex; scanSectorIndex < sectorCoords.length; scanSectorIndex++) {
            //delete stage
            let scanSectorX = sectorCoords[scanSectorIndex][0];
            let scanSectorY = sectorCoords[scanSectorIndex][1];
            let scanMinX = scanSectorX * 32 < scanTopLeftCoords.x ? scanTopLeftCoords.x : scanSectorX * 32;
            let scanMinY = scanSectorY * 32 < scanTopLeftCoords.y ? scanTopLeftCoords.y : scanSectorY * 32;
            let scanMaxX = scanSectorX * 32 + 31 > scanBottomRightCoords.x ? scanBottomRightCoords.x : scanSectorX * 32 + 31;
            let scanMaxY = scanSectorY * 32 + 31 > scanBottomRightCoords.y ? scanBottomRightCoords.y : scanSectorY * 32 + 31;
            let scanSectorTopLeftCoords =     [scanMinX, scanMinY]; 
            let scanSectorTopRightCoords =    [scanMaxX, scanMinY];
            let scanSectorBottomLeftCoords =  [scanMinX, scanMaxY];
            let scanSectorBottomRightCoords = [scanMaxX, scanMaxY];
            let scanSectorCorners = [scanSectorTopLeftCoords, scanSectorTopRightCoords, scanSectorBottomLeftCoords, scanSectorBottomRightCoords];
            let destSectors = new Set();
            for (let corner of scanSectorCorners) {
                destSectors.add(\`[\${Math.floor((corner[0] + offset.x) / 32)},\${Math.floor((corner[1] + offset.y) / 32)}]\`);
            }
            let requestSectors = [];
            for (let el of destSectors) {
                requestSectors.push(JSON.parse(el))
            }
            let sectorLoaded = false;
            while (!sectorLoaded) {
                try {
                    destSectorData = await jQuery.ajax({
                        type: "POST",
                        url: "/j/m/s/",
                        data: {
                            s: JSON.stringify(requestSectors),
                            p: ig.game[currentAreaInfo][currentPlane],
                            a: ig.game[currentAreaInfo].currentArea
                        },
                        timeout: 0,
                        success: function() {
                            sectorLoaded = true;
                        }
                    });
                } catch (error) {
                    ig.game.player.say("failed to load sector. retrying...");
                }
            }
            for (let i = 0; i < destSectorData.length; i++) {
                destSectorX = destSectorData[i].x;
                destSectorY = destSectorData[i].y;
                destSectorData[i].ps = destSectorData[i].ps.filter(block => block[0] !== null && block[1] !== null && block[2] !== null && block[3] !== null && block[4] !== null);
                if (destSectorX * 32 < scanMinX + offset.x) {
                    destSectorData[i].ps = destSectorData[i].ps.filter(block => block[0] + 32 * destSectorX >= scanMinX + offset.x);
                }
                if ((destSectorX + 1) * 32 - 1 > scanMaxX + offset.x) {
                    destSectorData[i].ps = destSectorData[i].ps.filter(block => block[0] + 32 * destSectorX <= scanMaxX + offset.x);
                }
                if (destSectorY * 32 < scanMinY + offset.y) {
                    destSectorData[i].ps = destSectorData[i].ps.filter(block => block[1] + 32 * destSectorY >= scanMinY + offset.y);
                }
                if ((destSectorY + 1) * 32 - 1 > scanMaxY + offset.y) {
                    destSectorData[i].ps = destSectorData[i].ps.filter(block => block[1] + 32 * destSectorY <= scanMaxY + offset.y);
                }
            }
            let blockDeleted = false;
            let dontPlace = new Set();
            for (let destSectorIndex = 0; destSectorIndex != destSectorData.length; ++destSectorIndex) {
                let destSectorX = destSectorData[destSectorIndex].x;
                let destSectorY = destSectorData[destSectorIndex].y;
                for (let blockIndex = 0; blockIndex < destSectorData[destSectorIndex].ps.length; blockIndex++) {
                    let destBlockPos = {};
                    if (!tired) {
                        currentBlock = destSectorData[destSectorIndex].ps[blockIndex];
                        destBlockPos.x = currentBlock[0] + 32 * destSectorX;
                        destBlockPos.y = currentBlock[1] + 32 * destSectorY;
                        let scanBlockPos = {
                            x: destBlockPos.x - offset.x,
                            y: destBlockPos.y - offset.y
                        }
                        let sectorKey = \`\${scanSectorX},\${scanSectorY}\`;
                        let colKey = \`\${scanBlockPos.x}\`;
                        let scanBlockIndex;
                        if (typeof blockDataObj[sectorKey] === 'undefined'   //no blocks in scan sector
                        || typeof blockDataObj[sectorKey][colKey] === 'undefined'   //no blocks in col in scan sector
                        || (scanBlockIndex = binarySearch(blockDataObj[sectorKey][colKey], scanBlockPos.y)) == -1   //no block in pos in scan sector
                        || blockDataObj[sectorKey][colKey][scanBlockIndex][1] != destSectorData[destSectorIndex].iix[currentBlock[2]]) {     //block there but id is different
                            if (blockIndex == 0) {
                                waitForNextBlock = true;
                            }
                            ig.game.player.pos = {
                                x: destBlockPos.x * 19, 
                                y: destBlockPos.y * 19
                            };
                            if (waitForNextBlock) {
                                if (distanceToNextBlock(destBlockPos.x, destBlockPos.y) > 32) {
                                    await delay(3000);
                                } else {
                                    await delay(1000);
                                }
                                waitForNextBlock = false;
                            }
                            ig.game[map].deleteThingAt(destBlockPos.x, destBlockPos.y);
                            blockDeleted = true;
                            deleteHistory.push([scanSectorIndex, destSectorIndex, blockIndex, currentBlock]);
                            if (deleteHistory.length > 20) {
                                deleteHistory.shift();
                            }
                            await delay(deleteWait);
                            ig.game[map].deleteThingAt(destBlockPos.x, destBlockPos.y);
                        } else {
                            dontPlace.add(\`\${scanBlockPos.x},\${scanBlockPos.y}\`);
                        }
                    } else {
                        if (destSectorIndex != deleteHistory[0][0]) {
                            if (distanceToNextBlock(currentBlock[0] + 32 * destSectorX, currentBlock[1] + destSectorY) > 46) {
                                waitForNextBlock = true;
                            }
                        }
                        scanSectorIndex = deleteHistory[0][0];
                        destSectorIndex = deleteHistory[0][1];
                        blockIndex = deleteHistory[0][2];
                        currentBlock = deleteHistory[0][3];
                        destSectorX = destSectorData[destSectorIndex].x;
                        destSectorY = destSectorData[destSectorIndex].y;
                        destBlockPos.x = currentBlock[0] + 32 * destSectorX;
                        destBlockPos.y = currentBlock[1] + 32 * destSectorY;
                        ig.game.player.pos = {
                            x: destBlockPos.x * 19,
                            y: destBlockPos.y * 19
                        };
                        if (waitForNextBlock) {
                            await delay(2000);
                            waitForNextBlock = false;
                        }
                        ig.game[map][place]("59ff6c69c2928463131dbf69", 0, 0, {x: destBlockPos.x, y: destBlockPos.y}, null, !0);
                        await delay(500);
                    }
                }
            }
            //place stage
            if (typeof blockDataObj[sectorCoords[scanSectorIndex]] !== 'undefined') {
                if (blockDeleted) {
                    await delay(1000);
                }
                let xCoors = Object.keys(blockDataObj[sectorCoords[scanSectorIndex]]);
                for (let xCoorIndex = 0; xCoorIndex < xCoors.length; xCoorIndex++) {
                    let xCoor = parseInt(xCoors[xCoorIndex], 10);
                    for (let blockIndex = 0; blockIndex < blockDataObj[sectorCoords[scanSectorIndex]][xCoors[xCoorIndex]].length; blockIndex++) {
                        currentBlock = blockDataObj[sectorCoords[scanSectorIndex]][xCoors[xCoorIndex]][blockIndex];
                        let yCoor = currentBlock[0];
                        if (!dontPlace.has(\`\${xCoor},\${yCoor}\`)) {
                            if (!tired) {
                                if (distanceToNextBlock(xCoor + offset.x, yCoor + offset.y) > 46) {
                                    waitForNextBlock = true;
                                }
                                ig.game.player.pos = {
                                    x: (xCoor + offset.x) * 19,
                                    y: (yCoor + offset.y) * 19
                                };
                                if (waitForNextBlock) {
                                    await delay(2000);
                                    waitForNextBlock = false;
                                }
                                ig.game[map][place](currentBlock[1], currentBlock[2], currentBlock[3], {x: xCoor + offset.x, y: yCoor + offset.y}, null, !0);
                                placeHistory.push([scanSectorIndex, xCoorIndex, blockIndex, currentBlock]);
                                if (placeHistory.length > 20) {
                                    placeHistory.shift();
                                }
                                await delay(placeWait);
                            } else {
                                scanSectorIndex = placeHistory[0][0];
                                xCoorIndex = placeHistory[0][1];
                                blockIndex = placeHistory[0][2];
                                currentBlock = placeHistory[0][3];
                                xCoors = Object.keys(blockDataObj[sectorCoords[scanSectorIndex]]);
                                xCoor = parseInt(xCoors[xCoorIndex], 10);
                                yCoor = currentBlock[0];
                                if (distanceToNextBlock(xCoor + offset.x, yCoor + offset.y) > 46) {
                                    waitForNextBlock = true;
                                }
                                ig.game.player.pos = {
                                    x: (xCoor + offset.x) * 19,
                                    y: (yCoor + offset.y) * 19
                                };
                                if (waitForNextBlock) {
                                    await delay(2000);
                                    waitForNextBlock = false;
                                }
                                ig.game[map].deleteThingAt(xCoor + offset.x, yCoor + offset.y);
                                await delay(100);
                                ig.game[map][place](placeHistory[0][3][1], placeHistory[0][3][2], placeHistory[0][3][3], {x: xCoor + offset.x, y: yCoor + offset.y}, null, !0);
                                await delay(400);
                            }
                        }
                    }
                }
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
        window[windowProp].prototype[whichSectorsLoadFunc] = window[windowProp].prototype.originalSecLoadFunc;
        window[windowProp].prototype[fillBuildFunc] = window[windowProp].prototype.originalFillBuildFunc; 
        window[windowProp].prototype[fillDeleteFunc] = window[windowProp].prototype.originalFillDeleteFunc;
        clearInterval(closeDialogInterval);
        ig.game.settings.glueWearable = false;
        getWearable(null);
        blockDataObj.length = 0;
        await delay(1000);
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
        ig.game.alertDialog.open("<p>finished scanning! copy block data from the console and change to https.</p>", true); 
        consoleref.log(copyText);
    }
}

scanArea();
