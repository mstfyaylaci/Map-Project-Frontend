import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';


import { PointService } from '../../../services/point.service';
import { ToastrService } from 'ngx-toastr';
import { ModifyPointModalComponent } from '../modify-point-modal/modify-point-modal.component';

import { ModifyPointService } from '../../../services/modify-point.service';
import { DeletePointService } from '../../../services/delete-point.service';


import { PolygonService } from '../../../services/polygon/polygon.service';
import { Polygon } from '../../../models/polygon';
import { Point } from '../../../models/point';
import { ModifyPolygonModalComponent } from '../polygon/modify-polygon-modal/modify-polygon-modal.component';


@Component({
  selector: 'app-query-point-modal',
  templateUrl: './query-point-modal.component.html',
  styleUrl: './query-point-modal.component.scss'
})
export class QueryPointModalComponent implements OnInit{

  points: Point[] = []
  point: Point
  polygons:Polygon[]=[]
  polygon:Polygon

  dataLoaded = false
  filterText=""
  selectedOption: string = 'Points';

  /**
   *
   */
  constructor(public dialogRef: MatDialogRef<QueryPointModalComponent>,
    private pointService:PointService,
    private modifyPointService:ModifyPointService,
    private toastrService:ToastrService,
    public dialog: MatDialog,
    private deletePointService:DeletePointService,
    private polygonService:PolygonService
   
    ) {
    
    
  }
  

  ngOnInit(): void {
    
    this.getPoints()
    this.getPolygons()
  }

  deletePoint(point: Point) {
    this.pointService.deletePoint(point).subscribe(response => {
      this.toastrService.error(response.message,point.pointName)
      this.points = this.points.filter(p => p !== point);
      this.deletePointService.changePoint(point)
      this.deletePointService.emitButtonClick()
    })

  }

  deletePolygon(polygon:Polygon){
    
    this.polygonService.deletePolygon(polygon).subscribe(response=>{
      this.toastrService.error(response.message,polygon.polygonName)
      this.polygons=this.polygons.filter(p=>p!==polygon)
      this.deletePointService.changePolygon(polygon)
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

  getPolygons(){
    this.polygonService.getPolygons().subscribe(response=>{
      this.polygons=response.data
      this.dataLoaded=true
      
    })
  }

  getModifyPoint(pointId:number){

    this.dialogRef.close()
    this.pointService.getPointById(pointId).subscribe(response=>{
      this.point=response.data

      this.openModifyPointModal(this.point)
      
    })
    
  }
  getModifyPolygon(polygonId:number){
    this.dialogRef.close()
    
    this.polygonService.getPolygonById(polygonId).subscribe(response=>{
      this.polygon=response.data

      this.openModifyPolygonModal(this.polygon)
      
    })
  }
  openModifyPolygonModal(polygon:Polygon){
    console.log(polygon);
    const dialogRef = this.dialog.open(ModifyPolygonModalComponent, {

      width: '600px',
      height: '400px',

      data: { polygon}

    });
  }

  openModifyPointModal(point:Point) {
    
    
    const dialogRef = this.dialog.open(ModifyPointModalComponent, {

      width: '400px',
      height: '530px',

      data: { point}

    });

  }

  onSelectChangeGeometry(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedOption = selectedValue;
    
  }
}
