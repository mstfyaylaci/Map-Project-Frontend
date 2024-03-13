import { Component, OnInit } from '@angular/core';
import { Point } from '../../models/point';
import { PointService } from '../../services/point.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { QueryPointModalComponent } from './query-point-modal/query-point-modal.component';

@Component({
  selector: 'app-point',
  templateUrl: './point.component.html',
  styleUrl: './point.component.scss'
})
export class PointComponent implements OnInit {

  points: Point[] = []
  point: Point
  dataLoaded = false
  

  constructor(
    private pointService: PointService,
    private toastrService:ToastrService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    
  }
  getPoints() {
    
    this.pointService.getPoints().subscribe((response) => {
      this.points = response.data
      this.dataLoaded = true
      
    })
  }

  

  openQueryPointModal(){
    
    this.getPoints()
    const dialogRef=this.dialog.open(QueryPointModalComponent,{
      width:'850px',
      height:'500px',

      data: { 
              }
    })

    dialogRef.afterClosed().subscribe(result => {
     this.getPoints()
    });
  }
}
