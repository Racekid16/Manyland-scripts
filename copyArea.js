// scans the specified area.
// once done scanning, a script is copied to your clipboard that will place the scanned blocks when executed.
// if you're not in https, manually copy the script from the console.
// alt+click a block to add it as a vertex.
// alt+s to start/stop scanning the area.
// optionally scan a circle (alt+c) or rectangle (alt+r) of the specified dimensions
// if you specified a concave shape, it may scan extra blocks.
// added optimizations to prevent getting moved by pushings, transportings, and solid dynamics/interactings.

const delay = async (ms = 1000) =>  new Promise(resolve => setTimeout(resolve, ms));

async function getDeobfuscator() {
    if (typeof Deobfuscator === 'undefined') {
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js");
    }
};

async function init() {
    await getDeobfuscator();
    ig.game.area = Deobfuscator.object(ig.game,'currentArea',false);
    obfVar = Deobfuscator.object(ig.game,'mnt_P',false);
    areaType = Deobfuscator.keyBetween(obfVar.mnt_P,"{p:b.",",a:b.c");
    itemEquip = Deobfuscator.function(ig.game.attachmentManager,'(c);!e&&!a.O',true);
    maxVelFunc = Deobfuscator.function(ig.game.player, '.x;this.maxVel.y=this.', true);
    originalVelFunc = ig.game.player[maxVelFunc];
    // can do ig.game.area.currentArea = (areaId) if you want to scan an area without people seeing you
    // and do ig.game.area.currentArea = originalArea to change it back
    // if you do this and the area is the inner or an outer ring, also do ig.game.area[areaType] = 1 into console.
    originalArea = ig.game.area.currentArea;
    originalAreaType = ig.game.area[areaType];
    ig.game.player.kill = function(){};
    edgeArr = []; edgeArrOrganizedByY = []; placeArr = []; areaSize = [];
    toggling = false; currentlyScanning = false;
    callCount = 0; minY = Infinity; maxY = -Infinity; height = 0; startX = 0; startY = 0; 
    bottomLeftXOffset = 0; bottomRightXOffset = 0; topRightXOffset = 0; centerXOffset = 0;
    moveWait = 25; 
    blockId = ""; blockRotaiton = 0; blockFlip = 0;
    suggestedPos = "";
    // removes the ad bar
    $('div').remove();
    ig.system.resize(window.innerWidth, window.innerHeight);
    ig.game.panelSet.init();
    ig.game.camera.init();
    addVertex = async function(x, y, wantsFeedback) {
        edgeArr.push([x, y]);
        if (wantsFeedback) {
            ig.game.player.say("vertex added to shape!");
        }
        if (y > maxY) {maxY = y;}
        if (y < minY) {minY = y;}
    };
    info = Deobfuscator.object(ig.game,'mnt_P',true);
    ig.game[info].getItemStats_P = function(a) {
        if (ig.input.state("alt")) {
            alreadyInEdgeArr = false;
            blockX = ig.game.itemContextMenu.maploc.x;
            blockY = ig.game.itemContextMenu.maploc.y;
            for (let i = 0; i < edgeArr.length; i++) {
                if (edgeArr[i][0] == blockX && edgeArr[i][1] == blockY) {
                    alreadyInEdgeArr = true;
                }
            }
            if (!alreadyInEdgeArr) {
                addVertex(blockX, blockY, true);
            }
        }
        return jQuery.ajax({
            url: "/j/i/st/" + a
        });
    };
    getWearable = async function(id) {
        if (typeof ig.game.player.attachments.w == 'undefined' || ig.game.player.attachments?.w === null) {
            ig.game.attachmentManager[itemEquip](ig.game.player,ig.game.attachmentManager.slots.WEARABLE,id,null,"STACKWEAR");
        } else if (ig.game.player.attachments.w.id != id) {
            ig.game.attachmentManager[itemEquip](ig.game.player,ig.game.attachmentManager.slots.WEARABLE,null,null,"STACKWEAR");
            await delay(100);
            ig.game.attachmentManager[itemEquip](ig.game.player,ig.game.attachmentManager.slots.WEARABLE,id,null,"STACKWEAR");
        }
    };
    setInterval(() => {
        playerPos = {
            x: Math.round(ig.game.player.pos.x / 19),
            y: Math.round(ig.game.player.pos.y / 19)
        }
        if (ig.input.state("alt") && ig.input.pressed("s") && edgeArr.length > 0 && !toggling){
            toggling = true;
            setTimeout(() => {
                if (currentlyScanning) {
                    stopScanning();
                    ig.game.player.say("canceled scanning!");
                } else {
                    suggestedPos = "bottom left";
                    createEdges();
                    ig.game.player.say("shape finished! now scanning.")
                }
                toggling = false;
            }, 500)
        }
        if (ig.input.state("alt") && ig.input.pressed("c") && !currentlyScanning && !toggling) {
            toggling = true;
            setTimeout(() => {
                edgeArr.length = 0;
                radius = Math.round(Number(prompt("Enter the radius of the circle you want to scan.\nYour current position will be the circle's center.", `100`)));
                centerX = playerPos.x;
                centerY = playerPos.y;
                for (let y = Math.ceil(-radius/Math.sqrt(2)); y < Math.floor(radius/Math.sqrt(2)); y++) {
                    let x = -Math.round(Math.sqrt(Math.pow(radius, 2) - Math.pow(y, 2)));
                    addVertex(x + centerX, y + centerY, false);
                }
                for (let x = Math.ceil(-radius/Math.sqrt(2)); x < Math.floor(radius/Math.sqrt(2)); x++) {
                    let y = Math.round(Math.sqrt(Math.pow(radius, 2) - Math.pow(x, 2)));
                    addVertex(x + centerX, y + centerY, false);
                }
                for (let y = Math.floor(radius/Math.sqrt(2)); y > Math.ceil(-radius/Math.sqrt(2)); y--) {
                    let x = Math.round(Math.sqrt(Math.pow(radius, 2) - Math.pow(y, 2)));
                    addVertex(x + centerX, y + centerY, false);
                }
                for (let x = Math.floor(radius/Math.sqrt(2)); x > Math.ceil(-radius/Math.sqrt(2)); x--) {
                    let y = -Math.round(Math.sqrt(Math.pow(radius, 2) - Math.pow(x, 2)));
                    addVertex(x + centerX, y + centerY, false);
                }
                suggestedPos = "center";
                createEdges();
                ig.game.player.say("circle created! now scanning.");
                toggling = false;
            }, 500)
        }
        if (ig.input.state("alt") && ig.input.pressed("r") && !currentlyScanning && !toggling) {
            toggling = true;
            setTimeout(() => {
                edgeArr.length = 0;
                areaSize = prompt("Enter the dimensions of the rectangle you want to scan.\nValues can be negative.\n(width,height)",`100,100`).split(',').map(Number);
                if (areaSize[0] > 0 && areaSize[1] > 0) {
                    suggestedPos = "bottom left";
                } else if (areaSize[0] < 0 && areaSize[1] > 0) {
                    suggestedPos = "bottom right";
                } else if (areaSize[0] > 0 && areaSize[1] < 0) {
                    suggestedPos = "top left";
                } else {
                    suggestedPos = "top right";                        
                }
                // in this case centerX and centerY are not really the center of the rectangle, just didn't wanna make a new variable.
                centerX = playerPos.x;
                centerY = playerPos.y;
                addVertex(centerX, centerY - areaSize[1], false);
                addVertex(centerX + areaSize[0], centerY - areaSize[1], false);
                addVertex(centerX + areaSize[0], centerY, false);
                addVertex(centerX, centerY, false);
                createEdges();
                ig.game.player.say("rectangle created! now scanning.");
                toggling = false;
            }, 500)
        }
    }, 0);
}

