// OCTAL Menu- credit to r4tb0y for the original version, edited by me
// Edited off Octal version 1.5
// A mishmash of octal, proto, ml-scrp, and my additions.
// Credit to r4tb0y and parse for the respective scripts.
// shift + click to teleport.
// God Mode is automatically enabled.
// Has all the capability of ml-scrp.
// Has rank show on profile from proto.
// Has my some of my own scripts/bodies/equippables.
// Don't give this script to anyone, or tell anyone who made it.

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

function addButtons(){document.getElementById("buttons").innerHTML = `<tbody><tr> <th> </th> <th>S C R I P T S</th> <th></th> </tr> <tr> <td onclick="camMove();">stalk</td><td id="3" onclick="numToggle();">1337 speak</td><td onclick="spamToggle();">item spam</td></tr><tr><td id="4" onclick="spdToggle();">speedhack</td><td onclick="outerRingToggle();">outer ring</td><td onclick="velToggle()">velocity</td></tr><tr><td onclick="stlToggle();">bodysteal</td><td onclick="dynaToggle();">dynasteal</td><td onclick="itemToggle();">itemsteal</td><td></td></tr><tr><th></th><th>B O D I E S</th><th></th></tr><tr><td id="8" onclick="getWear(&quot;60d73d21b909cc04fd1e7401&quot;);">baller</td><td onclick="getWear(&quot;611c2ef6a14d99140e8fe124&quot;);">american</td><td onclick="getWear(&quot;59d6e6c9fc2289031047af27&quot;);">gang beast</td></tr><tr><td onclick="getWear(&quot;00000000000000000000132e&quot;);">1337krew</td><td onclick="getWear(&quot;530d1898ccae7a5e0b00005b&quot;);">philipp</td><td id="9" onclick="getWear(&quot;6255fd7415a3c305de7a55d7&quot;);">vendetta</td></tr><tr><td onclick="getWear(&quot;5eb71ff47e619416f1e53340&quot;);">elephant</td><td id="7" onclick="getWear(&quot;6270736820c16a1c2082c890&quot;);">invisible</td><td onclick="getWear(&quot;5dc1a57faf966810c0b354d1&quot;);">trump</td></tr><tr></tr> <tr> </tr> <tr> <th> </th> <th>E Q U I P</th> <th></th> </tr> <tr> <td id="10" onclick="getLiner(&quot;5680cfe4beaa04916a8e75d9&quot;);">bluefish</td><td id="17" onclick="getDynamic(&quot;60f978c0bf42e239cb7c0830&quot;);">giant wall</td><td id="12" onclick="getDynamic(&quot;62708f173aecf61c1fd15e13&quot;);">gay</td></tr><tr><td id="11" onclick="getEquip(&quot;61606dbd249d4a05bae56292&quot;);">wearable</td><td id="13" onclick="getLiner(&quot;58e2940720c888a611b65b18&quot;);">lazer</td> <td id="14" onclick="getLiner(&quot;55b05f724f85cf2f41aeef48&quot;);">ban hammer</td></tr><tr><td id="16" onclick="getMount(&quot;627070b69aea641f4d356f30&quot;);">invisifly</td><td id="18" onclick="getMount(&quot;627071202079481f4a1e1a8b&quot;);">invisimount</td><td id="15" onclick="getLiner(&quot;52e1932fa4f2e65117000004&quot;);">sticky hand</td></tr>   </tbody>`};

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
	border-bottom: 12px solid #9600ff;
	border-top: 12px solid #9600ff;
	background-color: #00b8ff;
	text-align: center;
	}

	td {
	color: #4900ff;
	text-align: center;
	cursor: pointer;
	}

	th {
	color: #4900ff;
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
	<tr>
		<th>
		</th>
		<th>S C R I P T S</th>
		<th></th>
	</tr>
	<tr>
	<td id='1' onclick='godToggle();'>godmode</td>
	<td id='2' onclick='telToggle();'>mteleport</td>
	<td id='3' onclick='velToggle();'>velocity</td>
	</tr>
	<tr>
	<td id='4' onclick='spdToggle();'>speedhack</td>
	<td id='5' onclick='sloToggle();'>slowmo</td>
	<td id='6' onclick='namToggle();'>namechng</td>
	</tr>
	<tr>
		<th>
		</th>
		<th>B O D I E S</th>
		<th></th>
	</tr>
	<tr>
	<td id='7' onclick='getWear("00000000000000000000132e");'>1337krew</td>
	<td id='8' onclick='getWear("5a3a1115ead7574f14a410de");'>blob</td>
	<td id='9' onclick='getWear("59f4ffd0818568a6137a8277");'>lil pump</td>
	</tr>
	<tr>
		<th>
		</th>
		<th>H O L D A B L E S</th>
		<th></th>
	</tr>
	<tr>
	<td id='10' onclick='getInstrument("545881f01375b8d1096616a4");'>piano</td>
	<td id='11' onclick='getInstrument("54541cb91bdb0c9e6976e08c");'>ocarina</td>
	<td id='12' onclick='getInstrument("5a70f99c7ae3cb8713b64c56");'>trumpet</td>
	</tr><tr>
	<td id='13' onclick='getInstrument("5b0e5f0d4d143663abd155e0");'>fiddle</td>
	<td id='14' onclick='getLiner("55729e01d5f4c32627237ea5");'>liner</td>
	<td id='15' onclick='getLiner("599338f0ff256cf30ffc9df2");'>r4tb0y</td>
	</tr><tr>
	<td id='16' onclick='getMount("530cc760f7047b0f2e000034");'>fmount</td>
	<td id='17' onclick='getDynamic("5b01f4c09cefa671a8d48a57");'>saiyan-g</td>
	<td id='18' onclick='getDynamic("5b01f4e9ee1b811b12eb90ed");'>saiyan-y</td>
	</tr>
	<tr>
		<th>
		</th>
		<th>T H E M E S</th>
		<th></th>
	</tr>
	<tr>
	<td id='19' onclick='loadHTML();'>default</td>
	<td id='20' onclick='loadElite();'>elite</td>
	<td id='21' onclick='loadWave();'>vprwave</td>
	</tr>
	</table>
	</div>`
}

htmlSettings().then(() => {loadOCTAL()});

function loadOCTAL(){
	window.killFunc = ig.game[player].kill;
	window.godMode = false;
	window.teleMode = false;
	window.veloMode = false;
	window.speedMode = false;
	window.slowMode = false;
	window.outerRingMode = false;
	window.spamMode = false;
	window.nameMode = false;
	window.stealMode = false;
	window.camMode = false;
	window.numberMode = false;
	window.dynaMode = false;
	window.itemMode = false;
	window.jumpMode = false;
	window.randMode = false;

	window.velocity = function(press){
		if(press.keyCode == '37'){
			ig.game[player].vel.x = -400;
		} else if(press.keyCode == '39'){
			ig.game[player].vel.x = +400;
		} else if(press.keyCode == '38'){
			ig.game[player].vel.y = -1600;
		} else if(press.keyCode == '40'){
			ig.game[player].vel.y = +1600;
		}
	}

	var menu = new Object();
	menu.freeze= ig.game[player].update


	window.stalk = function(press){
		if(press.keyCode == '37'){
			ig.game.camera.offset.x -= 10;
		} else if(press.keyCode == '39'){
			ig.game.camera.offset.x += 10;
		} else if(press.keyCode == '38'){
			ig.game.camera.offset.y -= 10;
		} else if(press.keyCode == '40'){
			ig.game.camera.offset.y += 10;
		}
	}

	// window.setPName = function(){
	// 	var nameInput = prompt("Enter a username: ","1337krew");
	// 	ig.game[player][nameChange](nameInput);
	// }

	window.mTeleport = function(){
		ig.game[player].pos.x = ig.game.screen.x + ig.input.mouse.x;
		ig.game[player].pos.y = ig.game.screen.y + ig.input.mouse.y;
	}

	window.telToggle = function(){
		if(teleMode){
			teleMode = false;
			document.onclick = function(){};
			ig.game.sounds.nocando.play();
			ig.game[player].say("mouse teleport disabled.");
		} else {
			teleMode = true;
			setTimeout(function(){document.onclick = mTeleport;},50);
			ig.game.sounds.success.play();
			ig.game[player].say("mouse teleport enabled.");
		}
	}

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

	window.velToggle = function(){
		if(veloMode){
			veloMode = false;
			document.onkeydown = function(){};
			ig.game.sounds.nocando.play();
			ig.game[player].say("velocity disabled.");
		} else {
			veloMode = true;
			document.onkeydown = velocity;
			ig.game.sounds.success.play();
			ig.game[player].say("velocity enabled.");
		}
	};

	window.camMove = function(){
		if(camMode){
			camMode = false;
			ig.game[player].update = menu.freeze
			document.onkeydown = function(){};
			ig.game.camera[camlock]()
			ig.game.camera[camlock]()
			ig.game[player].say("stalking disabled");
		} else {
			camMode = true;
			ig.game[player].say("stalking enabled.");
			ig.game[player].update = function(){}
			document.onkeydown = stalk;
			ig.game.sounds.success.play();
		}
	};

	window.spdToggle = function(){
		if(speedMode){
			speedMode = false;
			ml.Timer.prototype.timeScale = 1;
			ig.game.sounds.nocando.play();
			ig.game[player].say("speedhack disabled.");
		} else {
			speedMode = true;
			ml.Timer.prototype.timeScale = 3;
			ig.game.sounds.success.play();
			ig.game[player].say("speedhack enabled.");
		}
	};

	window.itemToggle = function(){
		if(itemMode){
			itemMode = false;
			ig.game.playerDialog.openForPlayerId = ig.game.playerDialog.openForPlayerIdOld;
			ig.game.sounds.nocando.play();
			ig.game[player].say("item stealer disabled.");
		} else {
			itemMode = true;
			ig.game.playerDialog.openForPlayerIdOld = ig.game.playerDialog.openForPlayerId;

			ig.game.playerDialog.openForPlayerId = function(a,b) {
				for(var i in ig.game[playerArray].player){
					let player = ig.game[playerArray].player[i];
					if(player[playerID] === a){
						if (typeof player.attachments.h != 'undefined' && player.attachments?.h !== null) {
							const itemId = player.attachments.h.id;
							const z = window;

							jQuery.ajax({url:"/j/i/st/" + itemId}).then((json) => {
								if(json.timesCd < 0) {
									z.ig.game[z.player].say("this item is not public and cannot be stolen!");
								} else {
									window.uselessMode = true;

									z.ig.game[z.itemSlots][z.itemEquip](z.ig.game[z.player],z.ig.game[z.itemSlots].slots.HOLDABLE,itemId,null,"STACKHOLD");
								}
							});
						}
					}
				}
				ig.game.playerDialog.openForPlayerIdOld(a,b);
			};
			ig.game.sounds.success.play();
			ig.game[player].say("item stealer enabled.");
		}
	};

	window.dynaToggle = function(){
		if(dynaMode){
			dynaMode = false;
			ig.game.playerDialog.openForPlayerId = ig.game.playerDialog.openForPlayerIdOld;
			ig.game.sounds.nocando.play();
			ig.game[player].say("dynamic stealer disabled.");
		} else {
			dynaMode = true;
			ig.game.playerDialog.openForPlayerIdOld = ig.game.playerDialog.openForPlayerId;

			ig.game.playerDialog.openForPlayerId = function(a,b) {
				for(var i in ig.game[playerArray].player){
					let player = ig.game[playerArray].player[i];
					if(player[playerID] === a){
						if (typeof player.attachments.w != 'undefined' && player.attachments?.w !== null){
							const dynaId = player.attachments.w.id;
							const z = window;

							jQuery.ajax({url:"/j/i/st/" + dynaId}).then((json) => {
								if(json.timesCd < 0) {
									z.ig.game[z.player].say("this dynamic is not public and cannot be stolen!");
								} else {
									window.uselessMode = true;

									z.ig.game[z.itemSlots][z.itemEquip](z.ig.game[z.player],z.ig.game[z.itemSlots].slots.WEARABLE,dynaId,null,"DYNATHING");
								}
							});
						}
					}
				}
				ig.game.playerDialog.openForPlayerIdOld(a,b);
			};
			ig.game.sounds.success.play();
			ig.game[player].say("dynamic stealer enabled.");
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
			ig.game[player].say("body stealer enabled.");
		}
	}

	window.getHold = function(id){
		ig.game[itemSlots][itemEquip](ig.game[player],ig.game[itemSlots].slots.HOLDABLE,id,null,"HOLDABLE");
	};

	window.getWear = function(id){
		ig.game[itemSlots][itemEquip](ig.game[player],ig.game[itemSlots].slots.BODY,id,null,"STACKWEARB");
	};

	window.getLiner = function(id){
		ig.game[itemSlots][itemEquip](ig.game[player],ig.game[itemSlots].slots.HOLDABLE,id,null,"LINER");
	};

	window.getDynamic = function(id){
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

	window.spamToggle = function(){

		if(spamMode){
			spamMode = false;
			ig.game.brainManager.control.action = false;
			ig.game.sounds.nocando.play();
			ig.game[player].say("item spam disabled.");
		} else {
			spamMode = true;
			ig.game.brainManager.control.action = true;
			ig.game.sounds.success.play();
			ig.game[player].say("item spam enabled.");
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
			setTimeout(() => ig.game[obfHandler.dictionary.player].say('shift+click to teleport'+extra+'.'), 3000)
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

//sensitivity variable for scopce

function block(guy) {
	guy.isBlocked = !guy.isBlocked
	if (guy.isBlocked) {
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

	if (ig.input.state("shift")) {ig.game[player].pos = cursor}
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