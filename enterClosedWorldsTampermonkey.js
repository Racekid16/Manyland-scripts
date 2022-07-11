// ==UserScript==
// @name         Enter closed worlds
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get into closed worlds like makeoutroom. May need to tweak the 400 value.
// @author       Tommy
// @match        http://manyland.com/*
// @match        https://manyland.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    setTimeout(() => {
        ig.game.areaClosed = false;
    }, 400)
})();