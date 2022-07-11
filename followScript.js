// follow script. Follows the specified player even if they reload.
// click on the player you want to follow.
// you can also specify which player by typing guyId = 'their player id' in the console.
// much of the code comes from ml-scrp.
// alt+s to stop following someone.

async function getDeobfuscator() {
    if (typeof Deobfuscator === 'undefined') {
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js");
    }
}

async function init() {
    await getDeobfuscator();
    itemEquip = Deobfuscator.function(ig.game.attachmentManager,'(c);!e&&!a.O',true);
    originalBody = ig.game.player.attachments.b.id;
    ig.game.playerDialog.openProfile = ig.game.playerDialog.openForPlayerId;
    posInterval = false;
    selectPlayer();
    toggle = setInterval(() => {
        if (ig.input.state("alt") && ig.input.pressed("s")) {
            guyId = 'undefined';
            ig.game.playerDialog.openForPlayerId = ig.game.playerDialog.openProfile;
        }
    }, 0);
}

function selectPlayer() {
	ig.game.playerDialog.openForPlayerId = function(a,b) {
        for (let player of ig.game.players) {
            if (player[id] === a) {
                guyId = player[id];
            }
        }
        ig.game.playerDialog.openProfile(a,b);
	}
	findInterval = setInterval(findPlayer, 2500);
}

function findPlayer() {
    updatePlayers();
	if (typeof guyId != 'undefined' && !posInterval) {
		guyFound = false;
		for (let player of ig.game.players) {
			if (player[id] == guyId) {
				getWear("6270736820c16a1c2082c890");
				getDynamic("62708f173aecf61c1fd15e13");
				guy = player;
				guyFound = true;
				posInterval = setInterval(setPosition, 100);
                posInterval = true;
            }
		}
	}
}

function setPosition() {
	if (guyFound && guyId != 'undefined') {
        ig.game.player.pos = guy.pos;
	}
	if (!guyFound) {
		getWear(originalBody);
		getDynamic(null);
	}
    clearInterval(posInterval);
    posInterval = false;
}

window.getWear = function(id) {
    if (ig.game.player.attachments.b.id != id) {
	    ig.game.attachmentManager[itemEquip](ig.game.player,ig.game.attachmentManager.slots.BODY,id,null,"STACKWEARB");
    }
};

window.getDynamic = function(id) {
	if (typeof ig.game.player.attachments.w == 'undefined') {
		ig.game.attachmentManager[itemEquip](ig.game.player,ig.game.attachmentManager.slots.WEARABLE,id,null,"DYNATHING");
	} else if (ig.game.player.attachments?.w === null) {
		ig.game.attachmentManager[itemEquip](ig.game.player,ig.game.attachmentManager.slots.WEARABLE,id,null,"DYNATHING");
	} else if (ig.game.player.attachments.w.id != id) {
	    ig.game.attachmentManager[itemEquip](ig.game.player,ig.game.attachmentManager.slots.WEARABLE,id,null,"DYNATHING");
    }
};

init();