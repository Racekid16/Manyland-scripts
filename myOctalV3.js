// OCTAL Menu- credit to r4tb0y for the original version, edited by me
// Edited off Octal version 1.5
// A very messy mishmash of octal, proto, ml-scrp, and my additions.
// Credit to r4tb0y and parse for the respective scripts.

// Parse's deobfuscator
/**
	 * Written by Parse
	 * A tool for finding minified manyland variables.
	 */
 consoleref.log(
	'%cDeobfuscator created by Parse\nCheck it out -> github.com/parseml/many-deobf',
	'background: purple; color: white; display: block; padding: 10px;',
);

/**
 * I'm too lazy to document this, but gladly someone else did it for me.
 * You can check it out here for more information.
 * https://manylandmods.github.io/manyland-documentation/#/obfuscation?id=parses-deobfuscator
 */
var Deobfuscator = {
	object: function(object, string, returnKey) {
		let keys = Object.keys(object)
		let proto = Object.keys(Object.getPrototypeOf(object))

		for(let key of [ ...keys, ...proto ]) {
			if(!object[key])
				continue

			let _keys = Object.keys(object[key])
			let _proto = Object.keys(Object.getPrototypeOf(object[key]))

			if([ ..._keys, ..._proto ].includes(string))
				return returnKey ? key : object[key]
		}
	},

	function: function(object, string, returnKey) {
		let keys = Object.keys(object)
		let proto = Object.keys(Object.getPrototypeOf(object))

		for(let key of [ ...keys, ...proto ]) {
			if(!object[key])
				continue

			if(object[key].toString().includes(string))
				return returnKey ? key : object[key]
		}
	},

	variableByLength: function(object, length, returnKey) {
		let keys = Object.keys(object)
		let proto = Object.keys(Object.getPrototypeOf(object))

		for(let key of [ ...keys, ...proto ]) {
			if(!object[key])
				continue

			if(object[key].length === length)
				return returnKey ? key : object[key]
		}
	},

	keyBetween: function(func, start, stop) {
		return func.toString().substring(
			func.toString().lastIndexOf(start) + start.length,
			func.toString().lastIndexOf(stop)
		)
	}
};

/**
 * Here is an example of getting minified variables.
 * These are also pre-defined variables that you can use in your mods / scripts!
 */
ig.game.player = Deobfuscator.object(ig.game, 'screenName', false)
id = Deobfuscator.variableByLength(ig.game.player, 24, true)
ig.game.player.id = ig.game.player[id]
ig.game.player.changeName = Deobfuscator.function(ig.game.player, 'this.screenName=', false)
ig.game.players = Deobfuscator.object(ig.game, "betweenDefaultAndPlayer", false).player
ig.game.equip = Deobfuscator.object(ig.game, "getCollectedItemsForPlayer", false)
ig.game.equip.item = Deobfuscator.function(ig.game.equip, "getItem_P", false)
ig.game.blocks = Deobfuscator.object(ig.game, "lastRequestTimestamps", false)
ig.game.websocket = Deobfuscator.object(ig.game, "binary", false)
ig.game.player.id = Deobfuscator.variableByLength(ig.game.player, 24, false)
players = Deobfuscator.object(ig.game, "betweenDefaultAndPlayer", true)
allowEquiping = Deobfuscator.keyBetween(ig.game.init, "t=!0,ig.game.", "=!0);")
ig.game[allowEquiping] = true

/*
 * Function to find someones RID from their screenName in game.
 */
function idFromScreenName(screenName) {
	updatePlayers()

	return ig.game.players.filter(i => i.screenName == screenName)[0]
}

/*
 * Function to update the ig.game.player array for new players
 */
function updatePlayers() {
	ig.game.players = ig.game[players].player
}

ig.game.area = Deobfuscator.object(ig.game,'currentArea',false);
obfVar = Deobfuscator.object(ig.game,'mnt_P',false);
areaType = Deobfuscator.keyBetween(obfVar.mnt_P,"{p:b.",",a:b.c");
originalArea = ig.game.area.currentArea;
originalAreaType = ig.game.area[areaType];
ig.game.player.kill = function() {};
obfuscatedVariable = Deobfuscator.object(ig.game,'mnt_P',true)
banFunction = Deobfuscator.function(ig.game[obfuscatedVariable], '/j/u/p/"', true);
ig.game[obfuscatedVariable][banFunction] = function() {}
ig.game.nonLoggedInChatIfEditorAround = true;
if (!ig.game.isFullAccount) {
    ig.game.isFullAccount = true;
} else {
    ml.Misc.thereIsAnEditorAround = () => true
}
editMap = Deobfuscator.object(ig.game,'removeItemFromMap',true);
areaProtection = Deobfuscator.keyBetween(ig.game[editMap].removeItemFromMap,'if(("ANY"==ig.game.','||ig.game.');
if (ig.game[areaProtection] == "ANY") {
	ig.game[areaProtection] = "INDIVIDUALS";
}

function addButtons(){document.getElementById("buttons").innerHTML = `<tbody><tr> <th> </th> <th>S C R I P T S</th> <th></th> </tr> <tr> <td id="1" onclick="buildToggle();">auto-build</td><td onclick="deleteToggle();">delete section</td><td id="3" onclick="outerRingToggle();">outer ring</td></tr><tr><td id="4" onclick="cloneToggle();">clone creation</td><td onclick="numToggle();">1337 speak</td><td onclick="dragToggle()">player drag</td></tr><tr><td onclick="stlToggle();">bodysteal</td><td onclick="followToggle();">follow player</td><td onclick="textSpamToggle();">text spam</td></tr><tr><th></th><th>B O D I E S</th><th></th></tr><tr><td id="8" onclick="getWear(&quot;60d73d21b909cc04fd1e7401&quot;);">baller</td><td onclick="getWear(&quot;611c2ef6a14d99140e8fe124&quot;);">american</td><td onclick="getWear(&quot;59d6e6c9fc2289031047af27&quot;);">gang beast</td></tr><tr><td onclick="getWear(&quot;00000000000000000000132e&quot;);">1337krew</td><td onclick="getWear(&quot;530d1898ccae7a5e0b00005b&quot;);">philipp</td><td id="9" onclick="getWear(&quot;6255fd7415a3c305de7a55d7&quot;);">vendetta</td></tr><tr><td onclick="getWear(&quot;6270736820c16a1c2082c890&quot;);">invisible</td><td id="7" onclick="getWear(&quot;5e3da8779e027637f9821188&quot;);">rose</td><td onclick="getWear(&quot;5dc1a57faf966810c0b354d1&quot;);">trump</td></tr><tr></tr> <tr> </tr> <tr> <th> </th> <th>E Q U I P</th> <th></th> </tr> <tr> <td id="10" onclick="getLiner(&quot;5680cfe4beaa04916a8e75d9&quot;);">bluefish</td><td id="17" onclick="getDynamic2(&quot;60f978c0bf42e239cb7c0830&quot;);">giant wall</td><td id="12" onclick="getDynamic2(&quot;62708f173aecf61c1fd15e13&quot;);">gay</td></tr><tr><td id="11" onclick="getEquip(&quot;61606dbd249d4a05bae56292&quot;);">wearable</td><td id="13" onclick="getLiner(&quot;58e2940720c888a611b65b18&quot;);">lazer</td> <td id="14" onclick="getLiner(&quot;55b05f724f85cf2f41aeef48&quot;);">ban hammer</td></tr><tr><td id="16" onclick="getDynamic2(&quot;6287ad9c2ebf981f5c9a9cce&quot;);">invisifly</td><td id="18" onclick="getMount(&quot;627071202079481f4a1e1a8b&quot;);">invisimount</td><td id="15" onclick="getLiner(&quot;52e1932fa4f2e65117000004&quot;);">sticky hand</td></tr>   </tbody>`};

