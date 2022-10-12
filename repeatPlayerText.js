// click on a player. you will repeat all text they say.
// your text copying theirs does not show up client side, but everyone else can see it.

const delay = async (ms = 1000) =>  new Promise(resolve => setTimeout(resolve, ms));

async function getDeobfuscator() {
    if (typeof Deobfuscator === 'undefined') {
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js");
    }
};

async function repeatPlayerText() {
    await getDeobfuscator();
    playerName = Deobfuscator.keyBetween(ig.game.playerDialog.draw,'globalAlpha=0.8;ig.game.blackFont.draw(this.',',this.pos.x+a,this.pos.y+this.');
    playerData = Deobfuscator.keyBetween(ig.game.playerDialog.draw,'.MAIN){if(this.','.isFullAccount){for(b=this.');
    ig.game.playerDialog.oldOpenProfile = ig.game.playerDialog.openForPlayerId;
    ig.game.playerDialog.openForPlayerId = async function(a, b, c) {
        ig.game.playerDialog.oldOpenProfile(a, b, c);
        await delay(200);
        if (ig.game.playerDialog[playerData].id != ig.game.player.id) {
            pName = ig.game.playerDialog[playerName];
            playerId = ig.game.playerDialog[playerData].id;
            consoleref.log("you are now repeating " + pName + "'s text.");
        }   
    }
    receiveWs = Deobfuscator.function(ig.game.websocket,')this.socketManagerId=d.smi,this.', true);
    ig.game.websocket.oldRecieveWs = ig.game.websocket[receiveWs];
    ig.game.websocket[receiveWs] = function(a, b, c, d) {
        if (b.m == "en" && typeof playerId != 'undefined' && b.data.rid == playerId) {
            ig.game.websocket.wssend(ig.game.websocket.ws,"en",{key:b.data.key});
        }
        ig.game.websocket.oldRecieveWs(a, b, c, d);
    }
}

repeatPlayerText();
