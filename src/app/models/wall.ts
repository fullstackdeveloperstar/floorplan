import * as Konva from 'konva';
import { Point } from './point';
import * as uuid from 'uuid';
import { Global } from './global';

export class Wall {
    id: string;
    preWall: Wall;
    nextWall: Wall;
    mainLine: Konva.Line;
    firstSignLine: Konva.Line;
    secondSignLine: Konva.Line;
    firstArrow: Konva.Arrow;
    secondArrow: Konva.Arrow;
    textLength: Konva.Text;
    drageCircle: Konva.Circle;
    cornerCircle: Konva.Circle;
    stroke = "#000000";
    strokeWidth = 3;
    over_stroke = "#ff0000";
    over_strokeWidth = 5;
    signbar_stroke = '#333';
    signbar_strokeWidth = 1;
    signLineLength = 40;
    textlenght_width = 0;
    ARROW_FOR_LENGTH_POINTER_LENGTH = 5;
    ARROW_FOR_LENGTH_POINTER_WIDTH = 5;
    ARROW_FOR_LENGTH_FILL = '#000';
    ARROW_FOR_LENGTH_STROKE = '#000';
    ARROW_FOR_LENGTH_STROKEWIDTH = 1;
    TEXTLENGTH_NORMAL_COLOR = '#000';
    TEXTLENGTH_LOCKED_COLOR = '#f00';
    TEXTLENGTH_WIDTH = 50;

    DRAGE_CIRCLE_RADIUS = 10;
    DRAGE_CIRCLE_STROKE = 'red';
    DRAGE_CIRCLE_STROKE_WIDTH = 2;
    DRAGE_CIRCLE_FILL = '#000';

    CORNER_CIRCLE_RADIUS = 10;
    CORNER_CIRCLE_STROKE = 'red';
    CORNER_CIRCLE_STROKE_WIDTH = 2;
    CORNER_CIRCLE_FILL = '#000';
    CORNER_CIRCLE_OPACITY_ACTIVE = 1;
    CORNER_CIRCLE_OPACITY_IN_ACTIVE = 0;
    CORNER_DEFAULT_LENGTH = 100;

    midPoint: Point;
    isselected = false;
    isShowLength = false;
    isChangeOtherwise = false;
    isSelectedCorner = false;
    

    length;
    startPos;


    constructor(
        private stage: Konva.Stage,
        public layer: Konva.Layer,
        public point1: Point,
        public point2: Point,
        private global: Global
    ) {
        this.id = uuid();
        this.calcMidPoint();
        this.length = this.calcLength();
        this.drawWall();
    }

    drawWall() { 
        var me = this;
        this.mainLine = new Konva.Line({
            points: [this.point1.x, this.point1.y, this.point2.x, this.point2.y],
            stroke: this.stroke,
            strokeWidth: this.strokeWidth,
        });

        this.mainLine.on('mouseover', function () {
            this.stroke(me.over_stroke);
            this.strokeWidth(me.over_strokeWidth);
            document.body.style.cursor = 'pointer';
            me.layer.draw();
        });

        this.mainLine.on('mouseout', function () {
            this.stroke(me.stroke);
            this.strokeWidth(me.strokeWidth);
            document.body.style.cursor = 'default';
            me.layer.draw();
            me.redraw();
        });

        this.mainLine.on('click', function (evt) {
            me.length = me.calcLength();
            me.toggleToSelect();
        });

        this.drawSignBarLines();
        this.drawArrows();
        this.drawText();
        this.drawDragCircle();
        this.drawCornerCircle();

        this.layer.add(this.mainLine);
    }

