// ==UserScript==
// @name         Steal skin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  alt+click a person to copy their body id, alt + right click a block in your inventory to set its id to the person's body id then drag to place it
// @author       You
// @match        http://manyland.com/*
// @match        https://manyland.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    setTimeout(() => {
        // alt+click a user to copy a skin's id to your clipboard
        // alt+right click a block in your inventory, then drag and place it.
        // the block you alt+right clicked has its id set to whatever was copied to your clipboard
        // only works if manyland is running in https

        async function getDeobfuscator() {
            if (typeof Deobfuscator === 'undefined') {
                await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js");
            }
        };

        async function stealSkin() {
            await getDeobfuscator();
            id = Deobfuscator.keyBetween(ig.game.spawnEntity,']=a);a.','&&(this.');
            ig.game.playerDialog.openForPlayerIdOld = ig.game.playerDialog.openForPlayerId;
            function copyToClipBoard(content) {
                navigator.clipboard.writeText(content);
                ig.game.player.say("copied body id!")
            }
            ig.game.playerDialog.openForPlayerId = function(a,b) {
                if (ig.input.state("alt")) {
                    for (var i in ig.game.players) {
                        let player = ig.game.players[i];
                        if (player[id] === a) {
                            copyToClipBoard(player.attachments.b.id);
                        }
                    }
                }
                ig.game.playerDialog.openForPlayerIdOld(a,b);
            }
            obfOb1 = Deobfuscator.object(ig.game,'mnt_P',true);
            async function pasteBodyId() {
                bodyId = await navigator.clipboard.readText();
                selectedBlock.thing.id = bodyId;
                ig.game.player.say("pasted body id!")
            }
            ig.game[obfOb1].getItemStats_P = function(a) {
                if (ig.input.state("alt")) {
                    selectedBlock = Deobfuscator.object(ig.game.itemContextMenu,'rotation',false);
                    if (typeof selectedBlock !== 'undefined') {
                        if (selectedBlock.thing?.id !== null) {
                            pasteBodyId();
                        }
                    }
                }
                return jQuery.ajax({
                    url: "/j/i/st/" + a
                })
            }
        }

        stealSkin();
    }, 3000)
})();