
/**
 *  author: cricy
 *  date: 2013-06-05
 */

define(function(require, exports) {

    function Car (options) {
        this.config = options || {
            speed : 5,
            size : {
                width : 20,
                height: 50
            },
            position : {
                x : 0,
                y : 0
            }
        };


    }

    Car.prototype.ctx = function(){
        return null;
    };

    //  开始
    Car.prototype.start = function(){
        var now = Date.now();
        this.distance = 0;
        this.speed = this.config.speed || 0;
        this.startTime = now;
        // 加速时间点
        this.accelerateTime = null;

        // 匀速开始时间点
        this.evenSpeedTime = this.speed ? now : null;
        this.minSpeed = this.config.minSpeed ||10;
        this.maxSpeed = this.config.maxSpeed ||100;

        // 加速度  单位是秒: s
        this.accelerateUnit = this.config.accelerateUnit ||10;
        this.currentAccelerateUnit = this.config.accelerateUnit ||10;
    };

    Car.prototype.restart = function(){
        this.start();
    };

    // 开始加速
    Car.prototype.startAccelerate = function(a){
        var now = Date.now();
        var self = this;
        this.currentAccelerateUnit = a || this.accelerateUnit;
        this._saveEvenDistance(now);
        this.accelerateTime = now;

        // 1000/60
        if((this.maxSpeed && this.currentAccelerateUnit > 0) || (this.minSpeed >=0 && this.currentAccelerateUnit < 0)){
            this.limitSpeed();
        }
    };

    // 最高限速
    Car.prototype.limitSpeed = function(){
        var self = this;
        var speed = this.currentAccelerateUnit > 0 ? this.maxSpeed : this.minSpeed;
        var time = Math.abs((speed -this.speed)/this.currentAccelerateUnit);
        this.limitSpeedTimeout = setTimeout( function(){self.stopAccelerate() }, time * 1000);
    };



    // 停止加速
    Car.prototype.stopAccelerate = function(){
        clearTimeout(this.limitSpeedTimeout);


        var now = Date.now();
        var accelerate = this._calculateAccelerate(this.accelerateTime, now, this.speed, this.currentAccelerateUnit);

        this.distance += accelerate.distance;
        this.speed = accelerate.speed;
        this.accelerateTime = null;
        this.evenSpeedTime = now;

    };

    // 获取当前最新距离
    Car.prototype.currentDistance = function(time){
        var now = time || Date.now();
        var distance = 0;
        if(this.accelerateTime){
            distance = this._calculateAccelerate(this.accelerateTime, now, this.speed, this.currentAccelerateUnit).distance;
        }else{
            distance = this._calculateEvenDistance(this.evenSpeedTime, now,this.speed);
        }
        return this.distance + distance;
    };

    //  当前速度
    Car.prototype.currentSpeed = function(time){
        var now = time || Date.now();
        if(this.accelerateTime){
            return this._calculateAccelerate(this.accelerateTime, now,this.speed, this.currentAccelerateUnit).speed;
        }else{
            return this.speed;
        }
    };

    //  保存匀速距离
    Car.prototype._saveEvenDistance = function(time){
        var now = time || Date.now();
        this.distance += this._calculateEvenDistance(this.evenSpeedTime, now, this.speed);
        this.evenSpeedTime = now;
    };


    //  计算加速度
    Car.prototype._calculateAccelerate = function(beginTime, endTime, speed, accelerateUnit){
        var costTime = (endTime - beginTime)/1000;
        var nowspeed = speed + parseInt(accelerateUnit * costTime, 10);
        var distance = parseInt((nowspeed + speed)/2 * costTime, 10);
        return {time : costTime, speed: nowspeed, distance:distance};

    }

    //  计算匀速距离
    Car.prototype._calculateEvenDistance = function(beginTime, endTime, speed ){
        return parseInt(speed * (endTime - beginTime) /1000, 10);
    };




    Car.prototype.draw = function(ctx) {
        // body...



    };

    exports.Car = Car;

});






