// click on a player. you will repeat all text they say.
// note: if they spam letters, you will temporarily stop.
// also does not copy their upvotes.

const delay = async (ms = 1000) =>  new Promise(resolve => setTimeout(resolve, ms));

async function getDeobfuscator() {
    if (typeof Deobfuscator === 'undefined') {
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js");
    }
};

async function repeatPlayerText() {
    await getDeobfuscator();
    sayWord = Deobfuscator.object(ig.game, 'thumbing', true);
    firstObfFunc = Deobfuscator.function(ig.game.brainManager, 'f.type=this.enumType.sound,a.push(f)', true);
    entities = Deobfuscator.object(ig.game, "betweenDefaultAndPlayer", true);
    playerInfo = Deobfuscator.object(ig.game.player,'addItem',true);
    chat = Deobfuscator.keyBetween(ig.game.brainManager[firstObfFunc],`d<c.${playerInfo}.`,'.length;d++');
    content = Deobfuscator.keyBetween(ig.game.brainManager[firstObfFunc],'f={};f.content=e.',';f.type=this.enumType.speech;f.fromId');
    ig.game.nonLoggedInChatIfEditorAround = true;
    ml.Misc.thereIsAnEditorAround = function(){return true}
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
    oldPlayerChatLength = 0;
    lastSaidNewLine = false;
    setInterval(()=> {
        if (typeof playerId != 'undefined') {
            playerIndex = ig.game[entities].player.findIndex((player) => player[id] == playerId);
            targetPlayer = ig.game[entities].player[playerIndex];
            if (typeof targetPlayer != 'undefined') { 
                playerChat = targetPlayer[playerInfo][chat];
                if (typeof playerChat != 'undefined' && playerChat.length != 0) {
                    if (playerChat[playerChat.length - 1].moving) {
                        if (!lastSaidNewLine) {
                            ig.game[sayWord].say('_nl');
                            oldPlayerChatLength = 0;
                            lastSaidNewLine = true;
                        }
                    } else {
                        mostRecentWord = playerChat[playerChat.length - 1][content];
                        theirLastSaidLetter = mostRecentWord[mostRecentWord.length - 1];
                        if (typeof theirLastSaidLetter != 'undefined') {
                            if (mostRecentWord.length > oldPlayerChatLength) {
                                ig.game[sayWord].say('_s' + theirLastSaidLetter);
                                oldPlayerChatLength = mostRecentWord.length;
                                lastSaidNewLine = false;
                            } else if (mostRecentWord.length < oldPlayerChatLength) {
                                ig.game[sayWord].say('_~');
                                oldPlayerChatLength = mostRecentWord.length;
                                lastSaidNewLine = false;
                            }
                        }
                    }
                }
            }
        }
    }, 0)
}

repeatPlayerText();