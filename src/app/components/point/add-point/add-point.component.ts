import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PointService } from '../../../services/point.service';
import { Point } from '../../../models/point';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { AddPointService } from '../../../services/add-point.service';



@Component({
  selector: 'app-add-point',
  templateUrl: './add-point.component.html',
  styleUrl: './add-point.component.scss'
})
export class AddPointComponent implements OnInit {
  
  point: Point=new Point();
  isDrawingModeActive: boolean = false;
  


  constructor(
    private pointService: PointService,
    public dialog: MatDialog,
    private addPointService:AddPointService
    ) { }
 
  ngOnInit(): void {
    
  }
 
  openAddPointModal() {
    
    const dialogRef = this.dialog.open(ModalComponent, {
      
      width: '400px',
      height:'470px',
      
      data: { }
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });

  }

  onToggleDrawingMode() {
    // toggleDrawingMode olayını tetikle
    this.isDrawingModeActive = !this.isDrawingModeActive;
    
    
      this.addPointService.emitButtonClick();
    
   
    
  }




   // addPoint(form: NgForm): void {
    
  //   this.pointService.addPoint(this.point).subscribe((response) => {
  //     // API yanıtını işlethi
  //   });
  // }

  // openAddPointModal() {
    
  //   $('#addPointModal').modal('show');
  //   // Modal açıldığında API'den noktaları yükleme fonksiyonunu çağırabilirsiniz (örneğin getPoints())

  // }

  // closeModal(){
  //   $('#addPointModal').modal('hide');
  // }

  
  

  



}