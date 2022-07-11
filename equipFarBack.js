// right click the far back you want to equip, then you can equip it

async function getDeobfuscator() {
    if (typeof Deobfuscator === 'undefined') {
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js"); 
    }   
};

async function equipFarBack() {
    await getDeobfuscator();
    changeFarBackType = Deobfuscator.object(ig.game,'mnt_P',false);
    changeFarBackType.getItemStats_P = function(a) {     
        selectedBlock = Deobfuscator.object(ig.game.itemContextMenu,'rotation',false);
        if (typeof selectedBlock !== 'undefined') {
            if (selectedBlock.thing.base === "FARBACK") {
                selectedBlock.thing.base = "STACKWEARB";
            }
        }
        return jQuery.ajax({
            url: "/j/i/st/" + a
        })
    }
}

equipFarBack();