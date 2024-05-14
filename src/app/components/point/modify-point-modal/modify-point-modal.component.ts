import { Component, Inject, OnInit } from '@angular/core';
import { PointService } from '../../../services/point.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PointData } from './pointData';
import { Point } from '../../../models/point';

import { ModifyPointService } from '../../../services/modify-point.service';


@Component({
  selector: 'app-modify-point-modal',
  templateUrl: './modify-point-modal.component.html',
  styleUrl: './modify-point-modal.component.scss'
})
export class ModifyPointModalComponent implements OnInit {
  
  pointUpdateForm: FormGroup;
  point: Point ;
  statusModiftButton:boolean

  constructor(
    private pointService:PointService,
    private toastrService:ToastrService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModifyPointModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PointData,
    
    private modifyPointService:ModifyPointService,
    
    
  ) { this.statusModiftButton=this.data.statusModifyButton}
  
  ngOnInit(): void {
    this.createForm();
  }


  onNoClick(): void {
    this.dialogRef.close();
    this.pointUpdateForm.reset()
  }

  createForm() {
    
    this.pointUpdateForm = this.formBuilder.group({
        id:[this.data.point.id,Validators.required],
        pointName: [this.data.point.pointName, Validators.required],
        pointNumber: [this.data.point.pointNumber, Validators.required],
        latitude: [this.data.point.latitude, Validators.required],
        longitude: [this.data.point.longitude, Validators.required]
    });

    
}



update() {
  
  if (this.pointUpdateForm.valid) {
    // Form geçerliyse, form değerlerini bir Point nesnesine atayalım
    this.point = Object.assign({}, this.pointUpdateForm.value);
    
    // Güncelleme servisini çağırarak güncelleme işlemini gerçekleştirelim
    this.pointService.updatePoint(this.point).subscribe(
      (response) => {
        // Başarılı yanıt durumunda kullanıcıya bir başarı mesajı gösterelim
        this.toastrService.success(response.message);
        console.log("gdfg");
        // Dialog penceresini kapatıp formu sıfırlayalım
        this.dialogRef.close();
        this.pointUpdateForm.reset();
        
      },
      (error) => {
        // Hata durumunda kullanıcıya bir hata mesajı gösterelim
        this.toastrService.error("Bir hata oluştu. Lütfen tekrar deneyin.");
        console.error(error);
      }
    );
  }
}


pointModify() {
  const point = this.data.point;

  // Point nesnesinin tüm bilgilerini servise gönder
  this.modifyPointService.changePoint(point);
  this.toastrService.info("Noktayı sürükleyebilirsiniz")
  this.modifyPointService.emitButtonClick()
  this.dialogRef.close();
}




}
