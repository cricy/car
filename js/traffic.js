
/**
 *  author: cricy
 *  date: 2013-06-09
 */

define(function(require, exports, module) {

    var Car = require("./car");

    function Traffic(options){
        this.options = options || {
            levelDistance: [200,500,1000,3000,6000,10000,20000],
            levelMinSpeed :[5,50,100,200,300,350,400],
            levelCars :[1,3,5,7,9,9,9],
            playMinOverSpeed: 10,
            overDistanceHide: 600,
            positionX: [35, 85, 135, 185]

        };
    }

    Traffic.prototype.start =  function(){
        this.cars = [];
        this.distance = 0;
        this.overCars = 0;
        this.level = 0;

        var self = this;
        setInterval(function(){
            self._cala_center();
        }, 1000);
    };

    Traffic.prototype._cala_center = function(){
        var level = this.level = this._getLevel();
        var minSpeed = this.options.levelMinSpeed[level];
        var levelCars = this.options.levelCars[level];

        this._hideCars();
        this._addCars(minSpeed, levelCars);
    };

    Traffic.prototype._getLevel = function(){
        var ldis = this.options.levelDistance;
        var distance = this.distance;
        for(var i=ldis.length - 1,l=0; i>l; i--){
            if(distance >= ldis[i]){
                return i;
            }
        }
        return 0;
    };

    Traffic.prototype._hideCars = function(){
        var distance = this.distance;
        var cars = this.cars;
        for(var i=0,l= cars.length; i<l; i++){
            if(cars[i].currentDistance() + this.options.overDistanceHide < distance){
                cars.shift();
                l--;
                i--;
                this.overCars++;
            }
        }
    };

    Traffic.prototype._addCars = function(minSpeed, levelCars){
        if(Math.random() * (levelCars - this.cars.length) > 0.5  ){
            var car = new Car();
            car.start();
            car.distance = this.distance;
            var lane = Math.round(Math.random() * 100)%4;
            car.options.position.x = this.options.positionX[lane];
            car.setSpeed(minSpeed);
            this.cars.push(car);
        }
    };

    Traffic.prototype.draw = function(distance, ctx){
        this.distance = distance;
        this._drawCars(ctx);
    };

    Traffic.prototype._drawCars = function(ctx){
        var distance = this.distance;
        var cars = this.cars;
        for(var i=0,l= cars.length; i<l; i++){
            cars[i].options.position.y = distance - cars[i].currentDistance();
            // console.log(cars[i].options.position.y);
            cars[i].draw(ctx);
        }
    };



    module.exports = Traffic;
});