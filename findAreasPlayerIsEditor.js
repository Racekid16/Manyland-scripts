// wait for editorData to load in, then you can find worlds that someone is editor 
// by typing findAreasPlayerIsEditor(the player's id) in console
// type findAreasPlayerIsStarEditor(the player's id) in console to find worlds someone is star editor
// updating editor data only adds new worlds, doesn't update editor lists of ones that were already included
// if you want to make a whole new array of editorData, run getEditorData() but can take hours

const delay = async (ms = 1000) =>  new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    if (typeof Deobfuscator === 'undefined') {
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js");
    }
    numActiveRequests = 0;
    maxSimultaneousRequests = 250;
    const onConfirmRefresh = function (event) {
        event.preventDefault();
        return event.returnValue = "Are you sure you want to leave the page?";
    }
    window.addEventListener("beforeunload", onConfirmRefresh, { capture: true });
    ig.game.player.say("getting previously loaded editor data... please allow up to one minute.");
    await $.ajax({
        url: "https://racekid16.neocities.org/editorData.js",
        dataType: "script",
        timeout: 0
    }).done(function() {
        ig.game.player.say('loaded editor data.');
    }).fail(function() {
        ig.game.player.say('failed to load editor data.');
    });
    while (ig.game.player.vel.x != 0 || ig.game.player.vel.y != 0) {
        await delay(100);
    }
    response2 = prompt('Would you like to update the editorData array to include new areas?\n(yes/no)','yes').toLowerCase();
    defineUtilityFunctions();
    if (response2 == "yes") {
        updateEditorData();
    }
})();

async function getEditorData() {
    editorData = [];
    if (window.XMLHttpRequest) {
        siteMaps_xml = new XMLHttpRequest();
    } else {
        siteMaps_xml = new ActiveXObject("Microsoft.XMLHTTP");
    }
    siteMaps_xml.open("GET", 'https://manyland.com/sitemaps/index.sitemap.xml', false);
    siteMaps_xml.send();
    siteMaps_str = siteMaps_xml.responseXML;
    siteMaps = siteMaps_str.getElementsByTagName("loc");
    for (let i = 1; i < siteMaps.length; i++) {
        siteMap = siteMaps[i].childNodes[0].nodeValue;
        if (window.XMLHttpRequest) {
            var letter_xml = new XMLHttpRequest();
        } else {
            var letter_xml = new ActiveXObject("Microsoft.XMLHTTP");
        }
        letter_xml.open("GET", siteMap, false);
        letter_xml.send();
        letter_str = letter_xml.responseXML;
        areaNames = letter_str.getElementsByTagName("loc");
        for (let j = 0; j < areaNames.length; j++) {
            let areaUrl = areaNames[j].childNodes[0].nodeValue;
            let areaName = areaUrl.substring(areaUrl.lastIndexOf("/") + 1);
            while (numActiveRequests >= maxSimultaneousRequests) {
                await delay(1);
            }
            getEditorsOfArea(areaName);
        }
    }
    editorData.sort((a, b) => a[0].localeCompare(b[0]));
    ig.game.player.say("done getting areas' editor data.");
    defineUtilityFunctions();
}

async function getEditorsOfArea(areaName) {
    numActiveRequests++;
    let fetchedData = [false, false]
    while (!fetchedData[0]) {
        try {
            var areaData = await jQuery.ajax({
                headers: {
                    "cache-control": "no-cache"
                },
                url: "/j/i/",
                type: "POST",
                data: {
                    urlName: areaName,
                    buster: Date.now()
                },
                success: function() {
                    fetchedData[0] = true;
                }
            });
        } catch (error) {
            //nothing
        }
    }
    let areaId = areaData.aid;
    while (!fetchedData[1]) {
        try {
            var areaEditorData = await jQuery.ajax({
                url: "/j/f/gan/",
                type: "POST",
                data: {
                    id: areaId
                },
                success: function() {
                    fetchedData[1] = true;
                }
            });
        } catch (error) {
            //nothing
        }
    }
    numActiveRequests--;
    editorData.push([areaName, areaEditorData.editors]);
}