window.obfKey = {
	player: function(){return obfHandler.find("ig.game.",".screenName")},
	playerArray: function(){return obfHandler.find("ig.game.",".player.length")},
	playerID: function(){return obfHandler.find("=a.",",this.playSound()))}})});")},
	nameChange: function(){return obfHandler.find("changeDirection "," changeType")},
	itemEquip: function(){return obfHandler.find("d&&this.","(a,d,c,null,b)},")},
	itemSlots: function(){return obfHandler.find("ig.game.",".slots.MOUNTABLE,this.attachments")},
	itemArray: function(){return obfHandler.find("BUG! ",".getItem called with zero/undefined")}
}

window.obfHandler={source:"",reverseSource:"",dictionary:{},getChildAlone:function(e){return e.split(".").slice(-1)[0]},reverse:function(e){return e.split("").reverse().join("")},rightIndexOf:function(e,n){return t=this.reverseSource,n=n?t.length-n:null,t.length-t.indexOf(this.reverse(e),n)},isEmpty:function(e){for(var t in e)if(e.hasOwnProperty(t))return!1;return!0},item:function(e,t){return startLoc=this.source.indexOf(e),endLoc=this.source.indexOf(t)+t.length-startLoc,this.source.substr(startLoc,endLoc)},path:function(e,t){return startLoc=this.source.indexOf(e),endLoc=this.source.indexOf(t)-startLoc,this.source.substr(startLoc,endLoc)},cleanOwn:function(e,t){return e.slice(e.lastIndexOf(t),e.length)},clean:function(e){return e.slice(e.lastIndexOf("ig.game."),e.length)},find:function(e,t){return lastIndex=this.source.indexOf(t),firstIndex=this.rightIndexOf(e,lastIndex),this.source.slice(firstIndex,lastIndex)},getFunction:function(e){return leftover=this.source.slice(0,this.source.indexOf(e)),leftover.slice(leftover.lastIndexOf(",")+1,leftover.lastIndexOf(":function("))},defind:function(e,t){return e+this.find(e,t)},getParent:function(e){return e.split(".").slice(0,-1).join(".")},createDictionary:function(){for(var e in this.key)this.dictionary[e]=this.key[e](),window[e]=this.dictionary[e]}};

window.init = async function () {
	return new Promise((res, rej) => {
		a = $.get("manyland.js"), a.always(function() {
			obfHandler.source = a.responseText, obfHandler.reverseSource = obfHandler.reverse(a.responseText), obfHandler.key = window.obfKey
			obfHandler.createDictionary()
			res();
		});
	})}

await init();
function getBar() {
	const elements = document.getElementsByTagName('div');

	for(let e of elements) {
		if(e.onmouseover !== null)
			return e;
	}
}

async function htmlSettings() {
	window.old = getBar();
	old.innerHTML = `
	<style>body {
	margin: 0px;
	}

	#cheatMenu {
	height: 974px;
	width: 317px;
	background-color: #4900ff;
	}

	#title {
	text-align: center;
	font-family: 'ubMono';
	font-weight: bold;
	color: #4900ff;
	width: 317px;
	background-color: #00b8ff;
	padding-top: 2%;
	height: 4%;
	font-size: 190%;
	border-bottom: 8px solid #9600ff;
	border-top: 8px solid #9600ff;
	cursor: cell;
	}

	#titlebg {
	width: 317px;
	background-color: #00b8ff;
	}

	#buttons {
	margin-top: 10%;
	font-family: 'ubMono';
    font-size: 90%;
	border-bottom: 12px solid #9600ff;
	border-top: 12px solid #9600ff;
	background-color: #00b8ff;
	text-align: center;
	}

	td {
	color: #4900ff;
	background-color: #00b8ff;
	text-align: center;
	cursor: pointer;
	}

	th {
	color: #4900ff;
	background-color: #00b8ff;
	text-align: center;
	padding-top: 5%;
	}

	@font-face {
	font-family: 'ubMono';
	src: url('https://cdn.glitch.com/f19f9b7a-c186-42ce-9718-536ff19ba9c8%2FUbuntuMono-R.ttf?1531969307901') format('truetype');
	}
	</style>
	<div id='cheatMenu'>
	<br>
	<div id='titlebg'>
		<div id='title'>
		O C T A L
		</div>
	</div>

	<table style='width:100%' id='buttons'>
	`
}

htmlSettings().then(() => {loadOCTAL()});

