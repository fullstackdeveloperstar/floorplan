import * as Konva from 'konva';
import { Point } from './point';
import * as uuid from 'uuid';
import { Global } from './global';
import { Wall } from './wall';

export class SplitLine {
    
    fixedpoint1: Point;
    fixedpoint2: Point;
    midPoint: Point;
    currentWall: Wall;
    circle1: Konva.Circle;
    circle2: Konva.Circle;
    circleCenter: Konva.Circle;
    mainLine: Konva.Line;
    textLength: Konva.Text;

    CIRCLE_RADIUS = 10;
    CIRCLE_STROKE = '#F00';
    CIRCLE_FILL = '#FFF';
    CIRCLE_STROKE_WIDTH = 2;

    MAINLINE_STROKE = '#F00';
    MAINLINE_STROKE_WIDTH = 3;

    SIGN_LINE_LENGTH = 40;
    TEXTLENGTH_WIDTH = 50;

    constructor(
        private layer: Konva.Layer,
        private stage: Konva.Stage
    ) {
        var me = this;
        this.fixedpoint1 = new Point(0, 0);
        this.fixedpoint2 = new Point(100, 100);

        this.mainLine = new Konva.Line({
            points: [0, 0, 0, 1],
            stroke: me.MAINLINE_STROKE,
            strokeWidth: me.MAINLINE_STROKE_WIDTH
        });

        this.circle1 = new Konva.Circle({
            radius: me.CIRCLE_RADIUS,
            stroke: me.CIRCLE_STROKE,
            fill: me.CIRCLE_FILL,
            strokeWidth: me.CIRCLE_STROKE_WIDTH,
            draggable: true,
            dragBoundFunc: function(pos) {
                me.pointBounce(pos, "1");
                me.resetFixedPos(pos, "1");
                return pos;
            }
        });

        this.circle2 = new Konva.Circle({
            radius: me.CIRCLE_RADIUS,
            stroke: me.CIRCLE_STROKE,
            fill: me.CIRCLE_FILL,
            strokeWidth: me.CIRCLE_STROKE_WIDTH,
            draggable: true,
            dragBoundFunc: function(pos) {
                me.pointBounce(pos, "2");
                me.resetFixedPos(pos, "2");
                return pos;
            }
        });

        this.drawText();
        this.drawCenterCircle();

        this.mainLine.hide();
        this.circle1.hide();
        this.circle2.hide();

        this.layer.add(this.mainLine)
        this.layer.add(this.circle1);
        this.layer.add(this.circle2);
    }

    setPoint(point: Point, wall: Wall) {
        var isChange = this.checkWallChange(wall);
        this.revisePoint(point); 
        if(isChange) {
            this.setSecondPoint(point);
            this.drawPoint2();
        } else{
            this.fixedpoint1 = point;
            this.drawPoint1();
        }
    }

    checkWallChange(wall: Wall) {
        if(this.currentWall) {
            if (this.currentWall.id == wall.id) {
                return true;
            }
        }

        this.currentWall = wall;
        return false;
    }

    drawPoint1() {
        this.circle1.x(this.fixedpoint1.x);
        this.circle1.y(this.fixedpoint1.y);
        this.mainLine.hide();
        this.circle2.hide();
        this.circle1.show();
        this.textLength.hide();
        this.circleCenter.hide();
        this.layer.draw();
    }

    drawPoint2() {
        this.circle1.x(this.fixedpoint1.x);
        this.circle1.y(this.fixedpoint1.y);
        this.circle2.x(this.fixedpoint2.x);
        this.circle2.y(this.fixedpoint2.y);
        this.mainLine.show();
        this.circle1.show();
        this.circle2.show();
        this.textLength.show();
        this.circleCenter.show();
        this.redraw();
    }

    revisePoint(point: Point) {
        var dx = this.currentWall.point2.x - this.currentWall.point1.x;
        var dy = this.currentWall.point2.y - this.currentWall.point1.y;

        if(dx == 0) {
            point.x = this.currentWall.point1.x;
            point.y -= this.stage.y();
            return;
        }
        if(dy == 0) {
            point.y = this.currentWall.point1.y;
            point.x -= this.stage.x();
            return;
        }
        point.y -= this.stage.y();
        point.x -= this.stage.x();
    }

    pointBounce(pos, kind) {
        var dx = this.currentWall.point2.x - this.currentWall.point1.x;
        var dy = this.currentWall.point2.y - this.currentWall.point1.y;
        var range = this.getRangeOfCircles();
        if(dx == 0) {
            pos.x = this.currentWall.point1.x;
            pos.x += this.stage.x();
            if(pos.y > range.y2){
                pos.y = range.y2;
            }
            if(pos.y < range.y1) {
                pos.y = range.y1;
            }
            return;
        }

        if(dy == 0) {
            pos.y = this.currentWall.point1.y;
            pos.y += this.stage.y();
            if(pos.x > range.x2) {
                pos.x = range.x2;
            }

            if(pos.x < range.x1) {
                pos.x = range.x1;
            }
            return;
        }

        if(pos.x > range.x2) {
            pos.x = range.x2;
        }

        if(pos.x < range.x1) {
            pos.x = range.x1;
        }
        pos.y = (dy * (pos.x - this.stage.x()) + this.currentWall.point1.y * this.currentWall.point2.x - this.currentWall.point2.y * this.currentWall.point1.x) / dx;
        pos.y += this.stage.y();
        
        return;
    }

