import { Component, OnInit } from '@angular/core';
import { Global } from '../models/global';

@Component({
  selector: 'app-leftsidebar',
  templateUrl: './leftsidebar.component.html',
  styleUrls: ['./leftsidebar.component.scss']
})
export class LeftsidebarComponent implements OnInit {

  private length: number;
  

  constructor(
    private global: Global
  ) {
   }

  ngOnInit() {
  }

  lengthChanged(length: number) {
    this.global.selectedRoom.selectedObj.changeLength(length);
  } 

  showlength(isshow) {
    this.global.selectedRoom.selectedObj.showLength(isshow);
  }
  
  addCorner() {
    if (!(this.global.selectedRoom && this.global.selectedRoom.selectedCorner)) {
      return;
    }

    this.global.selectedRoom.selectedCorner.addCorner();
  }

  toggleSplitLines() {
    this.global.selectedRoom.isSelectedSplite = !this.global.selectedRoom.isSelectedSplite  ;
  }

}
