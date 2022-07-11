// deletes all the blocks enclosed in the shape formed by the vertices you specify
// do not make the shape's edges overlap so that you have more than one shape- unexpected behavior
// add a vertex by alt+right clicking a block
// alt+d to start/stop deleting
// can manually add vertices by typing "edgeArr.push([x, y])" into console

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
    edgeArr = []; edgeArrOrganizedByY = []; shapeArr = []; deleteHistory = [];
    shapeDone = false; toggling = false; tired = false; currentlyDeleting = false; alreadyStopped = false;
    callCount = 0; previousJ = 0; randFloat = 0;
    minX = Infinity; minY = Infinity; maxX = -Infinity; maxY = -Infinity;
    moveWait = 10;
    $('div').remove();
    ig.system.resize(window.innerWidth, window.innerHeight);
    ig.game.panelSet.init();
    ig.game.camera.init();
    setInterval(() => {
        if (ig.input.state("alt") && ig.input.pressed("d")){
            if (!toggling) {
                toggling = true;
                setTimeout(() => {
                    if (currentlyDeleting) {
                        stopDeleting();
                        ig.game.player.say("canceled deleting!");
                    } else {
                        createEdges();
                        ig.game.player.say("shape finished! now deleting.")
                    }
                    toggling = false;
                }, 500)
            }
        }
    }, 0);
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
                addVertex();
            }
        }
        return jQuery.ajax({
            url: "/j/i/st/" + a
        });
    };
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
            alreadyStopped = false;
        }
    }
}

async function addVertex() {
    edgeArr.push([blockX, blockY]);
    ig.game[map].deleteThingAt(blockX, blockY);
    await delay(100);
    ig.game[map][place]("50372a99f5d33dc56f000001", 0, 0, {x: blockX, y: blockY}, null, !0)
    ig.game.player.say("vertex added to shape!");
    if (blockX > maxX) {maxX = blockX;}
    if (blockX < minX) {minX = blockX;}
    if (blockY > maxY) {maxY = blockY;}
    if (blockY < minY) {minY = blockY;}
}

function createEdges() {
    width = maxX - minX + 1; height = maxY - minY + 1;
    getIndex = function(x, y) {
        // y - minY is like the row; x - minX is like the column
        return (y - minY) * width + x - minX;
    };
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            shapeArr.push(false);
        }
    }
    const numEdges = edgeArr.length;
    for (let i = 0; i < edgeArr.length; i++) {
        shapeArr[getIndex(edgeArr[i][0], edgeArr[i][1])] = "edge";
    }
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
                shapeArr[getIndex(j, blockY)] = "edge";
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
                shapeArr[getIndex(blockX, j)] = "edge";
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
    // sorts Y edge array
    edgeArrOrganizedByY.sort((a, b) => {return a[0] - b[0]});
    for (let i = 0; i < edgeArrOrganizedByY.length; i++) {
        edgeArrOrganizedByY[i][1].sort((a, b) => {return a - b});
    }
    // getting a point inside the shape (assuming no edges intersect and it's at least 3 units wide)
    fillStartX = 0;
    midYIndex = Math.floor(edgeArrOrganizedByY.length / 2);
    fillStartY = edgeArrOrganizedByY[midYIndex][0];
    for (let i = 1; i < edgeArrOrganizedByY[midYIndex][1].length; i++) {
        if (edgeArrOrganizedByY[midYIndex][1][i] != edgeArrOrganizedByY[midYIndex][1][i - 1] + 1 && edgeArrOrganizedByY[midYIndex][1][i] != edgeArrOrganizedByY[midYIndex][1][i - 1]) {
            fillStartX = edgeArrOrganizedByY[midYIndex][1][i - 1] + 1;
            break;
        }
    }
    fillShape();
}

function fillShape(){
    // marking every point inside the shape for deletion
    boundaryFill = function(x, y) {
        blockIndex = getIndex(x, y);
        if (shapeArr[blockIndex] == false) {
            shapeArr[blockIndex] = true;
            boundaryFill(x + 1, y);
            boundaryFill(x - 1, y);
            boundaryFill(x, y + 1);
            boundaryFill(x, y - 1);
        }
    };
    boundaryFill(fillStartX, fillStartY);
    moveToStart();
}

async function moveToStart(){
    // moving player to top of shape
    ig.game.gravity = 0;
    ig.game.player.vel.x = 0;
    ig.game.player.vel.y = 0;
    playerPosInterval = setInterval(() => {
        playerPos = {
            x: Math.round(ig.game.player.pos.x / 19),
            y: Math.round(ig.game.player.pos.y / 19)
        }
        xDiff = Math.abs(edgeArrOrganizedByY[0][1][0] - playerPos.x);
        yDiff = Math.abs(edgeArrOrganizedByY[0][0] - playerPos.y);
    }, 0);
    await delay(100);
    while (yDiff > 2 || xDiff > 2) {
        while (xDiff > 2) {
            if (playerPos.x < edgeArrOrganizedByY[0][1][0]) {
                ig.game.player.pos.x += 19;
                await delay(1);
            } else {
                ig.game.player.pos.x -= 19;
                await delay(1);
            }
        }
        while (yDiff > 2) {
            if (playerPos.y < edgeArrOrganizedByY[0][0]) {
                ig.game.player.pos.y += 19;
                await delay(1);
            } else {
                ig.game.player.pos.y -= 19;
                await delay(1);
            }
        }
    }
    await delay(500);
    deleteShape();
}

