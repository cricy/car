
/**
 *  author: cricy
 *  date: 2013-06-30
 */

define(function(require, exports, module) {
    var canvas = null;
    function MobileMain(c){
        canvas = c;
    }

    module.exports = MobileMain;

    var hasDeviceMotion = 'ondevicemotion' in window;
    var count = 0;
    if(!hasDeviceMotion){
        return;
    }

    window.addEventListener('devicemotion', devicemotion, false);


    function devicemotion(e){
        var current = e.accelerationIncludingGravity;


        count ++;
        if(count == 30){
            console.log("x:" + current.x + " Y:" + current.y + "Z:" + current.z);
            count = 0;
        }

        var eventObject = {target: null, data : false};

        if(current.x > 2){
            // car right
            eventObject.target = "right";
            eventObject.data = true;
            canvas.eventHandle(eventObject);
        }else if(current.x < -2){
            // car left
            eventObject.target = "left";
            eventObject.data = true;
            canvas.eventHandle(eventObject);
        }else{

            eventObject.target = "norightleft";
            canvas.eventHandle(eventObject);
            // end
        }

        // 减速
        eventObject = {};
        if(current.y < -3){
            eventObject.target = "down";
            eventObject.data = true;
            canvas.eventHandle(eventObject);
        }else{
            eventObject.target = "down";
            eventObject.data = false;
            canvas.eventHandle(eventObject);
        }

    }

    window.addEventListener("touchstart", function(){
        var eventObject = {target: "up", data : true};
        canvas.eventHandle(eventObject);

    }, false);
    window.addEventListener("touchend", function(){
        var eventObject = {target: "up", data : false};
        canvas.eventHandle(eventObject);
    }, false);

    // window.addEventListener("touchcancel", function(){
    //     var eventObject = {target: "up", data : false};
    //     canvas.eventHandle(eventObject);
    // }, false);
    document.body.addEventListener('touchmove', function(e){ e.preventDefault(); });
});