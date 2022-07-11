// paste the script in a player-made open edits world.
// it'll allow you to edit even in the inner 100 block radius without spawn edits.

async function getDeobfuscator() {
    if (typeof Deobfuscator === 'undefined') {
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js"); 
    }   
};

async function editArea() {
    await getDeobfuscator();
    obfVar1 = Deobfuscator.object(ig.game,'removeItemFromMap',false);
    areaProtection = Deobfuscator.keyBetween(obfVar1.removeItemFromMap,'if(("ANY"==ig.game.','||ig.game.');
    ig.game[areaProtection] = "INDIVIDUALS";
}

editArea();