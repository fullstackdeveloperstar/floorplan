import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainpanelComponent } from './mainpanel/mainpanel.component';
import { LeftsidebarComponent } from './leftsidebar/leftsidebar.component';
import { RightsideComponent } from './rightside/rightside.component';
import { TopbarComponent } from './topbar/topbar.component';
import { PanelComponent } from './panel/panel.component';
import { Global } from './models/global';

@NgModule({
  declarations: [
    AppComponent,
    MainpanelComponent,
    LeftsidebarComponent,
    RightsideComponent,
    TopbarComponent,
    PanelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
   Global
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
