
/**
 *  author: cricy
 *  date: 2013-06-05
 */
define(function(require, exports, module) {
    var Car = require("./car");
    var Road = require("./road");

    var offsetY = 600;

    function Canvas(id){
        this.cvs = document.getElementById(id);
        this.ctx = this.cvs.getContext("2d");

        this.init();
    }

    Canvas.prototype.init = function(){
        // Car.prototype.ctx = this.ctx;
        // Road.prototype.ctx = this.ctx;

        this.road = new Road();
        this.cars = [];
        this.mycar = new Car();
    };

    Canvas.prototype.render = function(){
        this.mycar.start();
        this.mycar.speed = 5;
        // this.mycar.maxSpeed = 500;
        this.mycar.options.position = {x : 85, y: offsetY};
        this.draw();
    };

    Canvas.prototype.draw = function(){

        var ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = 'blue';
        ctx.fillRect(0, 0, 400, 700);
        ctx.restore();

        var mycar = this.mycar;
        var distance = mycar.currentDistance();
        // this.mycar.options.position.y = offsetY - distance;
        this.road.options.runY = distance;
        this.road.draw(ctx);
        this.mycar.draw(ctx);
    };

    module.exports = Canvas;
});



