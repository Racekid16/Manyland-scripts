// prints all text sent by any user nearby to the ad bar
// also prints the player's name, id, and the time they sent the message
// the more you can see on screen, the larger the area where text will be logged
// blocking a player will prevent their text from appearing in the log (good for fnf children spamming log)
// keep tab actively running to work while offtab
// the "Save Log" button allows you to save the log as a .txt file

// maybe add list of players in the world to begin with, and log when a new player is added to the player array?

function getBar() {
    const elements = document.getElementsByTagName('div');

    for (let e of elements) {
        if (e.onmouseover !== null) {
            return e;
        }
    }
}

let startTime = new Date();
let dateToday = startTime.getMonth() + 1 + "-" + startTime.getDate() + "-" + startTime.getFullYear();
let timeNow = startTime.getHours() + ":" + startTime.getMinutes() + ":" + startTime.getSeconds();

divWidth = $('div')[0].clientWidth;
divHeight = $('div')[0].clientHeight;
window.old = getBar();
old.innerHTML = `
<style>
#wrapper { 
    width: ${divWidth}px; 
    height: ${divHeight}px; 
    background-color: #3477e3;
    overflow-y: auto; 
    overflow-x: hidden;
    color: white; 
    text-shadow: 0px 0px 10px #fff; 
    font-family: 'SIMSUN'; 
    font-size: 80%;
} 
#title {
    text-align: center;
    text-shadow: 0px 0px 10px #fff; 
    font-family: 'SIMSUN';
    font-weight: bold;
    color: white;
}
pre {
    width: ${divWidth}px;
    white-space: pre-wrap;
    word-wrap: break-word;
    text-align: left;
    padding-left: 20px;
}
</style>
<div id="wrapper"> 
    <div id = "title">log for ${dateToday} at ${timeNow} in ${ig.game.areaName}</div>
    <br></br>
    <pre id = "textarea"></pre>
    <button onclick = 'saveAs()'> Save Log </button>
</div>
`;

let fileHandle;

opts = {
    suggestedName: `log_${dateToday}_${startTime.getHours()}.${startTime.getMinutes()}.${startTime.getSeconds()}_${ig.game.areaName}`,
    types: [{
        description: 'Text file',
        accept: {'text/plain': ['.txt']},
    }],
}

saveAs = async () => {
    if (location.protocol === 'https:') {
        fileHandle = await window.showSaveFilePicker(opts);
        let stream = await fileHandle.createWritable();
        await stream.write(wrapper.innerText);
        await stream.close();
    } else {
        ig.game.player.say('must be in https to save logs!');
    }
}

addText = (string, color) => {
    let container = document.createElement("div");
    container.appendChild(document.createTextNode(string));
    container.style.color = color;
    textarea.appendChild(container);
}

const theElement = document.getElementById('wrapper');

const scrollToBottom = (node) => {
    if (Math.abs(node.scrollHeight - node.clientHeight - node.scrollTop) < 100) {
        node.scrollTop = node.scrollHeight;
    }
}

async function getDeobfuscator() {
    if (typeof Deobfuscator === 'undefined') {
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js");
    }
}

async function logChat() {
    await getDeobfuscator();
    firstObfFunc = Deobfuscator.function(ig.game.brainManager, 'f.type=this.enumType.sound,a.push(f)', true);
    entities = Deobfuscator.object(ig.game, "betweenDefaultAndPlayer", true);
    playerInfo = Deobfuscator.object(ig.game.player,'addItem',true);
    chat = Deobfuscator.keyBetween(ig.game.brainManager[firstObfFunc],`d<c.${playerInfo}.`,'.length;d++');
    content = Deobfuscator.keyBetween(ig.game.brainManager[firstObfFunc],'f={};f.content=e.',';f.type=this.enumType.speech;f.fromId');
    setInterval(() => {
        scrollToBottom(theElement);
        for (let playerIndex = 0; playerIndex < ig.game[entities].player.length; playerIndex++) {
            for (let phraseIndex = 0; phraseIndex < ig.game[entities].player[playerIndex][playerInfo][chat].length; phraseIndex++) {
                playerChat = ig.game[entities].player[playerIndex][playerInfo][chat][phraseIndex];
                if (typeof playerChat.logged === 'undefined' && playerChat.moving && playerChat[content] != "") {
                    playerChat.logged = true;
                    let today = new Date();
                    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    playerName = ig.game[entities].player[playerIndex].screenName;
                    playerId = ig.game[entities].player[playerIndex][id];
                    addText(`${time} ${playerName} ${playerId}:`, 'white');
                    addText(`\t${playerChat[content]}\n`, 'black');
                }
            }
        }
    }, 0);
}

logChat();