function loadOCTAL(){
	window.dragMode = false;       // was window.veloMode = false;
	window.buildMode = false;       // was window.slowMode = false;
	window.outerRingMode = false;
	window.cloneMode = false;    // was window.spamMode = false;
	window.stealMode = false;
	window.deleteMode = false;     //was window.camMode = false;
	window.numberMode = false;
	window.followMode = false;
	window.txtSpamMode = false;
    // dynasteal, itemsteal, and velocity have been removed.

	window.playerDrag = function(){
        if (ig.input.state("rightclick")) {
            ig.game.gravity = 0;
            ig.game.player.pos.x = ig.game.screen.x + ig.input.mouse.x;
            ig.game.player.pos.y = ig.game.screen.y + ig.input.mouse.y;
        } else {
            ig.game.gravity = 800;
        }
    }

    async function build() {
        var direction = prompt("Enter left or right: ","right");
        if (direction != "left" && direction != "right") {
            ig.game[player].say("invalid input!");
            return;
        }
        ig.game.sounds.success.play();
		ig.game[player].say("auto-build enabled.");
        togglePlace = true;
        const delay = async (ms = 1000) =>  new Promise(resolve => setTimeout(resolve, ms))
        tired = false;
        callCount = 0;
        map = Deobfuscator.object(ig.game,'queuePerformDelayMs',true);
        async function wait() {
            let initialCallCount = callCount;
            await delay(3000);
            if (callCount == initialCallCount) {
                tired = false;
            }
        }
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
            }
        }
        setInterval(() => {
            playerPos = {
                x: Math.floor(ig.game.player.pos.x/19),
                y: Math.floor(ig.game.player.pos.y/19)
            }
        }, 100)
        blockRotation = 0;  //can be 0, 1, 2, or 3
        blockFlip = 0;      //can be 0 or 1
        setTimeout(() => {
            async function place() {
                blockId1 = "60c18e637b2d430afa59cc53";
                blockId2 = "60c1278914c5a60503f9d5fe";
                if (direction == "left") {
                    leftx = 12;
                    rightx = 2;
                } else {
                    leftx = 2;
                    rightx = 12;
                }
                startBlockPos = {
                    x: playerPos.x - leftx,
                    y: playerPos.y + 1
                }
                endBlockPos = {
                    x: playerPos.x + rightx,
                    y: playerPos.y + 3
                }
                currentlyPlacing = true
                for (i = startBlockPos.y - 1; i < endBlockPos.y; i++) {
                    for (j = startBlockPos.x; j < endBlockPos.x; j++) {
                        if (i == startBlockPos.y) {
                            blockId = blockId1;
                        } else {
                            blockId = blockId2;
                        }
                        blockInfo = {
                            tid: blockId,
                            rotation: blockRotation,
                            flip: blockFlip
                        }
                        currentBlockPos = {
                            x: j,
                            y: i
                        }
                        if (i == startBlockPos.y - 1) {
                            blockInfo = null;
                        }
                        ig.game[map].setMap(currentBlockPos.x, currentBlockPos.y, blockInfo, false);
                        await delay(1);
                    }
                }
                lightId = '51e460bd134794940a000009';
                lightInfo = {
                    tid: lightId,
                    rotation: blockRotation,
                    flip: blockFlip
                }
                ig.game[map].setMap(currentBlockPos.x, currentBlockPos.y - 8, lightInfo, false);
                currentlyPlacing = false;
            }
            currentlyPlacing = false;
            placeInterval = setInterval(() => {
                if (!currentlyPlacing) {
                    place();
                }
            }, 100)
            movePlayer = setInterval(() => {
                if (currentlyPlacing && !tired) {
                    if (direction == "left") {
                        ig.game.player.vel.x = -200;
                    } else {
                        ig.game.player.vel.x = 200;
                    }
                }
            }, 0)
        }, 200)
    }

    async function deleteSection() {
        areaSize = prompt("Enter the size of the section you want to delete.\n(width,height)",`20,20`)
                .split(',').map(Number);
        if (isNaN(areaSize[0]) || isNaN(areaSize[1])) {
            ig.game[player].say("invalid input!");
            return;
        }
        ig.game.sounds.success.play();
        ig.game[player].say("delete section enabled.");
        if (areaSize[0] >= 0 && areaSize[1] >= 0) {
            quadrant = 4;
            goingRight = true;
        } else if (areaSize[0] >= 0 && areaSize[1] < 0) {
            quadrant = 1;
            goingRight = true;
        } else if (areaSize[0] < 0 && areaSize[1] >= 0) {
            quadrant = 3;
            goingRight = false;
        } else if (areaSize[0] < 0 && areaSize[1] < 0) {
            quadrant = 2;
            goingRight = false;
        }
        const delay = async (ms = 1000) =>  new Promise(resolve => setTimeout(resolve, ms))
		posHistory = [];
        tired = false;
        ig.game.gravity = 0;
        callCount = 0;
        map = Deobfuscator.object(ig.game,'queuePerformDelayMs',true);
        async function wait() {
            let initialCallCount = callCount;
            await delay(3000);
            if (callCount == initialCallCount) {
                tired = false;
            }
        }
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
            }
        }
        trackPlayerPos = setInterval(() => {
            playerPos = {
                x: Math.round(ig.game.player.pos.x/19),
                y: Math.round(ig.game.player.pos.y/19)
            }
            ig.game.player.vel.x = 0;
            ig.game.player.vel.y = 0;
        }, 0)
        sectionWidth = 10;
        rowHeight = 10;
        if (Math.abs(areaSize[0]) < sectionWidth) {
            sectionWidth = Math.abs(areaSize[0]);
        }
        if (Math.abs(areaSize[1]) < rowHeight) {
            rowHeight = Math.abs(areaSize[1]);
        }
        moveDelay = rowHeight * sectionWidth * 10;
        if (moveDelay < 400 && moveDelay != 0 && (areaSize[0] > 50 || areaSize[1] > 50)) {
            moveDelay = 400
        }
        async function remove() {
            if (quadrant == 1 || quadrant == 2) {
                for (let i = Math.round(playerPos.y + rowHeight/2 + 1); i > Math.round(playerPos.y - rowHeight/2 + 1); i--) {
                    for (let j = Math.round(playerPos.x - sectionWidth/2); j < Math.round(playerPos.x + sectionWidth/2); j++) {
                        ig.game[map].deleteThingAt(j, i);
                    }
                    await delay(1);
                }
            }
            if (quadrant == 3 || quadrant == 4) {
                for (let i = Math.round(playerPos.y - rowHeight/2); i < Math.round(playerPos.y + rowHeight/2); i++) {
                    for (let j = Math.round(playerPos.x - sectionWidth/2); j < Math.round(playerPos.x + sectionWidth/2); j++) {
                        ig.game[map].deleteThingAt(j, i);
                    }
                    await delay(1);
                }
            }
        }
		function addToPosHistory() {
			posHistory.push([ig.game.player.pos.x, ig.game.player.pos.y]);
			if (posHistory.length > 2) {
				posHistory.shift();
			}
		}
        setTimeout(() => {
            startBlockPos = {
                x: playerPos.x,
                y: playerPos.y
            }
            if (quadrant == 1) {
                endBlockPos = {
                    x: startBlockPos.x + areaSize[0] - 1,
                    y: startBlockPos.y + areaSize[1] + 1
                }
            } 
            if (quadrant == 2) {
                endBlockPos = {
                    x: startBlockPos.x + areaSize[0] + 1,
                    y: startBlockPos.y + areaSize[1] + 1
                }
            } 
            if (quadrant == 3) {
                endBlockPos = {
                    x: startBlockPos.x + areaSize[0] + 1,
                    y: startBlockPos.y + areaSize[1] - 1
                }
            } if (quadrant == 4) {
                endBlockPos = {
                    x: startBlockPos.x + areaSize[0] - 1,
                    y: startBlockPos.y + areaSize[1] - 1
                }
            }
            remove();
            movePlayer = setInterval(() => {
                if (!tired) {
                    if (goingRight) {
                        if (quadrant == 1) {
                            if (playerPos.x + sectionWidth <= endBlockPos.x) {
                                ig.game.player.pos.x += 19 * sectionWidth;
                            } 
                            if (playerPos.x + sectionWidth > endBlockPos.x && playerPos.y - endBlockPos.y  >= rowHeight) {
                                ig.game.player.pos.y -= 19 * rowHeight;
                                goingRight = false;
                            } 
                            if (playerPos.x + sectionWidth > endBlockPos.x && playerPos.y - endBlockPos.y < rowHeight) {
                                stopDeleting();
                            }
                        }
                        if (quadrant == 2) {
                            if (playerPos.x < startBlockPos.x) {
                                ig.game.player.pos.x += 19 * sectionWidth;
                            } 
                            if (playerPos.x >= startBlockPos.x && playerPos.y - endBlockPos.y  >= rowHeight) {
                                ig.game.player.pos.y -= 19 * rowHeight;
                                goingRight = false;
                            } 
                            if (playerPos.x >= startBlockPos.x && playerPos.y - endBlockPos.y  < rowHeight) {
                                stopDeleting();
                            }
                        }
                        if (quadrant == 3) {
                            if (playerPos.x < startBlockPos.x) {
                                ig.game.player.pos.x += 19 * sectionWidth;
                            } 
                            if (playerPos.x >= startBlockPos.x && endBlockPos.y - playerPos.y >= rowHeight) {
                                ig.game.player.pos.y += 19 * rowHeight;
                                goingRight = false;
                            } 
                            if (playerPos.x >= startBlockPos.x && endBlockPos.y - playerPos.y < rowHeight) {
                                stopDeleting();
                            }
                        }
                        if (quadrant == 4) {
                            if (playerPos.x + sectionWidth <= endBlockPos.x) {
                                ig.game.player.pos.x += 19 * sectionWidth;
                            } 
                            if (playerPos.x + sectionWidth > endBlockPos.x && endBlockPos.y - playerPos.y >= rowHeight) {
                                ig.game.player.pos.y += 19 * rowHeight;
                                goingRight = false;
                            } 
                            if (playerPos.x + sectionWidth > endBlockPos.x && endBlockPos.y - playerPos.y < rowHeight) {
                                stopDeleting();
                            }
                        }
                    } else {
                        if (quadrant == 1) {
                            if (playerPos.x > startBlockPos.x) {
                                ig.game.player.pos.x -= 19 * sectionWidth;
                            } 
                            if (playerPos.x <= startBlockPos.x && playerPos.y - endBlockPos.y >= rowHeight) {
                                ig.game.player.pos.y -= 19 * rowHeight;
                                goingRight = true;
                            } 
                            if (playerPos.x <= startBlockPos.x && playerPos.y - endBlockPos.y < rowHeight) {
                                stopDeleting();
                            }
                        }
                        if (quadrant == 2) {
                            if (playerPos.x - sectionWidth >= endBlockPos.x) {
                                ig.game.player.pos.x -= 19 * sectionWidth;
                            } 
                            if (playerPos.x - sectionWidth < endBlockPos.x && playerPos.y - endBlockPos.y >= rowHeight) {
                                ig.game.player.pos.y -= 19 * rowHeight;
                                goingRight = true;
                            } 
                            if (playerPos.x - sectionWidth < endBlockPos.x && playerPos.y - endBlockPos.y < rowHeight) {
                                stopDeleting();
                            }
                        }
                        if (quadrant == 3) {
                            if (playerPos.x - sectionWidth >= endBlockPos.x) {
                                ig.game.player.pos.x -= 19 * sectionWidth;
                            } 
                            if (playerPos.x - sectionWidth < endBlockPos.x && endBlockPos.y - playerPos.y >= rowHeight) {
                                ig.game.player.pos.y += 19 * rowHeight;
                                goingRight = true;
                            } 
                            if (playerPos.x - sectionWidth < endBlockPos.x && endBlockPos.y - playerPos.y < rowHeight) {
                                stopDeleting();
                            }
                        }
                        if (quadrant == 4) {
                            if (playerPos.x > startBlockPos.x) {
                                ig.game.player.pos.x -= 19 * sectionWidth;
                            } 
                            if (playerPos.x <= startBlockPos.x && endBlockPos.y - playerPos.y >= rowHeight) {
                                ig.game.player.pos.y += 19 * rowHeight;
                                goingRight = true;
                            } 
                            if (playerPos.x <= startBlockPos.x && endBlockPos.y - playerPos.y < rowHeight) {
                                stopDeleting();
                            }
                        }
                    }
					addToPosHistory();
                }
                remove();
            }, moveDelay)
        }, moveDelay)
    }

    function stopDeleting() {
        ig.game.gravity = 800;
        if (typeof trackPlayerPos !== 'undefined') {
            clearInterval(trackPlayerPos);
        }
        if (typeof movePlayer !== 'undefined') {
            clearInterval(movePlayer);
        }
        itemSlots = Deobfuscator.object(ig.game,'lastPressedControlTimer', true);
        itemEquip = Deobfuscator.function(ig.game[itemSlots],'(g=1);c&&(!a.attachments[b]||',true);
        getDynamic('6283d8b31a976b05bc17a1d3');
        deleteMode = false;
        ig.game.sounds.nocando.play();
		ig.game[player].say("delete section disabled.");
    }

	var menu = new Object();
	menu.freeze= ig.game[player].update

	window.mTeleport = function(){
		ig.game[player].pos.x = ig.game.screen.x + ig.input.mouse.x;
		ig.game[player].pos.y = ig.game.screen.y + ig.input.mouse.y;
	}

	window.textSpamToggle = function(){
		if(txtSpamMode){
			txtSpamMode = false;
			clearInterval(spamInterval);
            ig.game.draw = ig.game.oldDraw;
            ig.game.update = ig.game.oldUpdate;
			ig.game[player].say("spam disabled.");
		} else {
			txtSpamMode = true;
			var chat = Object.keys(ig.game).filter((a)=>{return ig.game[a] && ig.game[a].hasOwnProperty('thumbing')})
            ig.game.oldDraw = ig.game.draw;
            ig.game.oldUpdate = ig.game.update;
			ig.game.draw=()=>{}
			ig.game.update=()=>{}
			var phrase = `${'ga'}${'y'} `;
			var spam = phrase.repeat(5*1000)
			function spamText() {
				ig.game[chat].say(`_s${spam}`);
			}
			spamInterval = setInterval(spamText,25*4);
		}
	};

	window.numToggle = function(){
		if(numberMode){
			numberMode = false;
			ig.input.bindings[65] = "a";
			ig.input.bindings[69] = "e";
			ig.input.bindings[71] = "g";
			ig.input.bindings[73] = "i";
			ig.input.bindings[79] = "o";
			ig.input.bindings[81] = "q";
			ig.input.bindings[83] = "s";
			ig.input.bindings[84] = "t";
			ig.input.bindings[90] = "z";
			ig.game.sounds.nocando.play();
			ig.game[player].say("1337 speak disabled.");
		} else {
			numberMode = true;
			ig.input.bindings[65] = "four";
			ig.input.bindings[69] = "three";
			ig.input.bindings[71] = "six";
			ig.input.bindings[73] = "one";
			ig.input.bindings[79] = "zero";
			ig.input.bindings[81] = "nine";
			ig.input.bindings[83] = "five";
			ig.input.bindings[84] = "seven";
			ig.input.bindings[90] = "two";
			ig.game.sounds.success.play();
			ig.game[player].say("1337 speak enabled.");
		}
	};

	window.dragToggle = function(){
		if(dragMode){
			dragMode = false;
			clearInterval(playerDragInterval);
			ig.game.sounds.nocando.play();
			ig.game[player].say("player drag disabled.");
		} else {
			dragMode = true;
			playerDragInterval = setInterval(playerDrag, 0);
			ig.game.sounds.success.play();
			ig.game[player].say("player drag enabled. right click to drag.");
            
		}
	};

	var posInterval;
	var findInterval;
	window.followToggle = function() {
		if(followMode){
			followMode = false;
			clearInterval(findInterval);
			clearInterval(posInterval);
            ig.game.playerDialog.openForPlayerId = ig.game.playerDialog.oldOpenForPlayerId;
			guyId = 'undefined';
			getWear(originalBody);
			getDynamic(null);
			ig.game[player].say("follow player disabled.");
		} else {
			followMode = true;
			originalBody = ig.game[player].attachments.b.id;
			ig.game[player].say("follow player enabled. click a player to follow.")
            ig.game.playerDialog.oldOpenForPlayerId = ig.game.playerDialog.openForPlayerId;
			ig.game.playerDialog.openForPlayerId = function(a,b) {
				for (index = 0; index < ig.game[entities].player.length; ++index) {
					if(ig.game[entities].player[index][id] === a) {
						if(followMode){
							guyId = ig.game[entities].player[index][id];
						}
					}
				}
			}
			findInterval = setInterval(() => {
				findInterval = true;
				if(typeof guyId != 'undefined' && !posInterval && followMode){
					personFound = false;
					for (index = 0; index < ig.game[entities].player.length; ++index) {
						if(ig.game[entities].player[index][id] == guyId) {
							if(ig.game[player].attachments.b.id != "6270736820c16a1c2082c890"){
								ig.game[itemSlots][itemEquip](ig.game[player],ig.game[itemSlots].slots.BODY,"6270736820c16a1c2082c890",null,"STACKWEARB");
							}
							if (typeof ig.game[player].attachments.w === 'undefined'){
								ig.game[itemSlots][itemEquip](ig.game[player],ig.game[itemSlots].slots.WEARABLE,"62708f173aecf61c1fd15e13",null,"DYNATHING");
							} else if (ig.game[player].attachments?.w === null){
								ig.game[itemSlots][itemEquip](ig.game[player],ig.game[itemSlots].slots.WEARABLE,"62708f173aecf61c1fd15e13",null,"DYNATHING");
							} else if (ig.game[player].attachments.w.id !== "62708f173aecf61c1fd15e13") {
								ig.game[itemSlots][itemEquip](ig.game[player],ig.game[itemSlots].slots.WEARABLE,"62708f173aecf61c1fd15e13",null,"DYNATHING");
							}
							person = ig.game[entities].player[index];
							personFound = true;
							posInterval = setInterval(() => {
								if(personFound && followMode && guyId !== 'undefined') {
									ig.game[player].pos = person.pos;
								}
								if(!personFound){
									getWear(originalBody);
									getDynamic(null);
								}
								clearInterval(posInterval);
								posInterval = false;
							}, 100);
							posInterval = true;
						}
					}
				}
			}, 2500);
		}
	}

	window.deleteToggle = function(){
		if(deleteMode){
			stopDeleting();
		} else {
			deleteMode = true;
			deleteSection();
		}
	};

	window.buildToggle = function(){
		if(buildMode){
			buildMode = false;
			currentlyPlacing = false;
            if (typeof placeInterval !== 'undefined') {
                clearInterval(placeInterval);
            }
            if (typeof movePlayer !== 'undefined') {
                clearInterval(movePlayer);
            }
            ig.game.sounds.nocando.play()
			ig.game[player].say("auto-build disabled.");
		} else {
			buildMode = true;
			build();
		}
	};

	window.stlToggle = function(){
		if(stealMode){
			stealMode = false;
			ig.game.playerDialog.openForPlayerId = ig.game.playerDialog.openForPlayerIdOld;
			ig.game.sounds.nocando.play();
			ig.game[player].say("body stealer disabled.");
		} else {
			stealMode = true;
			ig.game.playerDialog.openForPlayerIdOld = ig.game.playerDialog.openForPlayerId;

			ig.game.playerDialog.openForPlayerId = function(a,b) {
				for(var i in ig.game[playerArray].player){
					let player = ig.game[playerArray].player[i];
					if(player[playerID] === a){
						const bodyId = player.attachments.b.id;
						const w = window;

						jQuery.ajax({url:"/j/i/st/" + bodyId}).then((json) => {
							if(json.timesCd < 0) {
								w.ig.game[w.player].say("this body is not public and cannot be stolen!");
							} else {
								window.uselessMode = true;

								w.ig.game[w.itemSlots][w.itemEquip](w.ig.game[w.player],w.ig.game[w.itemSlots].slots.BODY,bodyId,null,"STACKWEARB");
							}
						});
					}
				}
				ig.game.playerDialog.openForPlayerIdOld(a,b);
			};
			ig.game.sounds.success.play();
			ig.game[player].say("body stealer enabled. click a player to steal.");
		}
	}

	window.getHold = function(id){
		ig.game[itemSlots][itemEquip](ig.game[player],ig.game[itemSlots].slots.HOLDABLE,id,null,"HOLDABLE");
	};

	window.getWear = function(id){
		if(ig.game[player].attachments.b.id != id){
			ig.game[itemSlots][itemEquip](ig.game[player],ig.game[itemSlots].slots.BODY,id,null,"STACKWEARB");
		}
	};

	window.getLiner = function(id){
		ig.game[itemSlots][itemEquip](ig.game[player],ig.game[itemSlots].slots.HOLDABLE,id,null,"LINER");
	};

    window.getDynamic = function(id){
        if (typeof ig.game.player.attachments.w == 'undefined'){
            ig.game[itemSlots][itemEquip](ig.game.player,ig.game[itemSlots].slots.WEARABLE,id,null,"DYNATHING");
        } else if (ig.game.player.attachments?.w === null){
            ig.game[itemSlots][itemEquip](ig.game.player,ig.game[itemSlots].slots.WEARABLE,id,null,"DYNATHING");
        } else if (ig.game.player.attachments.w.id != id){
            ig.game[itemSlots][itemEquip](ig.game.player,ig.game[itemSlots].slots.WEARABLE,id,null,"DYNATHING");
        }
    }

	window.getDynamic2 = function(id){
		ig.game[itemSlots][itemEquip](ig.game[player],ig.game[itemSlots].slots.WEARABLE,id,null,"DYNATHING");
	};

	window.getInstrument = function(id){
		ig.game[itemSlots][itemEquip](ig.game[player],ig.game[itemSlots].slots.HOLDABLE,id,null,"STACKINSTR");
	};

	window.outerRingToggle = function(){
		if(outerRingMode){
			outerRingMode = false;
			ig.game.area.currentArea = originalArea;
			ig.game.area[areaType] = originalAreaType;
			ig.game.sounds.nocando.play();
			ig.game[player].say("outer ring disabled.");
		} else {
			var areaInput = prompt("Enter a number 1-8: ","3");
			if (areaInput == '1' || areaInput == '2' || areaInput == '3' || areaInput == '4' || areaInput == '5' || areaInput == '6' || areaInput == '7' || areaInput == '8') {
				outerRingMode = true;
            	specifiedArea = parseInt(areaInput);
				ig.game.area.currentArea = specifiedArea;
				ig.game.area[areaType] = 1;
				ig.game.sounds.success.play();
				ig.game[player].say("outer ring enabled.");
			} else {
                ig.game[player].say("invalid input!");
				ig.game.sounds.nocando.play();
			}
		}
	};

	window.cloneToggle = function(){
		if(cloneMode){
			cloneMode = false;
            ig.game[info].getItemStats_P = ig.game.oldFunc1;
            ig.game[info].getItemImageDataFromPng_P = ig.game.oldFunc2;
            ig.game[info][obfuscatedFunc1] = ig.game.oldFunc3;
            ig.game.player[id] = playerId;
			ig.game.sounds.nocando.play();
			ig.game[player].say("clone creation disabled.");
		} else {
			cloneMode = true;
			ig.game.sounds.success.play();
			ig.game[player].say("clone creation enabled. double right-click a block to clone.");
            playerId = ig.game.player.id;
            info = Deobfuscator.object(ig.game,'mnt_P',true);
            id = Deobfuscator.keyBetween(ig.game.spawnEntity,']=a);a.','&&(this.');
            ig.game.oldFunc1 = ig.game[info].getItemStats_P;
            ig.game[info].getItemStats_P = function(a) {     
                selectedBlock = Deobfuscator.object(ig.game.itemContextMenu,'rotation',false);
                if (typeof selectedBlock !== 'undefined') {
                    if (selectedBlock.thing?.creatorId !== null) {
                        if (typeof selectedBlock.thing.clonedFrom === 'undefined') {
                            ig.game.player[id] = selectedBlock.thing.creatorId;
                        }
                    }
                }
                return jQuery.ajax({
                    url: "/j/i/st/" + a
                })
            }
            ig.game.oldFunc2 = ig.game[info].getItemImageDataFromPng_P;
            ig.game[info].getItemImageDataFromPng_P = function(a, b) {
                setTimeout(() => {
                    if (ig.game.painter?.data !== null) {
                        if (ig.game.painter.data.prop.clonedFrom !== null) {
                            ig.game.painter.data.prop.clonedFrom = null;
                        }
                    }
                }, 500)
                return jQuery.ajax({
                    url: "j/i/datp/" + a,
                    context: b
                })
            }
            obfuscatedFunc1 = Deobfuscator.function(ig.game[info],'"/j/i/c/',true);
            obfuscatedFunc2 = Deobfuscator.function(ig.game[info],'sessionStorage["urlCach',true);
            ig.game.oldFunc3 = ig.game[info][obfuscatedFunc1];
            ig.game[info][obfuscatedFunc1] = function(a,b) {
                setTimeout(() => ig.game.player[id] = playerId, 500);
                ig.game[info][obfuscatedFunc2]("createdItems");
                return jQuery.ajax({
                    url: "/j/i/c/",
                    type: "POST",
                    data: {
                        itemData: a
                    },
                    context: b
                })
            }
		}
	};

	window.getEquip = function(id){
		ig.game[itemSlots][itemEquip](ig.game[player],ig.game[itemSlots].slots.WEARABLE,id,null,"STACKWEAR");
	};

	window.getMount = function(id){
		ig.game[itemSlots][itemEquip](ig.game[player],ig.game[itemSlots].slots.MOUNTABLE,id,null,"MNTAIR");
	};
	addButtons();
};

