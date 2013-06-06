
require('seajs');
var Car = require('../js/car').Car;
var expect = require('expect.js');


describe('Car', function(){
    var car = new Car();

    describe('#calculateEvenDistance()', function(){
        this.timeout(3000);

        it('get even Distance', function(done){
            car.restart();
            setTimeout(function(){
                // speed = 5
                // distance = 5 * 2
                expect(car.currentDistance()).to.be(10);
                done();
            },2000);

        });

    });

    describe('#Accelerate()', function(){
        this.timeout(60000);

        it('get start speed', function(){
            car.restart();
            expect(car.distance).to.be(0);
            expect(car.currentDistance()).to.be(0);
        });


        it('get startAccelerate speed', function(done){
            setTimeout(function(){
                done();
                car.startAccelerate();
                // speed = 5 *2  = 10
                expect(car.currentDistance()).to.be(10);
            } ,2000);
        });


        it('get stopAccelerate speed', function(done){
            setTimeout(function(){
                done();
                car.stopAccelerate();
                // distance = 5*2 + ((5+(5+2*10))/2)* 2 = 40
                // speed = 5 + 2*10 = 25
                expect(car.currentDistance()).to.be(40);
                expect(car.currentSpeed()).to.be(25);
            } ,2000);
        });

        it('get limitSpeed', function(done){
            car.restart();
            car.speed = 0;
            car.startAccelerate(40);
            setTimeout(function(){
                var now = Date.now();
                //  maxspeed: 100
                expect(car.currentSpeed(now)).to.be(car.maxSpeed);
                // distance = (0 +100)/2 * (100/40) = 125
                expect(car.distance).to.be(125);

                // 125 + 0.5 * 100 = 90
                expect(car.currentDistance(now)).to.be.lessThan(176);
                done();
            } ,3000);
        });

        it('get down accelerate', function(done){
            car.restart();
            car.speed = 100;
            car.startAccelerate(-40);
            expect(car.currentAccelerateUnit).to.be(-40);
            setTimeout(function(){
                var now = Date.now();
                //  minSpeed: 10
                expect(car.speed).to.be(car.minSpeed);
                expect(car.currentSpeed(now)).to.be(car.minSpeed);
                // distance = (100 - 10)/2 * (90/40) = 125
                expect(car.distance).to.be.lessThan(125);

                // 125 + (3 - 90/40) * 10 = 132.5
                expect(car.currentDistance(now)).to.be.lessThan(132.5);
                done();
            } ,3000);
        });

    });
    function done(){}
});