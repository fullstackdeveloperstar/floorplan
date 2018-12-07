import { Component, OnInit } from '@angular/core';
import * as Konva from 'konva';
import { Wall } from '../models/wall';
import { Point } from '../models/point';

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

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.initPanel();
  }

  initPanel() {
    this.stage = new Konva.Stage({
      container: this.container,
      width: this.width,
      height: this.height,
      // draggable: true
    });

    this.layer = new Konva.Layer();
    
    var p1 = new Point(10, 10);
    var p2 = new Point(100, 100);
    var wall = new Wall(this.layer, p1, p2 );

    this.stage.add(this.layer);
  }

  

}
