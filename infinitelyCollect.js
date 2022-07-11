// must wear a body you created for this to work and stay on tab
// set thingId to the id of the thing you want to gain collects 
// the number of collects should update within an hour and a half

const delay = async (ms = 1000) =>  new Promise(resolve => setTimeout(resolve, ms));
    
async function infinitelyCollect() {
    await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js");
    thingId = "62c61ddd4233100265e26f48";
    bodyId = ig.game.player.attachments.b.id;
    setInterval(async () => {
        addToBody();
        await delay(50);
        deleteFromBody();
    }, 100);
}

function addToBody(){
    return jQuery.ajax({
        url:"/j/i/am/",
        type:"POST",
        data:{
            mid:thingId,
            bid:bodyId,
            pos:"0"
        }
    })
}
    
function deleteFromBody(){
    return jQuery.ajax({
        url:"/j/i/dm/",
        type:"POST",
        data:{
            mid:thingId,
            bid:bodyId,
            pos:"0"
        }
    })
}

infinitelyCollect();