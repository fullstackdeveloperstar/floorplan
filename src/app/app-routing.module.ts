import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainpanelComponent } from './mainpanel/mainpanel.component';

const routes: Routes = [
  {
    path: "",
    component: MainpanelComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
