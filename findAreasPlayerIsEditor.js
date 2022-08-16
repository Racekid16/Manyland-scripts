// goes through all areas with at least 10 visits that aren't unlisted and whose name doesn't start with j
// makes an array of all such areas and their respective editors
// once done getting data (can take hours), you can JSON.stringify(editorData) and save it to a .txt file
// if you have editorData, you can find worlds that someone is editor 
// by typing findAreasPlayerIsEditor(the player's id) in console
// type findAreasPlayerIsStarEditor(the player's id) in console to find worlds someone is star editor
// updating editor data only adds new worlds, doesn't update editor lists of ones that were already included

const delay = async (ms = 1000) =>  new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    numActiveRequests = 0;
    maxSimultaneousRequests = 250;
    const onConfirmRefresh = function (event) {
        event.preventDefault();
        return event.returnValue = "Are you sure you want to leave the page?";
    }
    window.addEventListener("beforeunload", onConfirmRefresh, { capture: true });
    response = prompt('Do you want to create a new editor dataset of all available areas?\nOtherwise, previously requested editor data will load in (recommended).\n(yes/no)','no').toLowerCase();
    if (response == "yes") {
        getEditorData();
    } else {
        consoleref.log("getting previously loaded editor data... please allow up to two minutes.");
        await $.ajax({
            url: "https://racekid16.neocities.org/editorData.js",
            dataType: "script",
            timeout: 0
        }).done(function() {
            consoleref.log('loaded editor data.');
        })
        .fail(function() {
            consoleref.log('failed to load editor data.');
        });
        defineUtilityFunctions();
        response2 = prompt('Would you like to update the editorData array to include new areas?\n(yes/no)','yes').toLowerCase();
        if (response2 == "yes") {
            updateEditorData();
        }
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
    consoleref.log("done getting areas' editor data.");
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
                    consoleref.log(areaName);
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
                if (object.id == playerId && Object.hasOwn(object, 'isListEditor')) {
                    areasWherePlayerIsStarEditor.push(element[0]);
                }
            }
        }
        consoleref.log(areasWherePlayerIsStarEditor);
    }
    copyEditorData = function() {
        if (location.protocol === 'https:') {
            navigator.clipboard.writeText(JSON.stringify(editorData));
        } else {
            consoleref.log("must be in https to copy editor data using this function.");
        }
    }
}
