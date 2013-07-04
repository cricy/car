
/**
 *  author: cricy
 *  date: 2013-06-05
 */

define(function(require, exports, module) {

    function Car (options) {
        this.options = options || {
            speed : 5,
            size : {
                width : 30,
                height: 50
            },
            position : {
                x : 0,
                y : 0
            },
            minSpeed: 10,
            maxSpeed:500,
            accelerateUnit: 10 // 每秒加速度
        };


    }

    Car.prototype.ctx = function(){
        return null;
    };

    //  开始
    Car.prototype.start = function(){
        var now = Date.now();
        this.distance = 0;
        this.speed = this.options.speed || 0;
        this.startTime = now;
        // 加速时间点
        this.accelerateTime = null;

        this.change_lane = null;

        // 匀速开始时间点
        this.evenSpeedTime = this.speed ? now : null;
        this.minSpeed = this.options.minSpeed;
        this.maxSpeed = this.options.maxSpeed;

        // 加速度  单位是秒: s
        this.accelerateUnit = this.options.accelerateUnit;
    };

    Car.prototype.restart = function(){
        this.start();
    };

    // 开始加速
    Car.prototype.startAccelerate = function(a){
        var now = Date.now();
        var self = this;

        if(this.accelerateTime){
            this.stopAccelerate(now);
        }

        this.accelerateUnit = a ||this.accelerateUnit;
        this._saveEvenDistance(now);
        this.accelerateTime = now;
        this.evenSpeedTime = null;

        // 1000/60
        if((this.maxSpeed && this.accelerateUnit > 0) || (this.minSpeed >=0 && this.accelerateUnit < 0)){
            this.limitSpeed();
        }
    };

    // 最高限速
    Car.prototype.limitSpeed = function(){
        var self = this;
        var speed = this.accelerateUnit > 0 ? this.maxSpeed : this.minSpeed;
        var time = Math.abs((speed -this.speed)/this.accelerateUnit);
        this.limitSpeedTimeout = setTimeout( function(){self.stopAccelerate() }, time * 1000);
    };



    // 停止加速
    Car.prototype.stopAccelerate = function(now){
        clearTimeout(this.limitSpeedTimeout);
        if(!this.accelerateTime){
            return;
        }

        now = now || Date.now();
        var accelerate = this._calculateAccelerate(this.accelerateTime, now, this.speed, this.accelerateUnit);
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
            distance = this._calculateAccelerate(this.accelerateTime, now, this.speed, this.accelerateUnit).distance;
        }else{
            distance = this._calculateEvenDistance(this.evenSpeedTime, now,this.speed);
        }
        return this.distance + distance;
    };

    //  当前速度
    Car.prototype.currentSpeed = function(time){
        var now = time || Date.now();
        if(this.accelerateTime){
            return this._calculateAccelerate(this.accelerateTime, now,this.speed, this.accelerateUnit).speed;
        }else{
            return this.speed;
        }
    };

    //  设置速度
    Car.prototype.setSpeed = function(speed){
        var now = Date.now();
        if(this.accelerateTime){
            this.stopAccelerate();
        };
        if(this.maxSpeed && speed > this.maxSpeed){
            speed = this.maxSpeed;
        }else if( speed < this.minSpeed){
            speed = this.minSpeed;
        }
        this.distance += this._calculateEvenDistance(this.evenSpeedTime, now, this.speed);
        this.evenSpeedTime = Date.now();
        this.speed = speed;

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

    };

    //  计算匀速距离
    Car.prototype._calculateEvenDistance = function(beginTime, endTime, speed ){
        if(beginTime && endTime && speed){
            return parseInt(speed * (endTime - beginTime) /1000, 10);
        }else{
            return 0;
        }
    };

    // 暂停
    Car.prototype.suspend = function(time){
        var now = Date.now() || time;
        this.is_suspend = true;
        if(this.accelerateTime){
            this.stopAccelerate(now);
            this.is_suspend = {accelerate : true};
        }else if(this.evenSpeedTime){
            this.distance += this._calculateEvenDistance(this.evenSpeedTime, now, this.speed);
        }

        this.evenSpeedTime = null;
        this.accelerateTime = null;
    };

    // 继续
    Car.prototype.goOn = function(time){
        var now = Date.now() || time;
        if(this.is_suspend){
            if(this.is_suspend.accelerate){
                this.startAccelerate();
            }else{
                this.evenSpeedTime = now;
            }
        }
        delete this.is_suspend;
    };

    // change lane
    Car.prototype.changeLane = function(x){
        var self = this;
        var position = self.options.position;

        console.log(x)

        var cl = self.change_lane || {};
        cl.to_x = x;
        self.change_lane = cl;
        var timer = cl.change_timer;
        cl.change_timer = setInterval(function(){
            console.log(Date.now())
            if(cl.to_x > position.x){
                position.x ++;
                console.log(position.x + "+++" + cl.to_x)
            }else if(cl.to_x < position.x){
                position.x --;
                console.log(position.x + "---")
            }else{
                console.log(position.x + ".....")
                clearInterval(cl.change_timer);
                delete cl;
                delete self.change_lane;
            }
        }, 16);

        clearInterval(timer);

    };


    Car.prototype.draw = function(ctx) {
        var position = this.options.position;
        var size = this.options.size;
        ctx = this.ctx = ctx || this.ctx;

        // background
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "yellow";
        ctx.fillRect(position.x - size.width/2, position.y - size.height/2, size.width, size.height);
        ctx.restore();
    };

    // 判断是否碰撞
    Car.prototype.isInCarScope = function(ctx, cars){
        var position = this.options.position;
        var size = this.options.size;

        ctx.save();
        ctx.beginPath();
        ctx.rect(position.x - size.width/2, position.y - size.height/2, size.width, size.height);
        if(cars instanceof Array){
            for(var i=0, l= cars.length; i< l;i++){
                var rectangleXY = cars[i].getRectangleXY();
                for(var ii=0, jj=rectangleXY.length; ii<jj;ii++){
                    if(ctx.isPointInPath(rectangleXY[ii].x, rectangleXY[ii].y)){
                        return {index:i,o : cars[i]};
                    }
                }
            }
        }else if(ctx.isPointInPath(cars.x, cars.y)){
            return true;
        }
        return false;
    };

    // 获取四个顶点坐标
    Car.prototype.getRectangleXY = function(){
        var position = this.options.position;
        var size = this.options.size;

        return [{ x: position.x - size.width/2, y:position.y - size.height/2},
            {x: position.x + size.width/2, y:position.y - size.height/2},
            {x: position.x - size.width/2, y:position.y + size.height/2},
            {x: position.x + size.width/2, y:position.y + size.height/2}
        ];
    };

    Car.prototype.status = function(){
        console.log("speed:" +  this.speed +"  distance:" + this.distance + "   accelerateUnit:" + this.accelerateUnit + "   evenSpeedTime:" + this.evenSpeedTime);
    };

    // exports.Car = Car;
    module.exports = Car;
});






