// not optimized for concave shapes,, but faster for "normally" shaped shapes
// add a vertex by alt+right clicking a block
// alt+d to start/stop deleting
// can manually add vertices by typing "edgeArr.push([x, y])" into console
// places some invisible blocks so it's harder to clean up

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
    edgeArr = []; edgeArrOrganizedByY = []; shapeArr = []; lastDeletedBlocks = [];
    shapeDone = false; toggling = false; callCount = 0; tired = false; currentlyDeleting = false;
    deleteWait = 10;
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
                        toggling = false;
                    } else {
                        createEdges();
                        ig.game.player.say("shape finished! now deleting.")
                        toggling = false;
                    }
                }, 500)
            }
        }
    }, 0);
    info = Deobfuscator.object(ig.game,'mnt_P',true);
    ig.game[info].getItemStats_P = function(a) {
        if (ig.input.state("alt")) {
            alreadyInEdgeArr = false;
            blockXPos = ig.game.itemContextMenu.maploc.x;
            blockYPos = ig.game.itemContextMenu.maploc.y;
            for (let i = 0; i < edgeArr.length; i++) {
                if (edgeArr[i][0] == blockXPos && edgeArr[i][1] == blockYPos) {
                    alreadyInEdgeArr = true;
                }
            }
            if (!alreadyInEdgeArr) {
                addVertex();
            }
        }
        return jQuery.ajax({
            url: "/j/i/st/" + a
        })
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
        }
    }
}

async function addVertex() {
    edgeArr.push([blockXPos, blockYPos]);
    ig.game[map].deleteThingAt(blockXPos, blockYPos);
    await delay(100);
    ig.game[map][place]("50372a99f5d33dc56f000001", 0, 0, {x: blockXPos, y: blockYPos}, null, !0)
    ig.game.player.say("vertex added to shape!");
}

function createEdges() {
    edgeArr.push(edgeArr[0]);
    const numEdges = edgeArr.length - 1;
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
                for (let k = 0; k < edgeArrOrganizedByY[j][1].length; k++) {
                    if (edgeArr[i][0] == edgeArrOrganizedByY[j][1][k]) {
                        alreadyInEdgeArrOrganizedByY = true;
                    }
                }
                if (!alreadyInEdgeArrOrganizedByY) {
                    edgeArrOrganizedByY[j][1].push(edgeArr[i][0]);
                    alreadyInEdgeArrOrganizedByY = true;
                }
            }
        }
        if (!alreadyInEdgeArrOrganizedByY) {
            edgeArrOrganizedByY.push([edgeArr[i][1], [edgeArr[i][0]]]);
        }
    }
    // organizing the Y edge array
    edgeArrOrganizedByY.sort((a,b) => {return a[0] - b[0]});
    for (let i = 0; i < edgeArrOrganizedByY.length; i++) {
        edgeArrOrganizedByY[i][1].sort((a,b) => {return a - b});
    }
    fillShape();
}

function fillShape(){
    for (let i = 0; i < edgeArrOrganizedByY.length; i++) {
        shapeArr.push([edgeArrOrganizedByY[i][0],[]]);
        if (i % 2 == 0) {
            for (let j = edgeArrOrganizedByY[i][1][0]; j <= edgeArrOrganizedByY[i][1][edgeArrOrganizedByY[i][1].length - 1]; j++) {
                shapeArr[i][1].push(j);
            }
        } else {
            for (let j = edgeArrOrganizedByY[i][1][edgeArrOrganizedByY[i][1].length - 1]; j >= edgeArrOrganizedByY[i][1][0]; j--) {
                shapeArr[i][1].push(j);
            }
        }
    }
    moveToStart();
}

async function moveToStart(){
    // moving player to top of shape
    ig.game.gravity = 0;
    playerPosInterval = setInterval(() => {
        playerPos = {
            x: Math.round(ig.game.player.pos.x / 19),
            y: Math.round(ig.game.player.pos.y / 19)
        }
        xDiff = Math.abs(shapeArr[0][1][0] - playerPos.x);
        yDiff = Math.abs(shapeArr[0][0] - playerPos.y);
    }, 0);
    await delay(100);
    while (yDiff > 2 || xDiff > 2) {
        while (xDiff > 1) {
            if (playerPos.x < shapeArr[0][1][0]) {
                ig.game.player.pos.x += 19;
                await delay(1);
            } else {
                ig.game.player.pos.x -= 19;
                await delay(1);
            }
        }
        while (yDiff > 1) {
            if (playerPos.y < shapeArr[0][0]) {
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
    for (var i = 0; i < shapeArr.length; i++) {
        while(Math.abs(playerPos.x - shapeArr[i][1][0]) > 2) {
            if (playerPos.x < shapeArr[i][1][0]) {
                ig.game.player.pos.x += 19;
                await delay(deleteWait);
            } else {
                ig.game.player.pos.x -= 19;
                await delay(deleteWait);
            }
        }
        await delay(deleteWait);
        for (var j = 0; j < shapeArr[i][1].length; j++) {
            if (!currentlyDeleting) {
                return;
            }
            if (!tired) {
                ig.game.player.pos.x = shapeArr[i][1][j] * 19;
                ig.game.player.pos.y = shapeArr[i][0] * 19;
                ig.game[map].deleteThingAt(shapeArr[i][1][j], shapeArr[i][0]);
                lastDeletedBlocks.push([j,i]);
                if (lastDeletedBlocks.length >= 30) {
                    lastDeletedBlocks.shift();
                }
                await delay(deleteWait);
                randFloat = Math.random();
                if (randFloat < 0.3 && lastDeletedBlocks.length > 2) {
                    ig.game[map][place]("54f0fc2d8a45c059367567b9", 0, 0, {x: shapeArr[lastDeletedBlocks[lastDeletedBlocks.length - 2][1]][1][lastDeletedBlocks[lastDeletedBlocks.length - 2][0]], y: shapeArr[lastDeletedBlocks[lastDeletedBlocks.length - 2][1]][0]}, null, !0)
                }
            } else {
                if (lastDeletedBlocks.length >= 1) {
                    j = lastDeletedBlocks[0][0];
                    i = lastDeletedBlocks[0][1];
                }
                ig.game.player.pos.x = shapeArr[i][1][j] * 19;
                ig.game.player.pos.y = shapeArr[i][0] * 19;
                ig.game.player.vel.x = 0;
                ig.game.player.vel.y = 0;
                ig.game[map].deleteThingAt(shapeArr[i][1][j], shapeArr[i][0]);
                await delay(100);
                ig.game[map][place]("59ff6c69c2928463131dbf69", 0, 0, {x: shapeArr[i][1][j], y: shapeArr[i][0]}, null, !0);
                await delay(400);
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
    lastDeletedBlocks.length = 0;
    if (typeof playerPosInterval !== 'undefined') {
        clearInterval(playerPosInterval);
    }
}

init();