    drawDragCircle() {
        var me = this;
        this.drageCircle = new Konva.Circle({
            x: me.midPoint.x,
            y: me.midPoint.y,
            radius: me.DRAGE_CIRCLE_RADIUS,
            fill: me.DRAGE_CIRCLE_FILL,
            stroke: me.DRAGE_CIRCLE_STROKE,
            strokeWidth: me.DRAGE_CIRCLE_STROKE_WIDTH,
            draggable: true,
            
        });

        this.drageCircle.on('dragstart', function() {
            me.startPos = this._lastPos;
        });

        this.drageCircle.on('dragend', function() {
            me.point1.x = me.point1.x + this._lastPos.x - me.startPos.x;
            me.point1.y = me.point1.y + this._lastPos.y - me.startPos.y;
            me.point2.x = me.point2.x + this._lastPos.x - me.startPos.x;
            me.point2.y = me.point2.y + this._lastPos.y - me.startPos.y;
            me.redraw();
            me.redrawRelatedWalls();
        });

        this.drageCircle.on('dragmove', function(){
            me.point1.x = me.point1.x + this._lastPos.x - me.startPos.x;
            me.point1.y = me.point1.y + this._lastPos.y - me.startPos.y;
            me.point2.x = me.point2.x + this._lastPos.x - me.startPos.x;
            me.point2.y = me.point2.y + this._lastPos.y - me.startPos.y;
            me.startPos = this._lastPos;
            me.redraw();
            me.redrawRelatedWalls();
        });

        this.drageCircle.on('mouseover', function() {
            document.body.style.cursor = "all-scroll";
        })

        this.layer.add(this.drageCircle);
        this.drageCircle.hide();
    }

    drawSignBarLines() {
        var me = this;
        var d_x = this.point2.x - this.point1.x;
        var d_y = this.point2.y - this.point1.y;
        var dd = Math.sqrt(d_x * d_x + d_y * d_y);

        
        var d_x_1 = this.signLineLength * d_y / dd;
        var d_y_1 = d_x_1 * d_x / d_y;

        if (d_y == 0) {
            d_x_1 = 0;
            d_y_1 = this.signLineLength * d_x / Math.abs(d_x);
        }
        this.firstSignLine = new Konva.Line({
          points: [this.point1.x, this.point1.y, this.point1.x + d_x_1, this.point1.y - d_y_1],
          stroke: me.signbar_stroke,
          strokeWidth: me.signbar_strokeWidth,
        });
        this.secondSignLine = new Konva.Line({
          points: [this.point2.x, this.point2.y, this.point2.x + d_x_1, this.point2.y - d_y_1],
          stroke: me.signbar_stroke,
          strokeWidth: me.signbar_strokeWidth,
        });

        this.layer.add(this.firstSignLine);
        this.layer.add(this.secondSignLine);

        this.firstSignLine.hide();
        this.secondSignLine.hide();
    }

    drawArrows() {
        var me = this;
        var d_x = this.point2.x - this.point1.x;
        var d_y = this.point2.y - this.point1.y;
        var dd = Math.sqrt(d_x * d_x + d_y * d_y);
        var k = d_x * Math.abs(d_y) / (d_y * Math.abs(d_x));
        var k_x = d_x / Math.abs(d_x);
        var k_y = d_y / Math.abs(d_y);
        var d_x_1 = this.signLineLength * d_y / dd / 2;
        var d_y_1 = d_x_1 * d_x / d_y;

        var d_x_2 = Math.abs(this.textlenght_width * d_y / 2 / dd) * k_x;
        var d_y_2 = Math.abs(d_x_2 * d_y / d_x) * k_y;

        if (d_x == 0) {
            d_x_2 = this.textlenght_width / 2 ;
            d_y_2 = d_x_2 * k_y;
        }

        if (d_y == 0) {
            d_y_1 = this.signLineLength / 2 * k_x;
            d_y_2 = this.textlenght_width / 2 ;
        }

        this.firstArrow = new Konva.Arrow({
          points: [me.midPoint.x + d_x_1 - d_x_2, me.midPoint.y - d_y_1 - d_y_2,
                  me.point1.x + d_x_1, me.point1.y - d_y_1],
        });

        this.secondArrow = new Konva.Arrow({
          points: [me.midPoint.x + d_x_1 + d_x_2, me.midPoint.y - d_y_1 + d_y_2,
                  me.point2.x + d_x_1, me.point2.y - d_y_1],
        });

        this.firstArrow.pointerLength(this.ARROW_FOR_LENGTH_POINTER_LENGTH);
        this.firstArrow.pointerWidth(me.ARROW_FOR_LENGTH_POINTER_WIDTH);
        this.firstArrow.fill(me.ARROW_FOR_LENGTH_FILL);
        this.firstArrow.stroke(me.ARROW_FOR_LENGTH_STROKE);
        this.firstArrow.strokeWidth(me.ARROW_FOR_LENGTH_STROKEWIDTH);
    
        this.secondArrow.pointerLength(me.ARROW_FOR_LENGTH_POINTER_LENGTH);
        this.secondArrow.pointerWidth(me.ARROW_FOR_LENGTH_POINTER_WIDTH);
        this.secondArrow.fill(me.ARROW_FOR_LENGTH_FILL);
        this.secondArrow.stroke(me.ARROW_FOR_LENGTH_STROKE);
        this.secondArrow.strokeWidth(me.ARROW_FOR_LENGTH_STROKEWIDTH);

        this.layer.add(this.firstArrow);
        this.layer.add(this.secondArrow);

        this.firstArrow.hide();
        this.secondArrow.hide();
    }

