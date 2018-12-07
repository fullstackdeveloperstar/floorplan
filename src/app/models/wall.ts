import * as Konva from 'konva';
import { Point } from './point';

export class Wall {
    
    mainLine: Konva.Line;
    stroke = "#000000";
    strokeWidth = 3;

    constructor(
        public layer: Konva.Layer,
        public point1: Point,
        public point2: Point
    ) {
        this.drawWall();
    }

    drawWall() { 
        this.mainLine = new Konva.Line({
            points: [this.point1.x, this.point1.y, this.point2.x, this.point2.y],
            stroke: this.stroke,
            strokeWidth: this.strokeWidth,
          });

        this.layer.add(this.mainLine);
    }
}