function createEdges() {
    height = maxY - minY + 1;
    const numEdges = edgeArr.length;
    edgeArr.push(edgeArr[0]);
    // basically makes a line from each vertex to its next vertex
    for (let i = 0; i < numEdges; i++) {
        if (Math.abs((edgeArr[i][1] - edgeArr[i+1][1])/(edgeArr[i][0] - edgeArr[i+1][0])) <= 1) {
            x1 = Math.min(edgeArr[i][0], edgeArr[i+1][0]);
            if (x1 == edgeArr[i][0]) {
                y1 = edgeArr[i][1];
                x2 = edgeArr[i+1][0];
                y2 = edgeArr[i+1][1];
            } else {
                y1 = edgeArr[i+1][1];
                x2 = edgeArr[i][0];
                y2 = edgeArr[i][1];
            }
            slope = (y2 - y1)/(x2 - x1);
            for (let j = x1 + 1; j < x2; j++) {
                blockY = Math.round(y1 + (j - x1) * slope);
                edgeArr.push([j, blockY]);
            }
        } else {
            y1 = Math.min(edgeArr[i][1], edgeArr[i+1][1]);
            if (y1 == edgeArr[i][1]) {
                x1 = edgeArr[i][0];
                x2 = edgeArr[i+1][0];
                y2 = edgeArr[i+1][1];
            } else {
                x1 = edgeArr[i+1][0];
                x2 = edgeArr[i][0];
                y2 = edgeArr[i][1];
            }
            inverseSlope = (x2 - x1)/(y2 - y1);
            for (let j = y1 + 1; j < y2; j++) {
                blockX = Math.round(x1 + (j - y1) * inverseSlope);
                edgeArr.push([blockX, j]);
            }
        }
    }
    organizeEdgeArr();
}