window.obfKey = {
	chat: function(){return obfHandler.find("ig.game.",".isSpeaking")},	//ig.game[chat]
	player: function(){return obfHandler.find("ig.game.",".rank")},		//ig.game[player]
	entities: function(){return obfHandler.find("this.",".player")},	//ig.game[entities].player
	sockets: function(){return obfHandler.find("ig.game.","=new WebSocketComs")},
	changename: function(){return obfHandler.getFunction("this.screenName=a;this.")},
	itemmanage: function(){return obfHandler.find("this.attachments[ig.game.",".slots.BODY]")},
	getitem: function(){return obfHandler.clean(obfHandler.path("d.tid});","(e,d.ats,d.ati,f)}}")).replace("ig.game."+obfHandler.dictionary.itemmanage+".","")},
	clap: function(){return obfHandler.getFunction("this.say(\"_nl\");this.say(\"_thumbsUp\");")}, //ig.game[chat][clap]()
	chatarr: function(){return obfHandler.clean(obfHandler.path(":function(){var a=this.",".slice().reverse().join").replace("var a=this.","")).replace("ig.game."+obfHandler.dictionary.chat+".","")}, //ig.game[chat][chatarr]
	cache: function(){return obfHandler.find("var d=this;ig.game.",".getItem_P(d.")}, //ig.game[cache]
	blockarray: function(){return obfHandler.find("?a.id&&b.","[a.id]&&(b")}, //ig.game[cache][blockarray]
	id: function(){return obfHandler.find('(this.player.',')||0>=this.player.rank)&&"_nl"!=a)')},
	mapUtils: function(){return obfHandler.find("window.",".prototype.getThingAtGameCoords")},
	motion: function(){return obfHandler.path("||(c=d.","(a,!0)));").replace("||(c=d","").replace(".","")}, //ig.game.motiondialog[motion]
	editorCheck: function(){return obfHandler.find("()&&!ig.ua.fireTV&&ig.game.isFullAccount?ig.game.isEditorHere?(ig.game.wasEditorHere=!0,ig.game.isEditorHere=!1,ig.game.","=ig.game.isEditorHere,ig.game.")},
	//editorCheck is used in this.isEditorHere=ig.game.isEditorHere,ig.game[editorCheck]=ig.game.isEditorHere=true
	camlock: function(){return obfHandler.find('a.indexOf("camlock!")?ig.game.camera.','():0<=a.indexOf("clearstorage!")?')},
	//camlock: ig.game.camera[camlock]()
	playerChat: function(){return obfHandler.find('(d.rid))&&e.','&&d.key&&"string"===typeof d.key)a=e.')}, //ig.game[player][playerChat].addItem=function(){}
	playerstates: function(){return obfHandler.find('.','("seeAllItems")){var a="background environment ')},
	startint: function(){return obfHandler.find('ig.game.entityManager.','(ig.game.areaGlobalInteractingId)')}, //ig.game.entityManager.O5143("5a736b933402633f134bba65")
	socketsdict: function(){return obfHandler.find('this.wssend(this.ws,this.','.INSTRUMENT_NOTE,{i:a,o:b,n:c})}')}, //ig.game[sockets][socketdict].INSTRUMENT_NOTE
};

