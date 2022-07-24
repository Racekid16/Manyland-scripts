// right click the creation you want to clone twice then drag it to the create button
// can also collect clone history and profile creations by right clicking them twice
// then hovering your cursor over the collect button

async function getDeobfuscator() {
    if (typeof Deobfuscator === 'undefined') {
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js"); 
    }   
};

async function cloneCreation() {
    await getDeobfuscator();
    playerId = ig.game.player.id;
    obfOb1 = Deobfuscator.object(ig.game,'mnt_P',true);
    id = Deobfuscator.keyBetween(ig.game.spawnEntity,']=a);a.','&&(this.');
    ig.game[obfOb1].getItemStats_P = function(a) {     
        selectedBlock = Deobfuscator.object(ig.game.itemContextMenu,'rotation',false);
        if (typeof selectedBlock !== 'undefined') {
            if (selectedBlock.thing?.creatorId !== null) {
                if (typeof selectedBlock.thing.attributes !== 'undefined') {
                    if (typeof selectedBlock.thing.attributes.clonable !== 'undefined') {
                        return jQuery.ajax({
                            url: "/j/i/st/" + a
                        })
                    }
                }
                ig.game.player[id] = selectedBlock.thing.creatorId;
            }
        }
        return jQuery.ajax({
            url: "/j/i/st/" + a
        })
    }
    ig.game[obfOb1].getItemImageDataFromPng_P = function(a, b) {
        setTimeout(() => {
            if (ig.game.painter?.data !== null) {
                if (ig.game.player[id] != playerId) {
                    ig.game.painter.data.prop.clonedFrom = a;
                }
            }
        }, 500)
        return jQuery.ajax({
            url: "j/i/datp/" + a,
            context: b
        })
    }
    obfFunc1 = Deobfuscator.function(ig.game[obfOb1],'"/j/i/c/',true);
    obfFunc2 = Deobfuscator.function(ig.game[obfOb1],'sessionStorage["urlCach',true);
    ig.game[obfOb1][obfFunc1] = function(a,b) {
        setTimeout(() => ig.game.player[id] = playerId, 500);
        ig.game[obfOb1][obfFunc2]("createdItems");
        return jQuery.ajax({
            url: "/j/i/c/",
            type: "POST",
            data: {
                itemData: a
            },
            context: b
        })
    }
}

cloneCreation();
