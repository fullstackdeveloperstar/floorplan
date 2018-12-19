import { Component, OnInit } from '@angular/core';
import * as Konva from 'konva';
import { Wall } from '../models/wall';
import { Point } from '../models/point';
import { Room } from '../models/room';
import { Global } from '../models/global';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  stage: Konva.Stage;
  layer: Konva.Layer;

  container: string = 'main-drawing-stage';
  width: number = 2000;
  height: number = 2000;
  scaleBy = 1.01;

  constructor(
    private global: Global
  ) { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.initPanel();
  }

  initPanel() {

    var elmnt = document.getElementById("main-drawing-stage");
    
    this.stage = new Konva.Stage({
      container: this.container,
      width: elmnt.offsetWidth,
      height: elmnt.offsetHeight,
      draggable: true
    });

    this.layer = new Konva.Layer();
    var room = new Room(this.stage, this.layer, this.global);

    this.global.rooms.push(room);
    this.global.selectedRoom = room;
    
    this.stage.add(this.layer);

    var me = this;
    window.addEventListener('wheel', (e) => {
        e.preventDefault();
        var oldScale = me.stage.scaleX();

        var mousePointTo = {
            x: me.stage.getPointerPosition().x / oldScale - me.stage.x() / oldScale,
            y: me.stage.getPointerPosition().y / oldScale - me.stage.y() / oldScale,
        };

        var newScale = e.deltaY > 0 ? oldScale * me.scaleBy : oldScale / me.scaleBy;
        me.stage.scale({ x: newScale, y: newScale });

        var newPos = {
            x: -(mousePointTo.x - me.stage.getPointerPosition().x / newScale) * newScale,
            y: -(mousePointTo.y - me.stage.getPointerPosition().y / newScale) * newScale
        };
        me.stage.position(newPos);
        me.stage.batchDraw();
    });
  }

  

}
