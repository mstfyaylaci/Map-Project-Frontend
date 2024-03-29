import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Point } from '../../../models/point';
import { PointService } from '../../../services/point.service';
import { ToastrService } from 'ngx-toastr';
import { ModifyPointModalComponent } from '../modify-point-modal/modify-point-modal.component';

import { ModifyPointService } from '../../../services/modify-point.service';
import { DeletePointService } from '../../../services/delete-point.service';


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
    private modifyPointService:ModifyPointService,
    private toastrService:ToastrService,
    public dialog: MatDialog,
    private deletePointService:DeletePointService
   
    ) {
    
    
  }
  

  ngOnInit(): void {
    
    this.getPoints()
    
  }

  deletePoint(point: Point) {
    this.pointService.deletePoint(point).subscribe(response => {
      this.toastrService.error(response.message,point.pointName)
      this.points = this.points.filter(p => p !== point);
      this.deletePointService.changePoint(point)
      this.deletePointService.emitButtonClick()
    })

  }

  getPoints() {
    
    this.pointService.getPoints().subscribe((response) => {
      this.points = response.data
      this.toastrService.success(response.message)
      this.dataLoaded = true
     
    })
  }

  getModifyPoint(pointId:number){

    this.dialogRef.close()
    this.pointService.getPointById(pointId).subscribe(response=>{
      this.point=response.data

      this.openModifyPointModal(this.point)
      
    })
    
  }


  openModifyPointModal(point:Point) {
    
    
    const dialogRef = this.dialog.open(ModifyPointModalComponent, {

      width: '400px',
      height: '530px',

      data: { point}

    });

    

    

  }
}
