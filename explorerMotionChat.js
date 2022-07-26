// type like normal. your player will automatically use motions that everyone can see based on what you typed.

const delay = async (ms = 1000) =>  new Promise(resolve => setTimeout(resolve, ms));

async function getDeobfuscator() {
    if (typeof Deobfuscator === 'undefined') {
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js"); 
    }   
};

async function explorerChat() {
    await getDeobfuscator();
    firstObfFunc = Deobfuscator.function(ig.game.brainManager, 'f.type=this.enumType.sound,a.push(f)', true);
    playerInfo = Deobfuscator.object(ig.game.player,'addItem',true);
    chat = Deobfuscator.keyBetween(ig.game.brainManager[firstObfFunc],`d<c.${playerInfo}.`,'.length;d++');
    content = Deobfuscator.keyBetween(ig.game.brainManager[firstObfFunc],'f={};f.content=e.',';f.type=this.enumType.speech;f.fromId');
    useMotionClientSide = Deobfuscator.function(ig.game.attachmentManager,'var d=!1;if(a){var e=this.',true);
    useMotion = Deobfuscator.function(ig.game.websocket,'.MOTION,{mid:a,n:b})',true);
    ig.game.nonLoggedInChatIfEditorAround = true;
    fadeText = Deobfuscator.function(ig.game.player[playerInfo][chat])
    currentlySpeaking = false;
    ml.Misc.thereIsAnEditorAround = function(){return true};
    sayLetter = async function(motionId, motionName) {
        ig.game.attachmentManager[useMotionClientSide](ig.game.player,motionId,null);
        ig.game.websocket[useMotion](motionId,motionName);
        await delay(300);
    };
    //to load in all the motions
    ig.game.player.say("abcdefghijklmnopqrstuvwxyz");
    ig.game.player.say("1234567890.,!?");
    setInterval(async () => {
        for (let phraseIndex = 0; phraseIndex < ig.game.player[playerInfo][chat].length; phraseIndex++) {
            if (typeof ig.game.player[playerInfo][chat][phraseIndex].spoken === 'undefined') {
                ig.game.player[playerInfo][chat][phraseIndex].timer.delta = function() {return -Infinity};
            }
        }
        if (!currentlySpeaking && ig.game.player[playerInfo][chat].length > 0) {
            playerChat = ig.game.player[playerInfo][chat][0];
            if (typeof playerChat.spoken === 'undefined' && playerChat.moving) {
                playerChat.spoken = true;
                playerChat.fadeIncrement = 10;
                currentlySpeaking = true;
                ig.game.player.kill = function(){};
                for (let i = 0; i < playerChat[content].length; i++) {
                    switch (playerChat[content][i]) {
                        case "a": 
                            await sayLetter("62d10eedcddf781ec3fbdd8b","a");
                            break;
                        case "b": 
                            await sayLetter("62d1107c68b13d18d3a44eda","b");
                            break;
                        case "c": 
                            await sayLetter("62d113d88f7af605caa49b0d","c");
                            break;
                        case "d": 
                            await sayLetter("62d113213829c81eca37a5e6","d");
                            break;
                        case "e": 
                            await sayLetter("62d1109579380805c364d4c8","e");
                            break;
                        case "f": 
                            await sayLetter("62d110a4b32c1105c4982cb5","f");
                            break;
                        case "g": 
                            await sayLetter("62d110b268b13d18d3a44edc","g");
                            break;
                        case "h": 
                            await sayLetter("62d110ba79380805c364d4c9","h");
                            break;
                        case "i": 
                            await sayLetter("62d110c69c507718ce25ddb5","i");
                            break;
                        case "j": 
                            await sayLetter("62d110d08f7af605caa49afe","j");
                            break;
                        case "k": 
                            await sayLetter("62d1111a3829c81eca37a5d9","k");
                            break;
                        case "l": 
                            await sayLetter("62d1113721595e18cf66dc35","l");
                            break;
                        case "m": 
                            await sayLetter("62d1114d8f7af605caa49b00","m");
                            break;
                        case "n": 
                            await sayLetter("62d11168d83c301ed1cd2da8","n");
                            break;
                        case "o": 
                            await sayLetter("62d111879c507718ce25ddb8","o");
                            break;
                        case "p": 
                            await sayLetter("62d11197d83c301ed1cd2daa","p");
                            break;
                        case "q": 
                            await sayLetter("62d111bd3829c81eca37a5dd","q");
                            break;
                        case "r": 
                            await sayLetter("62d111d28f7af605caa49b03","r");
                            break;
                        case "s": 
                            await sayLetter("62d111ee68b13d18d3a44ede","s");
                            break;
                        case "t": 
                            await sayLetter("62d111fd21595e18cf66dc36","t");
                            break;
                        case "u": 
                            await sayLetter("62d112539c507718ce25ddc9","u");
                            break;
                        case "v": 
                            await sayLetter("62d1125b68b13d18d3a44ee2","v");
                            break;
                        case "w": 
                            await sayLetter("62d112739c507718ce25ddca","w");
                            break;
                        case "x": 
                            await sayLetter("62d112aa8f7af605caa49b07","x");
                            break;
                        case "y": 
                            await sayLetter("62d112bbcddf781ec3fbdd93","y");
                            break;
                        case "z": 
                            await sayLetter("62d130903829c81eca37a61f","z");
                            break;
                        case "1":
                            await sayLetter("62dfd7d121595e18cf67274e","1");
                            break;
                        case "2":
                            await sayLetter("62dfd870e9afae18d183025d","2");
                            break;
                        case "3":
                            await sayLetter("62dfd8cb9051ab1ec4a6efad","3");
                            break;
                        case "4":
                            await sayLetter("62dfd9e9d83c301ed1cd7b27","4");
                            break;
                        case "5":
                            await sayLetter("62dfda329c507718ce262acc","5");
                            break;
                        case "6":
                            await sayLetter("62dfdaa5e9afae18d183027c","6");
                            break;
                        case "7":
                            await sayLetter("62dfdb149c507718ce262acd","7");
                            break;
                        case "8":
                            await sayLetter("62dfdb99cf3b8e04653b9e47","8");
                            break;
                        case "9":
                            await sayLetter("62dfdbf921595e18cf672771","9");
                            break;
                        case "0":
                            await sayLetter("62dfe0913148320472822bd2","0");
                            break;
                        case ".":
                            await sayLetter("62dfe0f921595e18cf672780",".");
                            break;
                        case ",":
                            await sayLetter("62dfde3c3829c81eca37f3ad",",");
                            break;
                        case "!":
                            await sayLetter("62dfdc82cf3b8e04653b9e4a","!");
                            break;
                        case "?":
                            await sayLetter("62dfdcf221595e18cf672777","?");
                            break;
                        case " ":
                            await delay(400);
                            break;
                        default:
                            break;  
                    }
                }
                await delay (400);
                currentlySpeaking = false;
                playerChat.timer.delta = function() {return Infinity};
            }
        }
    }, 0);
}

explorerChat();