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
    currentlySpeaking = false;
    ig.game.nonLoggedInChatIfEditorAround = true;
    enableMotionChat = true;
    toggleMotionChat = function() {
        enableMotionChat = !enableMotionChat;
    }
    ml.Misc.thereIsAnEditorAround = function(){return true};
    sayLetter = async function(motionId, motionName) {
        ig.game.attachmentManager[useMotionClientSide](ig.game.player,motionId,null);
        ig.game.websocket[useMotion](motionId,motionName);
        await delay(300);
    };
    // array in order is a-z 1-9 0 . , ! ?
    characterMotions = [
        "62d10eedcddf781ec3fbdd8b",
        "62d1107c68b13d18d3a44eda",
        "62d113d88f7af605caa49b0d",
        "62d113213829c81eca37a5e6",
        "62d1109579380805c364d4c8",
        "62d110a4b32c1105c4982cb5",
        "62d110b268b13d18d3a44edc",
        "62d110ba79380805c364d4c9",
        "62d110c69c507718ce25ddb5",
        "62d110d08f7af605caa49afe",
        "62d1111a3829c81eca37a5d9",
        "62d1113721595e18cf66dc35",
        "62d1114d8f7af605caa49b00",
        "62d11168d83c301ed1cd2da8",
        "62d111879c507718ce25ddb8",
        "62d11197d83c301ed1cd2daa",
        "62d111bd3829c81eca37a5dd",
        "62d111d28f7af605caa49b03",
        "62d111ee68b13d18d3a44ede",
        "62d111fd21595e18cf66dc36",
        "62d112539c507718ce25ddc9",
        "62d1125b68b13d18d3a44ee2",
        "62d112739c507718ce25ddca",
        "62d112aa8f7af605caa49b07",
        "62d112bbcddf781ec3fbdd93",
        "62d130903829c81eca37a61f",
        "62e43fa03829c81eca3812ad",
        "62e43fd221595e18cf674444",
        "62e43fd9d83c301ed1cd9ce2",
        "62e43fe4d83c301ed1cd9ce3",
        "62e44009562d480453e0eccb",
        "62e44011cddf781ec3fc4456",
        "62e44019d83c301ed1cd9d16",
        "62e4402068b13d18d3a4b747",
        "62e440283829c81eca3812ce",
        "62e440f29c507718ce264a80",
        "62e4405721595e18cf6744c1",
        "62e4405d562d480453e0ed02",
        "62e4406c9051ab1ec4a70e65",
        "62e44063d83c301ed1cd9d60"
    ];
    //to load in all the motions
    for (let i = 0; i < 50; i++) {
        ig.game.attachmentManager[useMotionClientSide](ig.game.player,characterMotions[i],null);
        ig.game.websocket[useMotion](characterMotions[i],"dummyString");
        await delay(5);
    }
    setInterval(async () => {
        if (enableMotionChat) {
            for (let phraseIndex = 0; phraseIndex < ig.game.player[playerInfo][chat].length; phraseIndex++) {
                if (typeof ig.game.player[playerInfo][chat][phraseIndex].spoken === 'undefined') {
                    ig.game.player[playerInfo][chat][phraseIndex].timer.delta = function() {return -Infinity};
                }
            }
            if (!currentlySpeaking && ig.game.player[playerInfo][chat].length > 0) {
                playerChat = ig.game.player[playerInfo][chat][0];
                if (typeof playerChat.spoken === 'undefined' && playerChat.moving) {
                    playerChat.spoken = true;
                    playerChat.fadeIncrement = Infinity;
                    currentlySpeaking = true;
                    for (let i = 0; i < playerChat[content].length; i++) {
                        switch (playerChat[content][i]) {
                            case "a": 
                                await sayLetter(characterMotions[0],"a");
                                break;
                            case "b": 
                                await sayLetter(characterMotions[1],"b");
                                break;
                            case "c": 
                                await sayLetter(characterMotions[2],"c");
                                break;
                            case "d": 
                                await sayLetter(characterMotions[3],"d");
                                break;
                            case "e": 
                                await sayLetter(characterMotions[4],"e");
                                break;
                            case "f": 
                                await sayLetter(characterMotions[5],"f");
                                break;
                            case "g": 
                                await sayLetter(characterMotions[6],"g");
                                break;
                            case "h": 
                                await sayLetter(characterMotions[7],"h");
                                break;
                            case "i": 
                                await sayLetter(characterMotions[8],"i");
                                break;
                            case "j": 
                                await sayLetter(characterMotions[9],"j");
                                break;
                            case "k": 
                                await sayLetter(characterMotions[10],"k");
                                break;
                            case "l": 
                                await sayLetter(characterMotions[11],"l");
                                break;
                            case "m": 
                                await sayLetter(characterMotions[12],"m");
                                break;
                            case "n": 
                                await sayLetter(characterMotions[13],"n");
                                break;
                            case "o": 
                                await sayLetter(characterMotions[14],"o");
                                break;
                            case "p": 
                                await sayLetter(characterMotions[15],"p");
                                break;
                            case "q": 
                                await sayLetter(characterMotions[16],"q");
                                break;
                            case "r": 
                                await sayLetter(characterMotions[17],"r");
                                break;
                            case "s": 
                                await sayLetter(characterMotions[18],"s");
                                break;
                            case "t": 
                                await sayLetter(characterMotions[19],"t");
                                break;
                            case "u": 
                                await sayLetter(characterMotions[20],"u");
                                break;
                            case "v": 
                                await sayLetter(characterMotions[21],"v");
                                break;
                            case "w": 
                                await sayLetter(characterMotions[22],"w");
                                break;
                            case "x": 
                                await sayLetter(characterMotions[23],"x");
                                break;
                            case "y": 
                                await sayLetter(characterMotions[24],"y");
                                break;
                            case "z": 
                                await sayLetter(characterMotions[25],"z");
                                break;
                            case "1":
                                await sayLetter(characterMotions[26],"1");
                                break;
                            case "2":
                                await sayLetter(characterMotions[27],"2");
                                break;
                            case "3":
                                await sayLetter(characterMotions[28],"3");
                                break;
                            case "4":
                                await sayLetter(characterMotions[29],"4");
                                break;
                            case "5":
                                await sayLetter(characterMotions[30],"5");
                                break;
                            case "6":
                                await sayLetter(characterMotions[31],"6");
                                break;
                            case "7":
                                await sayLetter(characterMotions[32],"7");
                                break;
                            case "8":
                                await sayLetter(characterMotions[33],"8");
                                break;
                            case "9":
                                await sayLetter(characterMotions[34],"9");
                                break;
                            case "0":
                                await sayLetter(characterMotions[35],"0");
                                break;
                            case ".":
                                await sayLetter(characterMotions[36],".");
                                break;
                            case ",":
                                await sayLetter(characterMotions[37],",");
                                break;
                            case "!":
                                await sayLetter(characterMotions[38],"!");
                                break;
                            case "?":
                                await sayLetter(characterMotions[39],"?");
                                break;
                            case " ":
                                await delay(300);
                                break;
                            default:
                                break;  
                        }
                    }
                    await delay(300);
                    currentlySpeaking = false;
                    playerChat.timer.delta = function() {return Infinity};
                }
            }
        }
    }, 0);
}

explorerChat();
