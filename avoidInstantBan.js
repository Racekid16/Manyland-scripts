async function getDeobfuscator(){
    if (typeof Deobfuscator === 'undefined') 
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js");    
};
async function avoidInstantBan(){
    await getDeobfuscator();
    obfOb1 = Deobfuscator.object(ig.game,'mnt_P',true)
    obfFunc1 = Deobfuscator.function(ig.game[obfOb1], '/j/u/p/"', true);
    ig.game.errorManager.kicked = function(){};
    ig.game[obfOb1][obfFunc1] = function(){};
}

avoidInstantBan();