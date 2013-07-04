

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
var browser = {
    versions:function(){
           var u = navigator.userAgent, app = navigator.appVersion;
           return {//移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
         }(),
         language:(navigator.browserLanguage || navigator.language).toLowerCase()
}


define(function(require) {

    // return false;
    var Canvas = require("./canvas");
    window.c = new Canvas("car_canvas");
    c.render();

    if (browser.versions.iPad ||browser.versions.iPhone || browser.versions.Android || browser.versions.ios ){
        var MobileMain = require("./mobile_main");
        new MobileMain(c);

    }else{
        document.addEventListener("keydown", function(e){
            keyDownOrUp(e, true);
        });

        document.addEventListener("keyup", function(e){
            keyDownOrUp(e, false);
        });

        function keyDownOrUp(e,downup){
            var eventObject = {target : null, data : downup};
            switch(e.keyCode){
                case 39:  // right
                    e.preventDefault();
                    eventObject.target = "right";
                    c.eventHandle(eventObject);
                    break;
                case 37:  // left
                    e.preventDefault();
                    eventObject.target = "left";
                    c.eventHandle(eventObject);
                    break;
                case 38:  // up
                    e.preventDefault();
                    eventObject.target = "up";
                    c.eventHandle(eventObject);
                    break;
                case 40:  // down
                    e.preventDefault();
                    eventObject.target = "down";
                    c.eventHandle(eventObject);
                    break;
                default:
                    break;
            }
        }
    }


    function draw(){
        c.fps = fps;
        c.draw();
        if(!c.gameOver){
            requestAnimFrame(draw);
        }

        fps_draw();
    }

    var lastCalledTime;
    var fps, tmpfps = [];
    function fps_draw(){
        if(!lastCalledTime) {
            lastCalledTime = new Date().getTime();
            fps = 0;
            return;
        }
        var now = new Date().getTime()
        delta = (now - lastCalledTime)/1000;
        lastCalledTime = now;
        tmpfps.push(1/delta);

    }
    setInterval(function(){
        var all = 0;
        tmpfps.forEach(function(t){
            all += t;
        })
        fps = (all/tmpfps.length).toFixed(1);
        tmpfps = [];
    },1000)

    requestAnimFrame(draw);


});