function organizeEdgeArr() {
    // making the edge array organized by y value
    for (let i = 0; i < edgeArr.length; i++) {
        alreadyInEdgeArrOrganizedByY = false;
        for (let j = 0; j < edgeArrOrganizedByY.length; j++) {
            if (edgeArr[i][1] == edgeArrOrganizedByY[j][0]) {
                edgeArrOrganizedByY[j][1].push(edgeArr[i][0]);
                alreadyInEdgeArrOrganizedByY = true;
            }
        }
        if (!alreadyInEdgeArrOrganizedByY) {
            edgeArrOrganizedByY.push([edgeArr[i][1], [edgeArr[i][0]]]);
        }
    }
    // sorts y edge array
    edgeArrOrganizedByY.sort((a, b) => {return a[0] - b[0]});
    for (let i = 0; i < edgeArrOrganizedByY.length; i++) {
        edgeArrOrganizedByY[i][1].sort((a, b) => {return a - b});
    }
    calculateOffset();
}

function calculateOffset() {
    // these calculations help you paste the area where you want it
    startX = edgeArrOrganizedByY[0][1][0];
    startY = edgeArrOrganizedByY[0][0];
    bottomLeftXOffset = startX - edgeArrOrganizedByY[edgeArrOrganizedByY.length - 1][1][0];
    bottomRightXOffset = startX - edgeArrOrganizedByY[edgeArrOrganizedByY.length - 1][1][edgeArrOrganizedByY[edgeArrOrganizedByY.length - 1][1].length - 1];
    topRightXOffset = startX - edgeArrOrganizedByY[0][1][edgeArrOrganizedByY[0][1].length - 1];
    midYIndex = Math.floor(edgeArrOrganizedByY.length / 2)
    midYFirstX = edgeArrOrganizedByY[midYIndex][1][0];
    midYLastX = edgeArrOrganizedByY[midYIndex][1][edgeArrOrganizedByY[midYIndex][1].length - 1];
    midYMiddleX = Math.round((midYFirstX + midYLastX) / 2);
    centerXOffset = startX - midYMiddleX;
    moveToStart();
}

async function moveToStart() {
    // prevents getting pushed by pushings/liquid/other things like that
    ig.game.player[maxVelFunc] = function() {
        this.maxVel.x = 0;
        this.maxVel.y = 0;
    };
    // prevents getting moved by solid dynamics/interactings/other things like that
    ig.Entity.COLLIDES.FIXED = 0;
    // prevents getting moved by interactings, transportings, and grabbing dynamics
    getWearable("62b5eba64b4994128421214a");
    ig.game.settings.glueWearable = true;
    calculateDistanceToStart = setInterval(() => {
        xDiff = Math.abs(startX - playerPos.x);
        yDiff = Math.abs(startY - playerPos.y);
    }, 0)
    await delay(100);
    while (yDiff > 1 || xDiff > 1) {
        while (xDiff > 1) {
            if (playerPos.x < startX) {
                ig.game.player.pos.x += 19;
                await delay(1);
            } else {
                ig.game.player.pos.x -= 19;
                await delay(1);
            }
        }
        while (yDiff > 1) {
            if (playerPos.y < startY) {
                ig.game.player.pos.y += 19;
                await delay(1);
            } else {
                ig.game.player.pos.y -= 19;
                await delay(1);
            }
        }
    }
    await delay(500);
    scanArea();
}