    getRangeOfCircles() {
        var range = {
            x1: 0, x2: 0,
            y1: 0, y2: 0
        };
        var dx = this.currentWall.point2.x - this.currentWall.point1.x;
        var dy = this.currentWall.point2.y - this.currentWall.point1.y;
        if(dx == 0) {
            if(dy > 0) {
                range.x1 = this.currentWall.point1.x;
                range.x2 = this.currentWall.point1.x;
                range.y1 = this.currentWall.point1.y;
                range.y2 = this.currentWall.point2.y;
            } else {
                range.x1 = this.currentWall.point1.x;
                range.x2 = this.currentWall.point1.x;
                range.y1 = this.currentWall.point2.y;
                range.y2 = this.currentWall.point1.y;
            }
            return range;
        }

        if(dy == 0) {
            if(dx > 0) {
                range.x1 = this.currentWall.point1.x;
                range.x2 = this.currentWall.point2.x;
                range.y1 = this.currentWall.point1.y;
                range.y2 = this.currentWall.point1.y;
            } else {
                range.x1 = this.currentWall.point2.x;
                range.x2 = this.currentWall.point1.x;
                range.y1 = this.currentWall.point1.y;
                range.y2 = this.currentWall.point1.y;
            }
            return range;
        }

        if(dx > 0) {
            range.x1 = this.currentWall.point1.x;
            range.x2 = this.currentWall.point2.x;
        } else {
            range.x1 = this.currentWall.point2.x;
            range.x2 = this.currentWall.point1.x;
        }

        return range;
    }

    resetFixedPos(pos, kind) {
        if(kind == 1) {
            this.fixedpoint1.x = pos.x - this.stage.x();
            this.fixedpoint1.y = pos.y - this.stage.y();
        }

        if(kind == 2) {
            this.fixedpoint2.x = pos.x - this.stage.x();
            this.fixedpoint2.y = pos.y - this.stage.y();
        }

        this.redraw();
    }

    setSecondPoint(point) {
        var dx1 = this.currentWall.point1.x - this.fixedpoint1.x;
        var dy1 = this.currentWall.point1.y - this.fixedpoint1.y;
        var L1 = dx1 * dx1 + dy1 * dy1;

        var dx2 = this.currentWall.point1.x - point.x;
        var dy2 = this.currentWall.point1.y - point.y;
        var L2 = dx2 * dx2 + dy2 * dy2;

        if (L1 < L2) {
            this.fixedpoint2 = point;
        } else {
            this.fixedpoint2.x = this.fixedpoint1.x;
            this.fixedpoint2.y = this.fixedpoint1.y;
            this.fixedpoint1 = point;
        }
    }

    redraw() {
        this.redrawMainLine();
        this.redrawText();
        this.redrawCircleCenter();
        this.layer.draw();
    }

    drawText() {
        this.calcMidPoint();
        var me = this;
        var d_x = this.fixedpoint2.x - this.fixedpoint1.x;
        var d_y = this.fixedpoint2.y - this.fixedpoint1.y;
        var dd = Math.sqrt(d_x * d_x + d_y * d_y);

        var d_x_1 = this.SIGN_LINE_LENGTH * d_y / dd;
        var d_y_1 = d_x_1 * d_x / d_y;
        if (d_y == 0) {
            d_y_1 = this.SIGN_LINE_LENGTH * d_x / Math.abs(d_x);
        }
        var alpha = Math.atan(d_y / d_x) * 180 / Math.PI;
        this.textLength = new Konva.Text({
          x: me.midPoint.x + d_x_1,
          y: me.midPoint.y - d_y_1,
          text: (dd / 100).toFixed(2) + " M",
          align: 'center',
          width: me.TEXTLENGTH_WIDTH,
          offsetX: 25 ,
        });
        me.textLength.rotation(alpha);
        this.textLength.hide();
        this.layer.add(this.textLength);
    }

    redrawMainLine() {
        this.mainLine.points([
            this.fixedpoint1.x, this.fixedpoint1.y,
            this.fixedpoint2.x, this.fixedpoint2.y
        ]);
    }

