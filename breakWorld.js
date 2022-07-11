// only works in worlds you're editor in
// paste the area id in the specified places for this to work

function Minute(){

    a = "paste area id here";
    b = {
        id: "paste area id here", 
        name: "", 
        urlName: "", 
        description: "", 
        protection: "INDIVIDUALS", 
        editors: "", supers: "", 
        drift: {angle: 271, speed: 100},    //change the angle and drift to 0 if trying to undo
        areaGroupId: "paste area id here", 
        interactingId: undefined, 
        generatorId: null, 
        isSubArea: false, 
        backOverrideRgb: null, 
        isSinglePersonExperience: false, 
        isUnlisted: false, 
        nonLoggedInChatIfEditorAround: false, 
        titleFont: undefined
    };
    
    return jQuery.ajax({
        url:"/j/a/u/",
        type:"POST",
        data:{
            id:a,
            areaData:b
        }
    });
}

Minute();