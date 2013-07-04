
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
        this.key_status = {};
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
        ctx.fillText("速度: " + this.mycar.currentSpeed(), 220,150);
        ctx.fillText("距离:" + this.mycar.currentDistance(), 220,180);
        ctx.fillText("等级:" + this.traffic.level, 220,210);
        if(this.gameOver){
            ctx.fillText("你超过了:" + this.traffic.overCars, 220,240);
        }
        ctx.restore();
    }

    Canvas.prototype.carChangeLane = function(){
        var self = this;

        clearInterval(self.key_status.change_lane_timer);
        self.key_status.change_lane_timer = setInterval(function(){
            var s = 2;
            if(self.key_status.left){
                s = -s;
            }
            if(self.key_status.right || self.key_status.left ){
                self.mycar.options.position.x += s;
                self.mycar.options.position.x = self.sureCarInRoad(self.mycar.options.position.x, 0);
            }else{
                clearInterval(self.key_status.change_lane_timer);
            }
        },16);

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

    Canvas.prototype.startAccelerateCar = function(){
        var self = this;
        var speedUnit = 30, speed = 0;
        if(this.key_status.up){
            speed = speedUnit;
        }else if(this.key_status.down){
            speed =  -speedUnit * 3;
        }
        if(speed !== 0){
            this.mycar.startAccelerate(speed);
        }
    };

    Canvas.prototype.eventHandle = function(e){
        var self = this;
        switch(e.target){
            case "right":
                if(e.data && !self.key_status.right){
                    self.key_status.right = true;
                    self.carChangeLane();
                }else if(!e.data){
                    self.key_status.right = false;
                }
                break;

            case "left":
                if(e.data && !self.key_status.left){
                    self.key_status.left = true;
                    self.carChangeLane();
                }else if(!e.data){
                    self.key_status.left = false;
                }
                break;
            case "norightleft":
                self.key_status.left = false;
                self.key_status.right = false;
                break;
            case "up":
                if(e.data){
                    if(!self.key_status.up){
                        self.key_status.up = true;
                        self.startAccelerateCar();
                    }
                    self.key_status.up = true;
                }else{
                    if(self.key_status.up){
                        self.key_status.up = false;
                        self.mycar.stopAccelerate();
                    }
                }
                break;

            case "down":
                if(e.data){
                    if(!self.key_status.down){
                        self.key_status.down = true;
                        self.startAccelerateCar();
                    }
                    self.key_status.down = true;
                }else{
                    if(self.key_status.down){
                        self.key_status.down = false;
                        if(!self.key_status.up){
                            self.mycar.stopAccelerate();
                        }
                    }
                }

                break;
        }
    };


    Canvas.prototype.onKeyDown = function(e){
        var self = this;
        switch(e.keyCode){
            case 39:  // right
                e.preventDefault();
                if(!self.key_status.right){
                    self.key_status.right = true;
                    self.carChangeLane();
                }
                break;
            case 37:  // left
                e.preventDefault();
                if(!self.key_status.left){
                    self.key_status.left = true;
                    self.carChangeLane();
                }
                break;
            case 38:  // up
                e.preventDefault();
                if(!self.key_status.up){
                    self.key_status.up = true;
                    self.startAccelerateCar();
                }
                break;
            case 40:  // down
                e.preventDefault();
                if(!self.key_status.down){
                    self.key_status.down = true;
                    self.startAccelerateCar();
                }
                break;
            default:
                break;
        }
    };

    Canvas.prototype.onKeyUp = function(e){
        var self = this;
        switch(e.keyCode){
            case 39:  // right
                e.preventDefault();
                self.key_status.right = false;
                break;
            case 37:  // left
                e.preventDefault();
                self.key_status.left = false;
                break;
            case 38:  // up
                e.preventDefault();
                self.key_status.up = false;
                self.mycar.stopAccelerate();
                break;
            case 40:  // down
                e.preventDefault();
                self.key_status.down = false;
                self.mycar.stopAccelerate();
                break;
            default:
                break;
        }
    };

    module.exports = Canvas;
});



