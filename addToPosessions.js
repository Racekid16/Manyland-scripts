//addPossession('item id here')
//the id used in this script is for a flying mount

async function getDeobfuscator() {
    if (typeof Deobfuscator === 'undefined') {
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js");
    }
};

async function addPossession(itemId) {
    await getDeobfuscator();
    possessionArray = Deobfuscator.keyBetween(ig.game.motionDialog.removeAllAreaPossessionItems,'.length){for(var a=[],b=0;b<this.','.length;b++)this.');
    obfVar1 = Deobfuscator.object(ig.game,'getItemBasic',true);
    alreadyPossessed = false;
    for (let item of ig.game.motionDialog[possessionArray]) {
        if (item.id == itemId) {
            alreadyPossessed = true;
            break;
        }
    }
    if (!alreadyPossessed) {
        ig.game.motionDialog[possessionArray].push(ig.game[obfVar1].getItemBasic(itemId, "ui_md2", void 0, !0));
    }
}

function removePossessions() {
    ig.game.motionDialog.removeAllAreaPossessionItems();
}

addPossession('5542a14b9fa66ce57d9adc0e');
