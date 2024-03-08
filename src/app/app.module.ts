import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MapComponent } from './components/map/map.component';
import { PointComponent } from './components/point/point.component';
import { SidePanelComponent } from './components/side-panel/side-panel.component';
import { NaviComponent } from './components/navi/navi.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddPointComponent } from './components/point/add-point/add-point.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ModalComponent } from './components/point/modal/modal.component';
import { FilterPipePipe } from './pipes/filter-pipe.pipe';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    AppComponent,
    
    MapComponent,
    PointComponent,
    SidePanelComponent,
    NaviComponent,
    AddPointComponent,
    ModalComponent,
    FilterPipePipe,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass:"toast-bottom-right"
    })
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