async function scanArea() {
    currentlyScanning = true;
    for (let i = 0; i < edgeArrOrganizedByY.length; i++) {
        moveWait = 15;
        ig.game.player.pos.y = edgeArrOrganizedByY[i][0] * 19;
        if (i % 2 == 0) {
            if (playerPos.x > edgeArrOrganizedByY[i][1][0] - 1) {
                while (playerPos.x > edgeArrOrganizedByY[i][1][0] - 1) {
                    ig.game.player.pos.x -= 19;
                    await delay(moveWait);
                }
            } else if (playerPos.x < edgeArrOrganizedByY[i][1][0] - 1) {
                while (playerPos.x < edgeArrOrganizedByY[i][1][0] - 1) {
                    ig.game.player.pos.x += 19;
                    await delay(moveWait);
                }
            } else {
                await delay(moveWait);
            }
            for (let j = edgeArrOrganizedByY[i][1][0]; j <= edgeArrOrganizedByY[i][1][edgeArrOrganizedByY[i][1].length - 1]; j++) {
                if (!currentlyScanning) {
                    return;
                }
                (edgeArrOrganizedByY[i][1][edgeArrOrganizedByY[i][1].length - 1] - j < 20 || j - edgeArrOrganizedByY[i][1][0] < 20) ? moveWait = 15 : moveWait = 25;
                ig.game.player.pos.x = j * 19;
                if (ig.game.player.thingToRightOfPlayer !== null) {
                    blockId = ig.game.player.thingToRightOfPlayer.thing.id;
                    blockRotation = ig.game.player.thingToRightOfPlayer.rotation;
                    blockFlip = ig.game.player.thingToRightOfPlayer.flip;
                    placeArr.push([j, edgeArrOrganizedByY[i][0], blockId, blockRotation, blockFlip]);
                }
                await delay(moveWait);
            }
        } else {
            if (playerPos.x < edgeArrOrganizedByY[i][1][edgeArrOrganizedByY[i][1].length - 1] + 1) {
                while (playerPos.x < edgeArrOrganizedByY[i][1][edgeArrOrganizedByY[i][1].length - 1] + 1) {
                    ig.game.player.pos.x += 19;
                    await delay(moveWait);
                }
            } else if (playerPos.x > edgeArrOrganizedByY[i][1][edgeArrOrganizedByY[i][1].length - 1] + 1) {
                while (playerPos.x > edgeArrOrganizedByY[i][1][edgeArrOrganizedByY[i][1].length - 1] + 1) {
                    ig.game.player.pos.x -= 19;
                    await delay(moveWait);
                }
            } else {
                await delay(moveWait);
            }
            for (let j = edgeArrOrganizedByY[i][1][edgeArrOrganizedByY[i][1].length - 1]; j >= edgeArrOrganizedByY[i][1][0]; j--) {
                if (!currentlyScanning) {
                    return;
                }
                (j - edgeArrOrganizedByY[i][1][0] < 20 || edgeArrOrganizedByY[i][1][edgeArrOrganizedByY[i][1].length - 1] - j < 20) ? moveWait = 15 : moveWait = 25;
                ig.game.player.pos.x = j * 19;
                if (ig.game.player.thingToLeftOfPlayer !== null) {
                    blockId = ig.game.player.thingToLeftOfPlayer.thing.id;
                    blockRotation = ig.game.player.thingToLeftOfPlayer.rotation;
                    blockFlip = ig.game.player.thingToLeftOfPlayer.flip;
                    placeArr.push([j, edgeArrOrganizedByY[i][0], blockId, blockRotation, blockFlip]);
                }
                await delay(moveWait);
            }
        }
    }
    stopScanning();
    ig.game.player.say("finished scanning!");
}