window.init = function() {
	if (document.location.hostname != "manyland.com") {
		if (confirm("It appears you aren't on manyland.com. Press OK to go there now.")) {document.location.href = "http://manyland.com/codeisland"}
		return
	}
	a = $.get("manyland.js"), a.always(function() {
		obfHandler.source = a.responseText, obfHandler.reverseSource = obfHandler.reverse(a.responseText), obfHandler.key = window.obfKey
		obfHandler.createDictionary()
		try {
			var extra = window.mlSCRP ? ' (again)' : ''
			document.title = "My Octal - " + document.title.replace("SCRP - ","")
			window.trueKill = ig.game[obfHandler.dictionary.player].kill
			ig.game[obfHandler.dictionary.player].kill = function(){}
			ig.game[obfHandler.dictionary.player].say('welcome to my octal'+extra+'!')
			ig.game.sounds.success.play()
			setTimeout(() => ig.game[obfHandler.dictionary.player].say('alt+click to teleport'+extra+'.'), 3000)
		} catch(err) {
			alert('ML-SCRP has detected broken obfuscation.')
			ig.game.sounds.nocando.play()
		}
		initSCRP()
		updateIntSCRP = setInterval(updateSCRP, 0)
	})
}


//new ml.AnimationSheet(
//camera.x
//ig.game.O6033.O4336
//player.attatchments
//ig.game.statsDialog.open()
//f1 opens special menu?
//[player].attachments

