import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Point } from '../../../models/point';
import { PointService } from '../../../services/point.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-query-point-modal',
  templateUrl: './query-point-modal.component.html',
  styleUrl: './query-point-modal.component.scss'
})
export class QueryPointModalComponent implements OnInit{

  points: Point[] = []
  point: Point
  dataLoaded = false
  filterText=""

  /**
   *
   */
  constructor(public dialogRef: MatDialogRef<QueryPointModalComponent>,
    private pointService:PointService,
    private toastrService:ToastrService,
    ) {
    
    
  }
  

  ngOnInit(): void {
    
    this.getPoints()
    
  }

  deletePoint(point: Point) {
    this.pointService.deletePoint(point).subscribe(response => {
      this.toastrService.error(response.message,point.pointName)
      this.points = this.points.filter(p => p !== point);
      
    })

  }

  getPoints() {
    
    this.pointService.getPoints().subscribe((response) => {
      this.points = response.data
      this.toastrService.success(response.message)
      this.dataLoaded = true
     
    })
  }
}
