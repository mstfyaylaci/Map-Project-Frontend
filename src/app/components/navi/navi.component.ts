import { Component } from '@angular/core';
import { AddPointService } from '../../services/add-point.service';
import { PointService } from '../../services/point.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { QueryPointModalComponent } from '../point/query-modal/query-point-modal.component';
import { Point } from '../../models/point';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-navi',
  templateUrl: './navi.component.html',
  styleUrl: './navi.component.scss',
  
})
export class NaviComponent {

  points: Point[] = []
  point: Point
  dataLoaded = false
  dropdownItems = ['Point', 'Polygon', 'LineString'];
  selectedGeometry: string = 'Feature'
  constructor(
    
    private pointService: PointService,
    private toastrService:ToastrService,
    public dialog: MatDialog,
    private addPointService: AddPointService,
    
  ) { }


  getPointList() {
    
    this.pointService.getPoints().subscribe((response) => {
      this.points = response.data
      this.dataLoaded = true
      
    })
  }

 


  openQueryPointModal(){
    
    //this.getPoints()
    const dialogRef=this.dialog.open(QueryPointModalComponent,{
      width:'850px',
      height:'500px',

      data: { }
    })

    dialogRef.afterClosed().subscribe(result => {
     this.getPointList()
     
     
    });
  }

  onAddGeometry(selectedItem: string) {
    this.selectedGeometry = selectedItem;
    this.addPointService.emitButtonClick(selectedItem);; // Seçilen geometri verisini yayınla
  }

  
}