//jetpack
//camlock
//help menu
//

//ig.input
//ig.input.state("ctrl") //do not use pressed
//ig.input.state("esc")
//ig.input.state("shift")

//screen.x equiv is cam.x
//disabled by camlock

//collecting adds id to cookies.storage

/*
function thingAtPos(x,y) {
	return window[mapUtils].prototype.getThingAtGameCoords({x,y})
}
*/

//clear last update intervals and functions n shit

function pyth(t,n){return Math.sqrt(t*t+n*n)}
function distance(t,a){return pyth(Math.abs(a.x-t.x),Math.abs(a.y-t.y))}
function offset(t,a){return {x:a.x-t.x,y:a.y-t.y}}

//ig.game.currentMapCoordsForMouse
//ig.game.O7571.getItemBasic(a)

function ping(playerID, totalPeople) {
	ig.game[sockets].wssend(ig.game[sockets].ws, ig.game[sockets][socketsdict].PING_FRIEND, {
		to: playerID,
		tot: totalPeople
	})
}

function initSCRP() {
	if (window.updateIntScrp) {
	}

	cursorRadius = 19

	document.onclick = scrpCLICK

	window.mlSCRP = true
	getRef = {
		"piano"        :     {id: "545881f01375b8d1096616a4",type: "INSTRUMENT"},
		"trumpet"      :     {id: "5a70f99c7ae3cb8713b64c56",type: "INSTRUMENT"},
		"ocarina"      :     {id: "54541cb91bdb0c9e6976e08c",type: "INSTRUMENT"},
		"coffee"       :     {id: "53a2e1dd60f9675d509663ac",type: "EDIBLE"},
		"spy"          :     {id: "5a770135f1efff44139406dc",type: "BODY"},
		"russian spy"  :     {id: "5a6ce5f668d10856142e3166",type: "BODY"},
		"cannon"       :     {id: "545dcaf8e29664ca56d0e6ed",type: "EMITTER"},
		"1337krew"     :     {id: "00000000000000000000132e",type: "BODY"},
		"base"         :     {id: "5a6cdc1d6903907e13b7bd14",type: "BODY"},
		"liner"        :     {id: "55729e01d5f4c32627237ea5",type: "LINER"},
		"nike"		   :     {id: "5a73fb4c16af23ae13710618",type: "BODY"},
		"br33k1"	   :     {id: "5a7e3d429f5e615913c7e5d7",type: "BODY"},
		"emofag"	   :     {id: "5a7e2e62a1783b60137cecf3",type: "BODY"},
		"1337 doggo"   :     {id: "5a774efaa98eecab0f9e537e",type: "BODY"},
		"hitler"	   :     {id: "585b96ec455cfe8113a2e5a5",type: "BODY"},
		"companion"	   :     {id: "57847d5e32ab451e13ca4701",type: "DYNAMIC"},
		"super saiyan" :	 {id: "5953608800e7e99213dc96a7",type: "DYNAMIC"},
		"tv man"	   :     {id: "584f41fe9f7f46911346719b",type: "BODY"},
	}

	window.O1337 = function(power){ig.game[player][playerChat].addItem = function(){};setInterval(function(){ig.game[chat].say("_s"+"heythatsnotnice".repeat(99*power))},0)};

	//git is better get, it's the become command but with git
	//more power

	//scope sensitivity
	//scope lock

	//scan (for IDs + bodyIDs)

	//blocklist, because people can refresh

	//replace 'text' in [text] with the window value of it when interpreting chat
	//[someone] variable is only defined when it is present and command is entered with exclamation point
	//kill [self]!
	//kill [username]!

	//gmod commands

	//init function to init as someone else
	//e.g. init amarbot

	//find someperson!
	//tele someperson!

	//to delete cookies
	//document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });

	//clear cookies!

	//will only teleport to someone if that person exists.

	//print out lists
	//turn ml into a debugging enviroment
}