async function deleteShape() {
    currentlyDeleting = true;
    ig.game.player.vel.x = 0;
    ig.game.player.vel.y = 0;
    for (let i = 0; i <= edgeArrOrganizedByY.length - 1; i++) {
        if (i % 2 == 0) {
            while(Math.abs(playerPos.x - edgeArrOrganizedByY[i][1][0]) > 2) {
                if (playerPos.x < edgeArrOrganizedByY[i][1][0]) {
                    ig.game.player.pos.x += 19;
                    await delay(moveWait);
                } else {
                    ig.game.player.pos.x -= 19;
                    await delay(moveWait);
                }
            }
            for (let j = edgeArrOrganizedByY[i][1][0]; j <= edgeArrOrganizedByY[i][1][edgeArrOrganizedByY[i][1].length - 1]; j++) {
                if (!currentlyDeleting) {
                    return;
                }
                if (!tired) {
                    ig.game.player.pos.y = edgeArrOrganizedByY[i][0] * 19;
                    ig.game.player.pos.x = j * 19;
                    if (shapeArr[getIndex(j, edgeArrOrganizedByY[i][0])] != false) {
                        ig.game[map].deleteThingAt(j, edgeArrOrganizedByY[i][0]);
                        deleteHistory.push([j, i]);
                        if (deleteHistory.length > 500 / moveWait) {
                            deleteHistory.shift();
                        }
                    }
                    await delay(moveWait);
                } else {
                    if (!alreadyStopped) {
                        previousJ = deleteHistory[0][0];
                        i = deleteHistory[0][1];
                        alreadyStopped = true;
                        if (i % 2 == 1) {
                            i--;
                            break;
                        }
                    }
                    j = previousJ;
                    ig.game.player.pos.x = j * 19;
                    ig.game.player.pos.y = edgeArrOrganizedByY[i][0] * 19;
                    ig.game.player.vel.x = 0;
                    ig.game.player.vel.y = 0;
                    ig.game[map][place]("59ff6c69c2928463131dbf69", 0, 0, {x: j, y: edgeArrOrganizedByY[i][0]}, null, !0);
                    await delay(500);
                }
            }
        } else {
            while(Math.abs(playerPos.x - edgeArrOrganizedByY[i][1][edgeArrOrganizedByY[i][1].length - 1]) > 2) {
                if (playerPos.x < edgeArrOrganizedByY[i][1][edgeArrOrganizedByY[i][1].length - 1]) {
                    ig.game.player.pos.x += 19;
                    await delay(moveWait);
                } else {
                    ig.game.player.pos.x -= 19;
                    await delay(moveWait);
                }
            }
            for (let j = edgeArrOrganizedByY[i][1][edgeArrOrganizedByY[i][1].length - 1]; j >= edgeArrOrganizedByY[i][1][0]; j--) {
                if (!currentlyDeleting) {
                    return;
                }
                if (!tired) {
                    ig.game.player.pos.y = edgeArrOrganizedByY[i][0] * 19;
                    ig.game.player.pos.x = j * 19;
                    if (shapeArr[getIndex(j, edgeArrOrganizedByY[i][0])] != false) {
                        ig.game[map].deleteThingAt(j, edgeArrOrganizedByY[i][0]);
                        deleteHistory.push([j, i]);
                        if (deleteHistory.length > 500 / moveWait) {
                            deleteHistory.shift();
                        }
                    }
                    await delay(moveWait);
                } else {
                    if (!alreadyStopped) {
                        previousJ = deleteHistory[0][0];
                        i = deleteHistory[0][1];
                        alreadyStopped = true;
                        if (i % 2 == 0) {
                            i--;
                            break;
                        }
                    }
                    j = previousJ;
                    ig.game.player.pos.x = j * 19;
                    ig.game.player.pos.y = edgeArrOrganizedByY[i][0] * 19;
                    ig.game.player.vel.x = 0;
                    ig.game.player.vel.y = 0;
                    ig.game[map][place]("59ff6c69c2928463131dbf69", 0, 0, {x: j, y: edgeArrOrganizedByY[i][0]}, null, !0);
                    await delay(500);
                }
            }
        }
    }
    stopDeleting();
    ig.game.player.say("finished deleting!");
}

async function stopDeleting() {
    ig.game.gravity = 800;
    currentlyDeleting = false;
    await delay(1000);
    edgeArr.length = 0;
    edgeArrOrganizedByY.length = 0;
    shapeArr.length = 0;
    deleteHistory.length = 0;
    if (typeof playerPosInterval !== 'undefined') {
        clearInterval(playerPosInterval);
    }
}

init();