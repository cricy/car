
require('seajs');
var Car = require('../js/car');
var expect = require('expect.js');


describe('Car', function(){
    var car = new Car();

    describe('#calculateEvenDistance()', function(){
        this.timeout(3000);
        car.restart();

        it('get even Distance', function(done){
            setTimeout(function(){
                // speed = 5
                // distance = 5 * 2
                var d = car.speed * 2;
                expect(car.currentDistance()).to.be(d);
                done();
            },2000);

        });

    });

    describe('#Accelerate()', function(){
        this.timeout(20000);
        var d = 0, s = 0;

        it('get start speed', function(){
            car.restart();
            expect(car.distance).to.be(0);
            expect(car.currentDistance()).to.be(0);
        });


        it('get startAccelerate speed', function(done){
            setTimeout(function(){
                done();
                car.startAccelerate();
                // speed = 5 * 2  = 10
                d = car.speed * 2;
                expect(car.currentDistance()).to.be(d);
            } ,2000);
        });


        it('get stopAccelerate speed', function(done){
            setTimeout(function(){
                done();
                car.stopAccelerate();
                // distance = 5*2 + ((5+(5+2*10))/2)* 2 = 40
                // speed = 5 + 2*10 = 25
                d += ((car.speed + car.speed - car.accelerateUnit *2)/2) *2;
                s = car.speed;
                expect(car.currentDistance()).to.be(d);
                expect(car.currentSpeed()).to.be(s);
            } ,2000);
        });

        it('get limitSpeed', function(done){
            car.restart();
            car.speed = 0;
            car.startAccelerate(200);
            setTimeout(function(){
                var now = Date.now();

                var costtime = car.maxSpeed/200;
                if(costtime < 3){
                    //  maxSpeed: 100
                    expect(car.currentSpeed(now)).to.be(car.maxSpeed);
                    // distance = (0 +500)/2 * (500/40)
                    d = car.maxSpeed/2 * (car.maxSpeed/200);
                    expect(car.distance).to.be(d);

                    d += (3 - costtime) * car.speed;
                    expect(car.currentDistance(now)).to.be.lessThan(d + 2);
                }else{
                    s = car.currentSpeed();
                    d = s/2 * 3
                    expect(car.currentDistance(now)).to.be.lessThan(d + 2);
                }
                done();
            } ,3000);
        });

        it('get down accelerate', function(done){
            car.restart();
            car.speed = 100;
            car.startAccelerate(-40);
            expect(car.accelerateUnit).to.be(-40);
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

    describe('#suspend() and goOn()', function(){
        this.timeout(20000);
        it('get start speed', function(){
            car.restart();
            car.speed = 5;
            expect(car.distance).to.be(0);
            expect(car.currentDistance()).to.be(0);
        });

        it('get suspend', function(done){
            setTimeout(function(){
                done();
                car.suspend();
                // distance = 5 *2  = 10
                expect(car.currentDistance()).to.be(10);
                expect(car.currentSpeed()).to.be(5);
            } ,2000);
        });

        it('get goOn', function(done){
            setTimeout(function(){
                done();
                car.goOn();
                // distance = 5 *2  = 10
                expect(car.currentDistance()).to.be(10);
            } ,2000);
        });

        it('get startAccelerate', function(done){
            setTimeout(function(){
                done();
                car.startAccelerate(20);
                // distance = 10 + 5 *2  = 20
                expect(car.currentDistance()).to.be(20);
                expect(car.currentSpeed()).to.be(5);
            } ,2000);
        });

        it('get suspend startAccelerate', function(done){
            setTimeout(function(){
                done();
                car.suspend();
                // distance = 20 + 15  = 35
                expect(car.currentDistance()).to.be(35);
                expect(car.currentSpeed()).to.be(25);
            } ,1000);
        });

        it('get goOn startAccelerate', function(done){
            setTimeout(function(){
                done();
                car.goOn();
                // distance = 20 + 15  = 35
                expect(car.currentDistance()).to.be(35);
                expect(car.currentSpeed()).to.be(25);
            } ,2000);
        });

        it('get check', function(done){
            setTimeout(function(){
                done();
                // distance = 35 + 90 = 135
                // accelerate: 20
                // speed = 25 + 2*20 = 65
                expect(car.currentDistance()).to.be(125);
                expect(car.currentSpeed()).to.be(65);
                car.startAccelerate();
            } ,2000);
        });

    });

    describe('#setSpeed()', function(){
        this.timeout(20000);

        it('get start speed', function(){
            car.restart();
            car.speed = 5;
            expect(car.distance).to.be(0);
            expect(car.currentDistance()).to.be(0);
        });

        it('get setSpeed', function(done){
            setTimeout(function(){
                done();
                expect(car.currentSpeed()).to.be(5);
                car.setSpeed(20);
                // distance = 5 *2  = 10
                expect(car.currentDistance()).to.be(10);
                expect(car.currentSpeed()).to.be(20);
            } ,2000);
        });

        it('get check', function(done){
            setTimeout(function(){
                done();
                // distance = 10 + 20 * 2 = 50
                // speed = 20
                expect(car.currentDistance()).to.be(50);
                expect(car.currentSpeed()).to.be(20);
            } ,2000);
        });

    });

    function done(){}
});