    drawText() {
        var me = this;
        var d_x = this.point2.x - this.point1.x;
        var d_y = this.point2.y - this.point1.y;
        var dd = Math.sqrt(d_x * d_x + d_y * d_y);

        var d_x_1 = this.signLineLength * d_y / dd;
        var d_y_1 = d_x_1 * d_x / d_y;
        if (d_y == 0) {
            d_y_1 = this.signLineLength * d_x / Math.abs(d_x);
        }
        var alpha = Math.atan(d_y / d_x) * 180 / Math.PI;
        this.textLength = new Konva.Text({
          x: me.midPoint.x + d_x_1,
          y: me.midPoint.y - d_y_1,
          text: (dd / 100).toFixed(2) + " M",
          align: 'center',
          width: me.TEXTLENGTH_WIDTH,
          offsetX: 50 ,
        });
        me.textLength.rotation(alpha);
        this.layer.add(this.textLength);
        this.textLength.hide();
    }

    drawCornerCircle() {
        var me = this;
        this.cornerCircle = new Konva.Circle({
            x: me.point2.x,
            y: me.point2.y,
            radius: me.CORNER_CIRCLE_RADIUS,
            fill: me.CORNER_CIRCLE_FILL,
            stroke: me.CORNER_CIRCLE_STROKE,
            strokeWidth: me.CORNER_CIRCLE_STROKE_WIDTH,
            opacity: me.CORNER_CIRCLE_OPACITY_IN_ACTIVE
        });

        this.cornerCircle.on('mouseover', function() {
            this.opacity(me.CORNER_CIRCLE_OPACITY_ACTIVE);
            me.layer.draw();
        });

        this.cornerCircle.on('mouseout', function() {
            me.redrawConerCircle();
        });

        this.cornerCircle.on('click', function() {
            me.toggleCornerSelect();
        })

        this.layer.add(this.cornerCircle);
        this.layer.draw();
    }

    redraw() {
      this.redrawMainLine();
      this.redrawArrows();
      this.redrawSignLines();
      this.redrawText();
      this.redrawDragCircle();
      this.redrawConerCircle();
    }

    redrawMainLine() {
        this.mainLine.points([this.point1.x, this.point1.y, this.point2.x, this.point2.y]);
        if (this.isselected) {
            this.mainLine.stroke(this.over_stroke);
            this.mainLine.strokeWidth(this.over_strokeWidth);
        } else {
            this.mainLine.stroke(this.stroke);
            this.mainLine.strokeWidth(this.strokeWidth);
        }

        this.layer.draw();
    }

    redrawSignLines() {
        var d_x = this.point2.x - this.point1.x;
        var d_y = this.point2.y - this.point1.y;
        var dd = Math.sqrt(d_x * d_x + d_y * d_y);

        
        var d_x_1 = this.signLineLength * d_y / dd;
        var d_y_1 = d_x_1 * d_x / d_y;

        if (d_y == 0) {
            d_x_1 = 0;
            d_y_1 = this.signLineLength * d_x / Math.abs(d_x);
        }

        this.firstSignLine.points([this.point1.x, this.point1.y, this.point1.x + d_x_1, this.point1.y - d_y_1]);
        this.secondSignLine.points([this.point2.x, this.point2.y, this.point2.x + d_x_1, this.point2.y - d_y_1]);

        this.layer.draw();

        if (this.isShowLength) {
            this.firstSignLine.show();
            this.secondSignLine.show();
        } else {
            this.firstSignLine.hide();
            this.secondSignLine.hide();
        }
    }

