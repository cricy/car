
/**
 *  author: cricy
 *  date: 2013-06-05
 */
define(function(require, exports, module) {
    var Car = require("./car");
    var Road = require("./road");
    var Traffic = require("./traffic");

    var offsetY = 400;

    function Canvas(id){
        this.cvs = document.getElementById(id);
        this.ctx = this.cvs.getContext("2d");

        this.init();
    }

    Canvas.prototype.init = function(){
        // Car.prototype.ctx = this.ctx;
        // Road.prototype.ctx = this.ctx;

        this.gameOver = false;
        this.road = new Road();
        this.traffic = new Traffic();
        this.mycar = new Car();
        this.traffic = new Traffic();
    };

    Canvas.prototype.render = function(){
        this.mycar.start();
        this.traffic.start();
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
        // console.log("distance:" + distance);
        // this.mycar.options.position.y = offsetY - distance;
        this.road.options.runY = distance;
        this.road.draw(ctx);
        this.traffic.draw(distance, ctx);
        if(this.mycar.isInCarScope(ctx, this.traffic.cars)){
            // 说明已经碰撞
            this.gameOver = true;
        }
        this.mycar.draw(ctx);
        this._draw_status();
    };

    Canvas.prototype._draw_status = function(){
        var ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = "white";
        ctx.font = "italic "+14+"pt Arial ";
        ctx.fillText("速度:" + this.mycar.currentSpeed(), 220,150);
        ctx.fillText("距离:" + this.mycar.currentDistance(), 220,180);
        if(this.gameOver){
            ctx.fillText("你超过了:" + this.traffic.overCars, 220,210);
            ctx.fillText("等级:" + this.traffic.level, 220,240);
        }
        ctx.restore();
    }

    Canvas.prototype.carChangeLane = function(arrow){

        var moveUnit = 20;
        this.mycar.options.position.x = this.sureCarInRoad(this.mycar.options.position.x, arrow ? moveUnit : -moveUnit);
    };

    Canvas.prototype.sureCarInRoad = function(x, moveUnit){
        if(!this.roadCarRangeX){
            var allwidth = this.road.options.lane * this.road.options.unitWidth;
            this.roadCarRangeX = [this.road.options.offset.x, this.road.options.offset.x + allwidth];

            this.roadCarRangeX[0] = this.roadCarRangeX[0] + this.mycar.options.size.width/2;
            this.roadCarRangeX[1] = this.roadCarRangeX[1] - this.mycar.options.size.width/2;
        }
        var newx = x + moveUnit;

        if(newx > this.roadCarRangeX[1]){
            return this.roadCarRangeX[1];
        }else if(newx < this.roadCarRangeX[0]){
            return this.roadCarRangeX[0];
        }else{
            return newx;
        }
    };

    Canvas.prototype.setCarSpeed = function(arrow){
        var speedUnit = 5;
        this.mycar.setSpeed(this.mycar.speed + (arrow ? speedUnit : -speedUnit * 4));
    };


    Canvas.prototype.onKeyDown = function(e){
        var self = this;
        switch(e.keyCode){
            case 39:  // right
                e.preventDefault();
                this.carChangeLane(true);
                break;
            case 37:  // left
                e.preventDefault();
                this.carChangeLane(false);
                break;
            case 38:  // up
                e.preventDefault();
                this.setCarSpeed(true);
                break;
            case 40:  // down
                e.preventDefault();
                this.setCarSpeed(false);
                break;
            default:
                break;
        }
    };

    Canvas.prototype.onKeyUp = function(e){

    };

    module.exports = Canvas;
});