async function stopScanning() {
    ig.game.player[maxVelFunc] = originalVelFunc;
    ig.Entity.COLLIDES.FIXED = 8;
    currentlyScanning = false;
    ig.game.settings.glueWearable = false;
    getWearable(null);
    await delay(1000);
    edgeArr.length = 0;
    edgeArrOrganizedByY.length = 0;
    if (typeof calculateDistanceToStart !== 'undefined') {
        clearInterval(calculateDistanceToStart);
    }
    copyText = `
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
    maxVelFunc = Deobfuscator.function(ig.game.player, '.x;this.maxVel.y=this.', true);
    originalVelFunc = ig.game.player[maxVelFunc];
    placeArr = ${JSON.stringify(placeArr)}; 
    height = ${height}; 
    startX = ${startX};
    startY = ${startY};
    bottomLeftXOffset = ${bottomLeftXOffset}; 
    bottomRightXOffset = ${bottomRightXOffset}; 
    topRightXOffset = ${topRightXOffset};
    centerXOffset = ${centerXOffset};
    suggestedPos = "${suggestedPos}";
    placeHistory = [];
    tired = false;
    callCount = 0; 
    placeWait = 25;
    $('div').remove();
    ig.system.resize(window.innerWidth, window.innerHeight);
    ig.game.panelSet.init();
    ig.game.camera.init();
    info = Deobfuscator.object(ig.game,'mnt_P',true);
    setInterval(() => {
        playerPos = {
            x: Math.round(ig.game.player.pos.x / 19),
            y: Math.round(ig.game.player.pos.y / 19)
        }
    }, 0);
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
    pasteArea();
}

async function pasteArea() {
    ig.game.player[maxVelFunc] = function() {
        this.maxVel.x = 0;
        this.maxVel.y = 0;
    };
    switch(prompt('Enter where you want your current position to be in relation to the paste. Options are: bottom left, bottom right, top left, top right, center.', suggestedPos)) {
        case "bottom left":
            ig.game.player.pos.x += bottomLeftXOffset * 19;
            ig.game.player.pos.y -= (height - 1) * 19; 
            break;
        case "bottom right":
            ig.game.player.pos.x += bottomRightXOffset * 19;
            ig.game.player.pos.y -= (height - 1) * 19; 
            break;
        case "top right":
            ig.game.player.pos.x += topRightXOffset * 19;
            break;
        case "center":
            ig.game.player.pos.x += centerXOffset * 19;
            ig.game.player.pos.y -= Math.round((height - 1) / 2 * 19); 
    }
    await delay(500);
    xDiff = playerPos.x - startX;
    yDiff = playerPos.y - startY;
    for (let i = 0; i < placeArr.length; i++) {
        if (!tired) {
            ig.game.player.pos.x = (placeArr[i][0] + xDiff) * 19;
            ig.game.player.pos.y = (placeArr[i][1] + yDiff) * 19;
            ig.game[map][place](placeArr[i][2], placeArr[i][3], placeArr[i][4], {x: placeArr[i][0] + xDiff, y: placeArr[i][1] + yDiff}, null, !0);
            placeHistory.push([i, placeArr[i]]);
            if (placeHistory.length > 20) {
                placeHistory.shift();
            }
            await delay(placeWait);
        } else {
            i = placeHistory[0][0];
            ig.game.player.pos.x = (placeHistory[0][1][0] + xDiff) * 19;
            ig.game.player.pos.y = (placeHistory[0][1][1] + yDiff) * 19;
            ig.game[map].deleteThingAt(placeHistory[0][1][0] + xDiff, placeHistory[0][1][1] + yDiff);
            await delay(100);
            ig.game[map][place](placeHistory[0][1][2], placeHistory[0][1][3], placeHistory[0][1][4], {x: placeHistory[0][1][0] + xDiff, y: placeHistory[0][1][1] + yDiff}, null, !0);
            await delay(400);
        }
    }
    stopPasting();
}

async function stopPasting() {
    ig.game.player[maxVelFunc] = originalVelFunc;
    await delay(1000);
    placeArr.length = 0;
    ig.game.player.say('finished pasting!');
}

init();`;
    if (location.protocol === 'https:') {
        navigator.clipboard.writeText(copyText).then(function() {
            ig.game.player.say("block data copied to clipboard!");
        }, 
        function() {
            ig.game.player.say("could not copy data. manually copy block data from the console.");
        });
    } else {
        ig.game.player.say("copy block data from the console.");
    }
    consoleref.log(copyText);
}

init();