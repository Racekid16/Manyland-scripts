//reduces your area lock to 1 minute.
async function getDeobfuscator() {
    if (typeof Deobfuscator === 'undefined') {
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js"); 
    }   
};

//can get the area's id by visiting it as an explorer, then typing ig.game.areaId into console
async function overwriteAreaLock() {
    await getDeobfuscator();
    jQuery.ajax({
        url: "/j/a/aab/",
        type: "POST",
        data: {
            areaId: 3,
            userId: ig.game.player.id,
            minutesOrNullIfPermanent: "1",
            reason: "testing",
        }
    })
}

overwriteAreaLock();