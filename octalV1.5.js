// octal 1.5 by r4tb0y but I changed it so it now works

// OCTAL MENU - By r4tb0y/syswalker
// add me on discord! - r4tb0y#5690 || i can provide invites to the manyland-community discord server
// greetz to my boy Parse, F, S, and anyone who gives a shit in the manyland-community discord server
// after pasting this in the javascript developer console, the adbar will be replaced by a menu with a few buttons
// very self explanatory, very easy to use, and no chat commands necessary
// i may update this later with a body stealer among some other features
// thanks for stickin' around, boys

//update 1.1: added a new loader so that slower connections can handle the offsite code being loaded
//(this means no more need for setTimeout on the "loadOCTAL()" function!

//update 1.2: the long-awaited body stealer is here! simply click the button and then click any player to steal their body.
//(it adds a dynamic where you stole it to give credit to my phat menu, hit ESC to remove it.)

//update 1.3: added sounds when you click on menu buttons to know when something is enabled or disabled
//(you also get a client-side chat message.)

//update 1.4: completely reworked loader (jQuery request & await instead of trycatch spam like a skid)
//(also new bodysteal improvements.)

//update 1.5: added a new button to set your name
//(lets you set your name to just symbols/numbers)

function addButtons(){document.getElementById("buttons").innerHTML = `<tbody><tr> <th> </th> <th>S C R I P T S</th> <th></th> </tr> <tr> <td id="1" onclick="godToggle();">godmode</td> <td id="2" onclick="telToggle();">mteleport</td> <td id="3" onclick="velToggle();">velocity</td> </tr> <tr> <td id="4" onclick="spdToggle();">speedhack</td> <td id="5" onclick="sloToggle();">slowmo</td> <td id="6" onclick="namToggle();">namechng</td> </tr> <tr> <td onclick="setPName();">setname</td> <td onclick="stlToggle();">bodysteal</td> <td></td> </tr> <tr> </tr><tr> <th> </th> <th>B O D I E S</th> <th></th> </tr> <tr> <td id="7" onclick="getWear(&quot;00000000000000000000132e&quot;);">1337krew</td> <td id="8" onclick="getWear(&quot;5a3a1115ead7574f14a410de&quot;);">blob</td> <td id="9" onclick="getWear(&quot;59f4ffd0818568a6137a8277&quot;);">lil pump</td> </tr> <tr> <th> </th> <th>H O L D A B L E S</th> <th></th> </tr> <tr> <td id="10" onclick="getInstrument(&quot;545881f01375b8d1096616a4&quot;);">piano</td> <td id="11" onclick="getInstrument(&quot;54541cb91bdb0c9e6976e08c&quot;);">ocarina</td> <td id="12" onclick="getInstrument(&quot;5a70f99c7ae3cb8713b64c56&quot;);">trumpet</td> </tr><tr> <td id="13" onclick="getInstrument(&quot;5b0e5f0d4d143663abd155e0&quot;);">fiddle</td> <td id="14" onclick="getLiner(&quot;55729e01d5f4c32627237ea5&quot;);">liner</td> <td id="15" onclick="getLiner(&quot;599338f0ff256cf30ffc9df2&quot;);">r4tb0y</td> </tr><tr> <td id="16" onclick="getMount(&quot;530cc760f7047b0f2e000034&quot;);">fmount</td> <td id="17" onclick="getDynamic(&quot;5b01f4c09cefa671a8d48a57&quot;);">saiyan-g</td> <td id="18" onclick="getDynamic(&quot;5b01f4e9ee1b811b12eb90ed&quot;);">saiyan-y</td> </tr> <tr> <th> </th> <th>T H E M E S</th> <th></th> </tr> <tr> <td id="19" onclick="loadHTML();setTimeout(function(){addButtons()},50);">default</td> <td id="20" onclick="loadElite();setTimeout(function(){addButtons()},50);">elite</td> <td id="21" onclick="loadWave();setTimeout(function(){addButtons()},50);">vprwave</td> </tr> </tbody>`};

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