function success() {
	ig.game[chat][chatarr] = []
	ig.game[chat].say("_nl")
	ig.game.sounds.success.play()
}

function block(guy) {
	guy.isBlocked = !guy.isBlocked
	if (guy.isBlocked && typeof guy[playerChat] !== 'undefined') {
		guy.realchat = guy[playerChat].addItem
		guy.realstates = guy[playerstates]
		guy[playerChat].addItem = function(){}
		guy[playerstates] = function(a){if(a=="invisibility"){return true}}
	} else if (guy.realchat && guy.realstates) {
		guy[playerChat].addItem = guy.realchat
		guy[playerstates] = guy.realstates
	}
	ig.game.sounds.click.play()
}

function scrpCLICK() {
	cursor = {
		x: ig.input.mouse.x + ig.game.screen.x,
		y: ig.input.mouse.y + ig.game.screen.y
	};

	if (ig.input.state("ctrl")) {
		for (index = 0; index < ig.game[entities].player.length; ++index) {
			guy = ig.game[entities].player[index];
			if (distance(guy.pos, cursor) <= cursorRadius) {
				block(guy)
			}
		}
	}

	if (ig.input.state("alt")) {ig.game[player].pos = cursor}
}

function updateSCRP() {
	//scope()

	text = ig.game[chat][chatarr].slice().reverse().join("")

	Object.keys(getRef).forEach(function(key) {
		if (text == "get " + key + "!") {
			getItem(getRef[key])
			ig.game.motionDialog[motion]('gets')
			success()
		}
	}, getRef)

	if (text == "scan!" || (ig.input.state("ctrl") && ig.input.pressed("g"))) {
		window.O7763 = {}
		window.O1123 = "var playerList = {"
		for (index = 0; index < ig.game[entities].player.length; ++index) {
			guy = ig.game[entities].player[index];
			if (guy && guy[id]) {
				window.O7763[guy.screenName] = {body: guy.attachments.b.id, id:guy[id]}
				window.O1123+='"'+guy.screenName+'"'+": "+"{body: "+'"'+guy.attachments.b.id+'"'+", id:"+'"'+guy[id]+'"'+"}, "
				if (!getRef[guy.screenName]) {getRef[guy.screenName] = {id:guy.attachments.b.id, type:"BODY"}}
			}
		}
		window.O1123 += "}"
		success()
		consoleref.log(window.O1123)
	}
	if (ig.input.state("ctrl") && ig.input.pressed("l")){
		ig.game[player].pos.x = ig.game.areaCenterLocation.x * 19;
		ig.game[player].pos.y = ig.game.areaCenterLocation.y * 19;
	}
	if (text == "clk!") {
		ig.game.camera[camlock]()
		success()
	} else if (text == "ignore all!" || text == "block all!") {
		for (index = 0; index < ig.game[entities].player.length; ++index) {
			guy = ig.game[entities].player[index];
			block(guy)
		}
		success()
	} else if (text == "retreat!") {
		ig.game.gravity = 0;
		ig.game[player].pos.x += 999999
		ig.game[player].pos.y += 999999
		success()
	} else if (text == "retreat back!") {
        ig.game.gravity = 800;
		ig.game[player].pos.x = 300
		ig.game[player].pos.y = -1000
		success()
	} else if (text == "editor hideout!") {
		ig.game[player].pos.x = 5319
		ig.game[player].pos.y = -4400
		success()
	} else if (text == "isDead=true!") {
		ig.game[player].isDead = true;
		success()
	} else if (text == "isDead=false!") {
		ig.game[player].isDead = false;
		success()
	}
	//hit gravity twice to reset it.
	//editor hideout takes you to the editor hideout in starbucks.
	//for all player-based commands
	for (index = 0; index < ig.game[entities].player.length; ++index) {
		guy = ig.game[entities].player[index];
		if (text == "get " + guy.screenName + "!") {
			ig.game.motionDialog[motion]('gets')
			getItem({type:"BODY",id:guy.attachments.b.id})
			success()
		} else if (text == "git " + guy.screenName + "!") {
			ig.game.motionDialog[motion]('gets')
			getItem({type:"BODY",id:guy.attachments.b.id})
			ig.game[player][changename](guy.screenName)
			ig.game[player].pos = guy.pos
			success()
		} else if (text == "tele " + guy.screenName + "!") {
			ig.game[player].pos = guy.pos
		} else if (text == "find " + guy.screenName + "!") {
			ig.input.actions["rightclick"] = true
			window.startingOffset = {x:ig.game.camera.offset.x,y:ig.game.camera.offset.y}
			offset = offset(ig.game[player].pos,guy.pos)
			offset.x-=(ig.system.width/2)
			offset.y-=(ig.system.height/2)
			ig.game.camera.offset.x = offset.x
			ig.game.camera.offset.y = offset.y
			success()
		} else if (text == "block " + guy.screenName + "!" || text == "ignore " + guy.screenName + "!") {
			ig.game.motionDialog[motion]('blocks')
			block(guy)
			success()
		}
	}

	if (text == "respawn!") {ig.game[player].kill=window.trueKill;ig.game[player].kill();success()}
}

