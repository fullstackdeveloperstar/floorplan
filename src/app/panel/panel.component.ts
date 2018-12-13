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
  }

  

}
