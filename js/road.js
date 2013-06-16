
/**
 *  author: cricy
 *  date: 2013-06-05
 */

define(function(require, exports, module) {

    function Road(options){
        this.options = options || {
            lane : 4,
            unitWidth : 50,
            offset : {x:10,y:0},
            dash : [30,50],
            runY :0
        };
    }

    Road.prototype.ctx = function(){
        return null;
    };

    Road.prototype.BG_COLOR = "#000";
    Road.prototype.LINE_COLOR = "white";
    Road.prototype.LINE_WIDTH = 5;

    Road.prototype.draw = function(ctx){
        var ctx = this.ctx = Road.prototype.ctx = ctx || this.ctx;

        var allwidth = this.options.lane * this.options.unitWidth;
        var height = ctx.canvas.height;
        var offset = this.options.offset;

        // var roadHeight = height;
        var dashHeight = this.options.dash[0] + this.options.dash[1];

        // var roadHeight = this.options.runY%dashHeight - dashHeight + height + offset.y;
        var laneLineY = offset.y;
        if(this.options.runY){
            laneLineY += this.options.runY%dashHeight - dashHeight;
        }
        var roadHeight = height - laneLineY;



        // background
        ctx.save();
        ctx.fillStyle = this.BG_COLOR;
        ctx.fillRect(offset.x, offset.y, allwidth, height);
        ctx.restore();

        // line
        this._draw_line(offset.x,offset.y,offset.x, height);
        this._draw_line(offset.x + allwidth, offset.y,offset.x + allwidth, height);

        for(var i=1,l=this.options.lane; i<l; i++){
            this._draw_line(offset.x + i*this.options.unitWidth, laneLineY,offset.x + i*this.options.unitWidth, roadHeight, true);
        }
    };

    Road.prototype._draw_line = function(x,y,x2,y2, dashed){
        var ctx = this.ctx;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.lineTo(x2,y2);
        if(dashed){
            ctx.setLineDash(this.options.dash);
        }else{
            // ctx.setLineDash(null);
        }
        ctx.strokeStyle = this.LINE_COLOR;
        ctx.lineWidth = this.LINE_WIDTH;
        // ctx.closePath();
        ctx.stroke();
        ctx.restore();
    };


    module.exports = Road;
});