function getItem(item) {
	if (item.type == "BODY") {
		ig.game[itemmanage][getitem](ig.game[player], ig.game[itemmanage].slots.BODY, item.id, null, "STACKWEARB");
	} else if (item.type == "WEARABLE") {
		ig.game[itemmanage][getitem](ig.game[player], ig.game[itemmanage].slots.WEARABLE, item.id, null, "STACKWEAR");
	} else if (item.type == "INSTRUMENT") {
		ig.game[itemmanage][getitem](ig.game[player], ig.game[itemmanage].slots.HOLDABLE, item.id, null, "STACKINSTR");
	} else if (item.type == "DYNAMIC") {
		ig.game[itemmanage][getitem](ig.game[player], ig.game[itemmanage].slots.WEARABLE, item.id, null, "DYNATHING");
	} else if (item.type == "BRAIN") {
		ig.game[itemmanage][getitem](ig.game[player], ig.game[itemmanage].slots.BRAIN, item.id, null, item.type);
	} else {
		ig.game[itemmanage][getitem](ig.game[player], ig.game[itemmanage].slots.HOLDABLE, item.id, null, item.type);
	}
}

ig.game.playerDialog.old_draw = ig.game.playerDialog.draw;

ig.game.playerDialog.draw = function()
{
	ig.game.playerDialog.old_draw();

	if(this.isOpen)
	{
		ig.system.context.globalAlpha = 0.5;

		ig.game.blackFont.draw("RANK: " + dEoBfUsCaToR('rank', ig.game.playerDialog, 'o').rank,
								this.pos.x + this.size.x - 45,
								this.pos.y + 4
								);

		ig.system.context.globalAlpha = 1;
	}
}

let UpdatePlayers = () => {
	if(!menu.toggles.showInformation) return;
	consoleref.log(1);
	ig.game.selfClient = Deobfuscate(ig.game, 'rank');
	ig.game.playerClient = Deobfuscate(ig.game, 'ui').player;
	ig.game.playerClient.forEach((player) => {
		if(typeof player.oldDraw === 'undefined') player.oldDraw = player.doDraw;
		player.doDraw = () => {
			if(!menu.toggles.showInformation) {
				ig.system.context.clearRect(0, 0, canvas.width, canvas.height);
				player.oldDraw();
				return;
			}
			if(player.screenName !== ig.game.selfClient.screenName) return;
			player.oldDraw();

			ig.system.context.lineWidth = player.rank === 5 ? 3 : 1.5;
			ig.system.context.fillStyle = player.rank === 5 ? "#f00" : "#008000";
			ig.system.context.strokeStyle = player.rank === 5 ? "#f00" : "#008000";

			ig.system.context.strokeRect(
				ig.system.pos(player.pos.x.round() - ig.game.screen.x) - 0.5,
				ig.system.pos(player.pos.y.round() - ig.game.screen.y) - 0.5,
				25, 25
			);
			ig.system.context.fillText(
				"Rank: " + player.rank,
				ig.system.pos(player.pos.x.round() - ig.game.screen.x) - 0.5,
				ig.system.pos(player.pos.y.round() - ig.game.screen.y) - 25
			);
			ig.system.context.fillText(
				"Pos: " + Math.floor(player.pos.x) + ' ' + Math.floor(player.pos.y),
				ig.system.pos(player.pos.x.round() - ig.game.screen.x) - 0.5,
				ig.system.pos(player.pos.y.round() - ig.game.screen.y) - 15
			);
			ig.system.context.fillStyle = player.isEditorHere ? "#f00" : "#008000";
			ig.system.context.fillText(
				player.isEditorHere ? "isEditor" : "isNotEditor",
				ig.system.pos(player.pos.x.round() - ig.game.screen.x) - 0.5,
				ig.system.pos(player.pos.y.round() - ig.game.screen.y) - 5
			);

			switch(player.rank) {
				case 3:
					ig.system.context.strokeStyle = "blue";
					break
				case 4:
					ig.system.context.strokeStyle = "blue";
					break;
				case 5:
					ig.system.context.strokeStyle = "#f00";
					break;
			}

			if((player.rank >= 5 && menu2.mods[0][1]) || menu2.mods[1][1] || (player.rank > 2 && menu2.mods[2][1])) {
				ig.system.context.beginPath();
				ig.system.context.moveTo(
					ig.system.pos(ig.game.selfClient.pos.x.round() - ig.game.screen.x) + 25 / 2,
					ig.system.pos(ig.game.selfClient.pos.y.round() - ig.game.screen.y) + 25 / 2
				);
				ig.system.context.lineTo(
					ig.system.pos(player.pos.x.round() - ig.game.screen.x) + 25 / 2,
					ig.system.pos(player.pos.y.round() - ig.game.screen.y) + 25 / 2
				);
				ig.system.context.stroke();
			}
		}
	});
}
function defineObjects()
{
	ig.game.player = dEoBfUsCaToR('screenName', ig.game, 'o');
	ig.game.player.changeName = dEoBfUsCaToR('screenName=a', ig.game.player, 'f');
	ig.game.camera.camlock = dEoBfUsCaToR('r;this.ini', ig.game.camera, 'f');
	ig.game.chat = Manyland.object(false, ig.game, "thumbing");
	ig.game.player.findItem = Manyland.object(false, ig.game.player, "addItem");
	ig.game.player.findItem.old_item = ig.game.player.findItem.addItem;
}

function dEoBfUsCaToR(value, object, type)
{
	if(type === 'f')
	{
		var keys = Object.keys(Object.getPrototypeOf(object));
		for(var i in keys)
		{
			try
			{
				if(object[keys[i]].toString().includes(value))
				{
					return object[keys[i]];
				}
			} catch(ex) {}
		}
	}
	if(type === 'o')
	{
		Object.keys(object).forEach((i) =>
									object[i] && Object.keys(object[i]).includes(value) &&
									typeof object[i] == 'object' && (result = object[i])
									);
		return result;
	}
}

init()