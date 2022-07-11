// if you create an area in the same session after pasting this script it'll be a semi-open edits area

async function getDeobfuscator(){
    if (typeof Deobfuscator === 'undefined') 
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js");    
};
async function createSemiOpenEditsArea(){
    await getDeobfuscator();
    obfOb1 = Deobfuscator.object(ig.game,'mnt_P',false);
    obfFunc1 = Deobfuscator.function(obfOb1,'"/j/a/nu/"', true);
    obfOb1[obfFunc1] = function(a) {
        ig.game.areaDialog.data.protection = 'CITIZENS';
        return jQuery.ajax({
            url: "/j/a/nu/" + a
        })
    }
}
createSemiOpenEditsArea();