    redrawArrows() {
        var d_x = this.point2.x - this.point1.x;
        var d_y = this.point2.y - this.point1.y;
        var dd = Math.sqrt(d_x * d_x + d_y * d_y);
        var k = d_x * Math.abs(d_y) / (d_y * Math.abs(d_x));
        var k_x = d_x / Math.abs(d_x);
        var k_y = d_y / Math.abs(d_y);
        var d_x_1 = this.signLineLength * d_y / dd / 2;
        var d_y_1 = d_x_1 * d_x / d_y;

        var d_x_2 = Math.abs(this.textlenght_width * d_y / 2 / dd) * k_x;
        var d_y_2 = Math.abs(d_x_2 * d_y / d_x) * k_y;

        if (d_x == 0) {
            d_x_2 = this.textlenght_width / 2 ;
            d_y_2 = d_x_2 * k_y;
        }

        if (d_y == 0) {
            d_y_1 = this.signLineLength / 2 * k_x;
            d_y_2 = this.textlenght_width / 2 ;
        }

        this.calcMidPoint();

        this.firstArrow.points([this.midPoint.x + d_x_1 - d_x_2, this.midPoint.y - d_y_1 - d_y_2, this.point1.x + d_x_1, this.point1.y - d_y_1]);
        this.secondArrow.points([this.midPoint.x + d_x_1 + d_x_2, this.midPoint.y - d_y_1 + d_y_2, this.point2.x + d_x_1, this.point2.y - d_y_1]);
        this.layer.draw();

        if (this.isShowLength) { 
            this.firstArrow.show();
            this.secondArrow.show();
        } else {
            this.firstArrow.hide();
            this.secondArrow.hide();
        }

    }

    redrawText() {
        var d_x = this.point2.x - this.point1.x;
        var d_y = this.point2.y - this.point1.y;
        var dd = Math.sqrt(d_x * d_x + d_y * d_y);

        var d_x_1 = this.signLineLength * d_y / dd;
        var d_y_1 = d_x_1 * d_x / d_y;
        if (d_y == 0) {
            d_y_1 = this.signLineLength * d_x / Math.abs(d_x);
        }
        var alpha = Math.atan(d_y / d_x) * 180 / Math.PI;
        this.calcMidPoint();
        this.textLength.x(this.midPoint.x + d_x_1);
        this.textLength.y(this.midPoint.y - d_y_1);
        this.textLength.text((dd / 100).toFixed(2) + " M");
        this.textLength.rotation(alpha);
        

        if (this.isShowLength) {
            this.textLength.show();
        } else {
            this.textLength.hide();
        }

        this.layer.draw();
    }

    redrawRelatedWalls() {
        this.preWall.point2.x = this.point1.x; this.preWall.point2.y = this.point1.y;
        this.nextWall.point1.x = this.point2.x; this.nextWall.point1.y = this.point2.y;
        this.preWall.redraw();
        this.nextWall.redraw();
        this.preWall.redrawDragCircle();
        this.nextWall.redrawDragCircle();
    }

    redrawDragCircle() {
        this.calcMidPoint();
        this.drageCircle.x(this.midPoint.x);
        this.drageCircle.y(this.midPoint.y);
        this.layer.draw();

        if(this.isselected) {
            this.drageCircle.show();
        } else {
            this.drageCircle.hide();
        }
    }

    redrawConerCircle() {
        this.cornerCircle.x(this.point2.x);
        this.cornerCircle.y(this.point2.y);
        if(this.isSelectedCorner) {
            this.cornerCircle.opacity(this.CORNER_CIRCLE_OPACITY_ACTIVE);
        } else {
            this.cornerCircle.opacity(this.CORNER_CIRCLE_OPACITY_IN_ACTIVE);
        }

        this.layer.draw();
    }

    calcMidPoint() {
        this.midPoint = new Point(this.point1.x + (this.point2.x - this.point1.x) / 2 ,
                        this.point1.y + (this.point2.y - this.point1.y) / 2);
    }

