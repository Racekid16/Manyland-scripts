async function getDeobfuscator() {
    if (typeof Deobfuscator === 'undefined') {
        await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js"); 
    }   
};

async function interceptWebsocket() {
    await getDeobfuscator();
    printWebsocket = Deobfuscator.function(ml.WsMinifier.prototype,'a="{"+a}',true);
    ml.WsMinifier.prototype[printWebsocket] = function(a,b) {
        if ("{" != a.substring(0, 1)) {
            for (var c = b ? this.minificationMappingClientToServer : this.minificationMappingServerToClient, d = c.length - 1; 0 <= d; d--)
                a = ig.game.strings.replaceAll(a, c[d][0], c[d][1]);
            a = "{" + a
        }
        consoleref.log(a);
        return JSON.parse(a)
    }
}

interceptWebsocket();