async function loadHTML() {
    window.old = getBar();
    old.innerHTML = `
    <style>body {
    margin: 0px;
    }

    #cheatMenu {
    height: 974px;
    width: 317px;
    background-color: #602320;
    }

    #title {
    text-align: center;
    font-family: 'ubMono';
    font-weight: bold;
    color: #602320;
    width: 317px;
    background-color: #dc6900;
    padding-top: 2%;
    height: 4%;
    font-size: 190%;
    border-bottom: 8px solid #e0301e;
    border-top: 8px solid #e0301e;
    cursor: cell;
    }

    #titlebg {
    width: 317px;
    background-color: #dc6900;
    }

    #buttons {
    margin-top: 10%;
    font-family: 'ubMono';
    border-bottom: 12px solid #e0301e;
    border-top: 12px solid #e0301e;
    background-color: #eb8c00;
    text-align: center;
    }

    td {
    color: #602320;
    text-align: center;
    cursor: pointer;
    }

    th {
    color: #602320;
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
        </div>`;
}

function loadElite() {
    window.old = getBar();
    old.innerHTML = `
    <style>body {
    margin: 0px;
    }

    #cheatMenu {
    height: 974px;
    width: 317px;
    background-color: #25ce00;
    }

    #title {
    text-align: center;
    font-family: 'ubMono';
    font-weight: bold;
    color: #25ce00;
    width: 317px;
    background-color: #606060;
    padding-top: 2%;
    height: 4%;
    font-size: 190%;
    border-bottom: 8px solid #2d2d2d;
    border-top: 8px solid #2d2d2d;
    cursor: cell;
    }

    #titlebg {
    width: 317px;
    background-color: #606060;
    }

    #buttons {
    margin-top: 10%;
    font-family: 'ubMono';
    border-bottom: 12px solid #2d2d2d;
    border-top: 12px solid #2d2d2d;
    background-color: #606060;
    text-align: center;
    }

    td {
    color: #25ce00;
    text-align: center;
    cursor: pointer;
    }

    th {
    color: #25ce00;
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

function loadWave() {
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

loadHTML().then(() => {loadOCTAL()});

function loadOCTAL(){
window.killFunc = ig.game[player].kill;
window.godMode = false;
window.teleMode = false;
window.veloMode = false;
window.speedMode = false;
window.slowMode = false;
window.nameMode = false;
window.stealMode = false;
window.nameInterval;

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

window.nChng = function(){
	ig.game[player][nameChange](Math.floor(Math.random() * 1000000).toString())
}

window.setPName = function(){
	var nameInput = prompt("Enter a username: ","1337krew");
	ig.game[player][nameChange](nameInput);
}

window.mTeleport = function(){
	ig.game[player].pos.x = ig.game.screen.x + ig.input.mouse.x;
	ig.game[player].pos.y = ig.game.screen.y + ig.input.mouse.y;
}

window.godToggle = function(){
	if(godMode){
			godMode = false;
			ig.game[player].kill = killFunc;
			ig.game.sounds.nocando.play();
			ig.game[player].say("god mode disabled.");
		} else {
			godMode = true;
			ig.game[player].kill = function(){};
			ig.game.sounds.success.play();
			ig.game[player].say("god mode enabled.");
	}
};

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

window.sloToggle = function(){
	if(slowMode){
			slowMode = false;
			ml.Timer.prototype.timeScale = 1;
			ig.game.sounds.nocando.play();
			ig.game[player].say("slowmo disabled.");
		} else {
			slowMode = true;
			ml.Timer.prototype.timeScale = 0.3;
			ig.game.sounds.success.play();
			ig.game[player].say("slowmo enabled.");
	}
};

window.namToggle = function(){
	if(nameMode){
			nameMode = false;
			clearInterval(nameInterval);
			ig.game.sounds.nocando.play();
			ig.game[player].say("name changer disabled.");
		} else {
			nameMode = true;
			nameInterval = setInterval(nChng, 750);
			ig.game.sounds.success.play();
			ig.game[player].say("name changer enabled.");
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
                        if(json.timesCd < 5) {
                            w.ig.game[w.player].say("this body is not public and cannot be stolen!");
                        } else {
                            getDynamic("5ace87b77c33f413868a2e25");

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

window.getMount = function(id){
	ig.game[itemSlots][itemEquip](ig.game[player],ig.game[itemSlots].slots.MOUNTABLE,id,null,"MNTAIR");
};
addButtons();
};