    calcLength() {
        var dx = this.point2.x - this.point1.x;
        var dy = this.point2.y - this.point1.y;
        var length = (Math.sqrt(dx * dx + dy * dy) / 100).toFixed(2);
        return length;
    }

    toggleToSelect() {
        this.isselected = !this.isselected;
       
        if (this.isselected) {
            this.global.selectedRoom.selectedObj = this;
        }else {
            this.global.selectedRoom.selectedObj = null;
        }

        this.global.selectedRoom.selectObjectRedraw();
    }

    toggleCornerSelect() {
        this.isSelectedCorner = !this.isSelectedCorner;
        if (this.isSelectedCorner) {
            this.global.selectedRoom.selectedCorner = this;
        } else{
            this.global.selectedRoom.selectedCorner = null;
        }

        // this.redrawConerCircle();
        this.global.selectedRoom.selectCornerRedraw();
    }

    setSelect() {
        this.isselected = true;
        this.redraw();
    }

    setDisSelect() {
        this.isselected = false;
        this.redraw();
    }

    changeLength(length) {
        length = length * 100;
        var dx = this.point2.x - this.point1.x;
        var dy = this.point2.y - this.point1.y;
        if (this.isChangeOtherwise) {
            dx = this.point1.x - this.point2.x;
            dy = this.point1.y - this.point2.y;
        }
        var length_origin = Math.sqrt(dx * dx + dy * dy);
        if (dx ==  0) {
            var signy = Math.sign(dy);
            if (this.isChangeOtherwise) {
                this.point1.y = this.point2.y + length * signy;
            } else {
                this.point2.y = this.point1.y + length * signy;
            }
        } else if(dy ==  0) {
            var signx = Math.sign(dx);
            if (this.isChangeOtherwise) {
                this.point1.x = this.point2.x + length * signx;
            } else {
                this.point2.x = this.point1.x + length * signx;
            }
        } else {
            var cosA = dx / length_origin;
            var sinA = dy / length_origin;

            var dX = length * cosA;
            var dY = length * sinA;

            if (!this.isChangeOtherwise) {
                this.point2.x = this.point1.x + dX;
                this.point2.y = this.point1.y + dY;
            } else {
                this.point1.x = this.point2.x + dX;
                this.point1.y = this.point2.y + dY;
            }
            
        }

        this.redraw();

        this.redrawRelatedWalls();
        
    }

    showLength(isshow) {
        this.isShowLength = isshow;
        this.redraw();
    }

    addCorner() {
        // this wall proc
        var dx = this.point2.x - this.point1.x;
        var dy = this.point2.y - this.point1.y;
        var L = Math.sqrt(dx * dx + dy * dy);
        
        
        var d_x = dx * this.CORNER_DEFAULT_LENGTH / L;
        var d_y = dy * this.CORNER_DEFAULT_LENGTH / L;
        this.point2.x = this.point2.x - d_x;
        this.point2.y = this.point2.y - d_y;
        console.log(this.point2);
        
       
        

        // next wall proc
        dx = this.nextWall.point1.x - this.nextWall.point2.x;
        dy = this.nextWall.point1.y - this.nextWall.point2.y;
        L = Math.sqrt(dx * dx + dy * dy);
        console.log(L);
        
        d_x = dx * this.CORNER_DEFAULT_LENGTH / L;
        d_y = dy * this.CORNER_DEFAULT_LENGTH / L;
        this.nextWall.point1.x = this.nextWall.point1.x - d_x;
        this.nextWall.point1.y = this.nextWall.point1.y - d_y;
        

        // creat new wall
        var newwall = new Wall(this.stage, this.layer, new Point(this.point2.x, this.point2.y), new Point(this.nextWall.point1.x, this.nextWall.point1.y), this.global);
        this.global.selectedRoom.walls.push(newwall);
        this.nextWall.preWall = newwall;
        newwall.nextWall = this.nextWall; 
        newwall.preWall = this; 
        this.nextWall = newwall;
        
        this.redraw();
        this.nextWall.redraw();
        newwall.nextWall.redraw();

    }
    
}