    redrawText() {
        this.calcMidPoint();
        var d_x = this.fixedpoint2.x - this.fixedpoint1.x;
        var d_y = this.fixedpoint2.y - this.fixedpoint1.y;
        var dd = Math.sqrt(d_x * d_x + d_y * d_y);

        var d_x_1 = this.SIGN_LINE_LENGTH * d_y / dd;
        var d_y_1 = d_x_1 * d_x / d_y;
        if (d_y == 0) {
            d_y_1 = this.SIGN_LINE_LENGTH * d_x / Math.abs(d_x);
        }
        var alpha = Math.atan(d_y / d_x) * 180 / Math.PI;
        
        this.textLength.x(this.midPoint.x + d_x_1);
        this.textLength.y(this.midPoint.y - d_y_1);
        this.textLength.text((dd / 100).toFixed(2) + " M");
        this.textLength.rotation(alpha);
        this.layer.draw();
    }

    calcMidPoint() {
        this.midPoint = new Point(this.fixedpoint1.x + (this.fixedpoint2.x - this.fixedpoint1.x) / 2 ,
                        this.fixedpoint1.y + (this.fixedpoint2.y - this.fixedpoint1.y) / 2);
    }

    drawCenterCircle() {
        var me = this;
        this.calcMidPoint();
        this.circleCenter = new Konva.Circle({
            radius: me.CIRCLE_RADIUS,
            stroke: me.CIRCLE_STROKE,
            fill: me.CIRCLE_FILL,
            strokeWidth: me.CIRCLE_STROKE_WIDTH,
            x: me.midPoint.x,
            y: me.midPoint.y
        });

        
        this.circleCenter.on("dblclick", function(){
            me.addWallsProc();
        });

        this.circleCenter.hide();
        this.layer.add(this.circleCenter);
        this.layer.draw();
    }

    redrawCircleCenter() {
        this.calcMidPoint();
        this.circleCenter.x(this.midPoint.x);
        this.circleCenter.y(this.midPoint.y);
        this.layer.draw();
    }

    addWallsProc() {
        this.resetFixedPoints();
        
        var point11 = new Point(this.fixedpoint1.x, this.fixedpoint1.y);
        var point12 = new Point(this.fixedpoint1.x, this.fixedpoint1.y);

        var point21 = new Point(this.fixedpoint1.x, this.fixedpoint1.y);
        var point22 = new Point(this.fixedpoint2.x, this.fixedpoint2.y);

        var point31 = new Point(this.fixedpoint2.x, this.fixedpoint2.y);
        var point32 = new Point(this.fixedpoint2.x, this.fixedpoint2.y);

        var point41 = new Point(this.fixedpoint2.x, this.fixedpoint2.y);
        var point42 = new Point(this.currentWall.point2.x, this.currentWall.point2.y);
        
        var wall1 = new Wall(this.stage, this.layer, point11, point12, this.currentWall.global);
        var wall2 = new Wall(this.stage, this.layer, point21, point22, this.currentWall.global);
        var wall3 = new Wall(this.stage, this.layer, point31, point32, this.currentWall.global);
        var wall4 = new Wall(this.stage, this.layer, point41, point42, this.currentWall.global);
        this.currentWall.point2.x = this.fixedpoint1.x;
        this.currentWall.point2.y = this.fixedpoint1.y;
        
        wall1.preWall = this.currentWall; wall1.nextWall = wall2;
        wall2.preWall = wall1; wall2.nextWall = wall3;
        wall3.preWall = wall2; wall3.nextWall = wall4;
        wall4.preWall = wall3; wall4.nextWall = this.currentWall.nextWall;
        this.currentWall.nextWall = wall1;
        this.currentWall.redraw();
        wall2.isShowLength = true;
        wall2.setSelect();
        this.currentWall.global.selectedRoom.selectedObj = wall2;
        this.currentWall.global.selectedRoom.isSelectedSplite = false;
        this.hideAll();

        this.currentWall.isShowLength = true;
        wall1.isShowLength = true;
        wall2.isShowLength = true;
        wall3.isShowLength = true;
        wall4.isShowLength = true;
    }

    resetFixedPoints() {
        var dx1 = this.currentWall.point1.x - this.fixedpoint1.x;
        var dy1 = this.currentWall.point1.y - this.fixedpoint1.y;
        var L1 = dx1 * dx1 + dy1 * dy1;

        var dx2 = this.currentWall.point1.x - this.fixedpoint2.x;
        var dy2 = this.currentWall.point1.y - this.fixedpoint2.y;
        var L2 = dx2 * dx2 + dy2 * dy2;

        if (L1 > L2) {
            var tempx = this.fixedpoint1.x;
            var tempy = this.fixedpoint1.y;
            this.fixedpoint1.x = this.fixedpoint2.x;
            this.fixedpoint1.y = this.fixedpoint2.y;
            this.fixedpoint2.x = tempx;
            this.fixedpoint2.y = tempy;
        }
    }

    hideAll(){
        this.circle1.hide();
        this.circle2.hide();
        this.circleCenter.hide();
        this.mainLine.hide();
        this.textLength.hide();
        this.layer.draw();
    }
}