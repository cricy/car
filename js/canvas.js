
/**
 *  author: cricy
 *  date: 2013-06-05
 */

function Canvas(id){
    this.cvs = document.getElementById(id);
    this.ctx = this.cvs.getContext("2d");

    this.init();
}

Canvas.prototype.init = function(){
    Car.prototype.ctx = this.ctx;
    Road.prototype.ctx = this.ctx;

    this.road = new Road();
    this.cars = [];
    this.mycar = new Car();
};

Canvas.prototype.render = function(){
    this.draw();

};

Canvas.prototype.draw = function(){
    var ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, 400, 700);
    ctx.restore();

    this.road.draw();
    this.mycar.draw();
};



document.addEventListener("DOMContentLoaded", function(){
    window.c = new Canvas("car_canvas");
    c.render();

}, false);


// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
