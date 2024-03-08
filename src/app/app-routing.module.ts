import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PointComponent } from './components/point/point.component';
import { MapComponent } from './components/map/map.component';

const routes: Routes = [
  {path:'points',component:PointComponent},
  {path:'home',component:MapComponent},
  {
    path:"",pathMatch:"full" ,component:MapComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