function defineUtilityFunctions() {
    updateEditorData = function() {
        consoleref.log("updating editor data array...");
        editorDataObj = {};
        for (let element of editorData) {
            editorDataObj[element[0]] = element[1];
        }
        if (window.XMLHttpRequest) {
            siteMaps_xml = new XMLHttpRequest();
        } else {
            siteMaps_xml = new ActiveXObject("Microsoft.XMLHTTP");
        }
        siteMaps_xml.open("GET", 'https://manyland.com/sitemaps/index.sitemap.xml', false);
        siteMaps_xml.send();
        siteMaps_str = siteMaps_xml.responseXML;
        siteMaps = siteMaps_str.getElementsByTagName("loc");
        for (let i = 1; i < siteMaps.length; i++) {
            siteMap = siteMaps[i].childNodes[0].nodeValue;
            if (window.XMLHttpRequest) {
                var letter_xml = new XMLHttpRequest();
            } else {
                var letter_xml = new ActiveXObject("Microsoft.XMLHTTP");
            }
            letter_xml.open("GET", siteMap, false);
            letter_xml.send();
            letter_str = letter_xml.responseXML;
            areaNames = letter_str.getElementsByTagName("loc");
            for (let j = 0; j < areaNames.length; j++) {
                let areaUrl = areaNames[j].childNodes[0].nodeValue;
                let areaName = areaUrl.substring(areaUrl.lastIndexOf("/") + 1);
                if (typeof editorDataObj[areaName] === 'undefined') {
                    getEditorsOfArea(areaName);
                    consoleref.log('added ' + areaName + ' to editorData array');
                }
            }
        }
        editorData.sort((a, b) => a[0].localeCompare(b[0]));
        consoleref.log("done updating areas' editor data.");
    }
    findAreasPlayerIsEditor = function(playerId) {
        let areasWherePlayerIsEditor = [];
        for (let element of editorData) {
            for (let object of element[1]) {
                if (object.id == playerId) {
                    areasWherePlayerIsEditor.push(element[0]);
                }
            }
        }
        consoleref.log(areasWherePlayerIsEditor);
    }
    findAreasPlayerIsStarEditor = function(playerId) {
        let areasWherePlayerIsStarEditor = [];
        for (let element of editorData) {
            for (let object of element[1]) {
                if (object.id == playerId && typeof object.isListEditor !== 'undefined') {
                    areasWherePlayerIsStarEditor.push(element[0]);
                }
            }
        }
        consoleref.log(areasWherePlayerIsStarEditor);
    }
    findEditorsOfArea = async function(areaName) {
        let fetchedData = [false, false]
        while (!fetchedData[0]) {
            try {
                var areaData = await jQuery.ajax({
                    headers: {
                        "cache-control": "no-cache"
                    },
                    url: "/j/i/",
                    type: "POST",
                    data: {
                        urlName: areaName,
                        buster: Date.now()
                    },
                    success: function() {
                        fetchedData[0] = true;
                    }
                });
            } catch (error) {
                //nothing
            }
        }
        let areaId = areaData.aid;
        while (!fetchedData[1]) {
            try {
                var areaEditorData = await jQuery.ajax({
                    url: "/j/f/gan/",
                    type: "POST",
                    data: {
                        id: areaId
                    },
                    success: function() {
                        fetchedData[1] = true;
                    }
                });
            } catch (error) {
                //nothing
            }
        }
        consoleref.log(areaEditorData.editors);
    }
    copyEditorData = async function() {
        if (location.protocol === 'https:') {
            ig.game.player.say("click somewhere on your screen.");
            await delay(5000);
            navigator.clipboard.writeText('editorData = '+ JSON.stringify(editorData)).then(function() {
                ig.game.player.say("editor data successfully copied to clipboard!");
            }, function() {
                ig.game.player.say("failed to copy editor data to clipboard.");
            });
        } else {
            ig.game.player.say("must be in https to copy editor data using this function.");
        }
    }
    playerName = Deobfuscator.keyBetween(ig.game.playerDialog.draw,'globalAlpha=0.8;ig.game.blackFont.draw(this.',',this.pos.x+a,this.pos.y+this.');
    playerData = Deobfuscator.keyBetween(ig.game.playerDialog.draw,'.MAIN){if(this.','.isFullAccount){for(b=this.');
    ig.game.playerDialog.oldOpenProfile = ig.game.playerDialog.openForPlayerId;
    ig.game.playerDialog.openForPlayerId = async function(a, b, c) {
        ig.game.playerDialog.oldOpenProfile(a, b, c);
        await delay(200);
        consoleref.log(ig.game.playerDialog[playerName] + "'s id is " + ig.game.playerDialog[playerData].id);
    }
}
