import { Wall } from "./wall";
import * as Konva from 'konva';
import { Point } from "./point";
import { Global } from "./global";
import * as uuid from 'uuid';
import { SplitLine } from "./splitline";

export class Room {
    id: string;
    public walls: Wall[] = [];
    selectedObj : any;
    selectedCorner: any;
    isSelectedSplite : boolean;
    public splitLine: SplitLine;
    
    constructor(
        private stage: Konva.Stage,
        private layer: Konva.Layer,
        private global: Global
    ) {
        this.id = uuid();
        this.demoWalls();
        this.splitLine = new SplitLine(this.layer, this.stage);
    }

    demoWalls() {
        var p11 = new Point(300, 100), p12 = new Point(800, 100); 
        var p21 = new Point(800, 100), p22 = new Point(800, 600);
        var p31 = new Point(800, 600), p32 = new Point(300, 600);
        var p41 = new Point(300, 600), p42 = new Point(300, 100);
        var wall1 = new Wall(this.stage, this.layer, p11, p12, this.global);
        var wall2 = new Wall(this.stage, this.layer, p21, p22, this.global);
        var wall3 = new Wall(this.stage, this.layer, p31, p32, this.global);
        var wall4 = new Wall(this.stage, this.layer, p41, p42, this.global);
        wall1.preWall = wall4; wall1.nextWall = wall2;
        wall2.preWall = wall1; wall2.nextWall = wall3;
        wall3.preWall = wall2; wall3.nextWall = wall4;
        wall4.preWall = wall3; wall4.nextWall = wall1;
        this.walls.push(wall1);
        this.walls.push(wall2);
        this.walls.push(wall3);
        this.walls.push(wall4);
    }

    selectObjectRedraw() {
    
        this.walls.forEach(wall => {
            if (this.selectedObj) {
                if (wall.id == this.selectedObj.id){
                    wall.setSelect();
                } else {
                    wall.setDisSelect();
                }
            } else {
                wall.setDisSelect();
            }
            
        });
    }

    selectCornerRedraw() {
        this.walls.forEach(wall => {
            if (this.selectedCorner) {
                if (wall.id == this.selectedCorner.id){
                    wall.isSelectedCorner = true;
                } else {
                    wall.isSelectedCorner = false;
                }
            } else {
                wall.isSelectedCorner = false;
            }
            wall.redraw();
        });
    }

}
