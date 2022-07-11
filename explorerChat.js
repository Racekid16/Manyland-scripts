// if both the explorer and the other party have this pasted, they can talk to each other.

ig.game.nonLoggedInChatIfEditorAround = true;
ml.Misc.thereIsAnEditorAround = function(){return true}

// previous overthought code. This code works but isn't as good.

// async function getDeobfuscator(){
//     if (typeof Deobfuscator === 'undefined') 
//         await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js");    
// };
// async function runCode(){
//     await getDeobfuscator();

//     obfVar1 = Deobfuscator.object(ig.game,'isSpeaking',false);  //ig.game.O4788
//     obfVar2 = Deobfuscator.function(obfVar1, 'health?', true);     //O5177()
//     obfVar8 = Deobfuscator.function(ig.game.player,'keepEyesClosedDueToBoost&&(',false);   //ig.game.O8006.O3298
//     obfVar3 = Deobfuscator.keyBetween(obfVar8,'tabHasFocus||this.','&&this.'); //O7428
//     obfVar5 = Deobfuscator.function(ig.game.motionDialog,'getItemBasic(a.m', true);     //O229()
//     obfVar6 = Deobfuscator.function(obfVar1, '.unshift(a);this.', true);  //O8147()
//     obfVar4 = Deobfuscator.keyBetween(obfVar6,'b=this.','.slice().reverse().join("")');    //O1817
//     obfVar7 = Deobfuscator.keyBetween(obfVar2,'(a)):this.','[this.');     //O5762

//     // ig.game.O4788.O5177 = function(a){
//     //     ig.game.O8006.O7428 = new ml.Timer;
//     //     80 >= Math.abs(ig.game.O8006.vel.y) || ig.game.O8006.isHooked ? (this.O1817 && 0 == this.O1817.length && ig.game.motionDialog.O229(),
//     //     this.say("_c" + a),
//     //     this.O8147(a)) : this.O5762[this.O5762.length] = a
//     // }

//     obfVar1[obfVar2] = function(a) {
//         ig.game.player[obfVar3] = new ml.Timer;
//         80 >= Math.abs(ig.game.player.vel.y) || ig.game.player.isHooked ? (obfVar1[obfVar4] && 0 == obfVar1[obfVar4].length && ig.game.motionDialog[obfVar5](),
//         obfVar1.say("_c" + a),
//         obfVar1[obfVar6](a)) : obfVar1[obfVar7][obfVar1[obfVar7].length] = a
//     }

//     updatePlayerArray = setInterval(() => {
//         updatePlayers()
//         for (index = 0; index < ig.game.players.length; ++index) {
//             ig.game.players[index].isFullAccount = true;
//         }
//     },2500)
// }

// runCode();