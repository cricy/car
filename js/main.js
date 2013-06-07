

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function( callback ){
                setTimeout(callback, 1000 / 60);
            };
})();




define(function(require) {
    var Canvas = require("./canvas");
    window.c = new Canvas("car_canvas");
    c.render();

    function draw(){
        c.draw();
        requestAnimFrame(draw);
    }

    requestAnimFrame(draw);

});



document.addEventListener("DOMContentLoaded", function(){


}, false);
