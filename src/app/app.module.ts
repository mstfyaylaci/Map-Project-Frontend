import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MapComponent } from './components/map/map.component';


import { NaviComponent } from './components/navi/navi.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ModalComponent } from './components/point/add-point-modal/modal.component';
import { FilterPipePipe } from './pipes/filter-pipe.pipe';
import { ToastrModule } from 'ngx-toastr';
import { QueryPointModalComponent } from './components/point/query-modal/query-point-modal.component';
import { ModifyPointModalComponent } from './components/point/modify-point-modal/modify-point-modal.component';
import { AddPolygonModalComponent } from './components/point/polygon/add-polygon-modal/add-polygon-modal.component';
import { ModifyPolygonModalComponent } from './components/point/polygon/modify-polygon-modal/modify-polygon-modal.component';





@NgModule({
  declarations: [
    AppComponent,
    
    MapComponent,
    
    
    NaviComponent,
   
    ModalComponent,
    FilterPipePipe,
    QueryPointModalComponent,
    ModifyPointModalComponent,
    AddPolygonModalComponent,
    ModifyPolygonModalComponent,
    
    
    
   
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
