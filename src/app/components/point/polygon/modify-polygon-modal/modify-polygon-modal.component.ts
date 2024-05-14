import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Polygon } from '../../../../models/polygon';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PolygonData } from './polygonData';
import { PolygonService } from '../../../../services/polygon/polygon.service';
import { ModifyPointService } from '../../../../services/modify-point.service';

@Component({
  selector: 'app-modify-polygon-modal',
  templateUrl: './modify-polygon-modal.component.html',
  styleUrl: './modify-polygon-modal.component.scss'
})
export class ModifyPolygonModalComponent implements OnInit{
  
  polygonUpdateForm: FormGroup;
  polygon: Polygon ;
  statusModiftButton:boolean
  constructor( 
    private polygonService:PolygonService,
    private toastrService:ToastrService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModifyPolygonModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PolygonData,
    private modifyPointService:ModifyPointService
    ) {
      this.statusModiftButton=this.data.statusModifyButton
  }

  ngOnInit(): void {
   this.createForm()
  }

  createForm() {
    
    this.polygonUpdateForm = this.formBuilder.group({
        id:[this.data.polygon.id,Validators.required],
        polygonName: [this.data.polygon.polygonName, Validators.required],
        wkt: [this.data.polygon.wkt, Validators.required]
        
    });

    
}



update() {
  
  if (this.polygonUpdateForm.valid) {
    // Form geçerliyse, form değerlerini bir Point nesnesine atayalım
    this.polygon = Object.assign({}, this.polygonUpdateForm.value);
    
    // Güncelleme servisini çağırarak güncelleme işlemini gerçekleştirelim
    this.polygonService.updatePolygon(this.polygon).subscribe(
      (response) => {
        // Başarılı yanıt durumunda kullanıcıya bir başarı mesajı gösterelim
        this.toastrService.success(response.message);
        console.log("gdfg");
        // Dialog penceresini kapatıp formu sıfırlayalım
        this.dialogRef.close();
        this.polygonUpdateForm.reset();
        
      },
      (error) => {
        // Hata durumunda kullanıcıya bir hata mesajı gösterelim
        this.toastrService.error("Bir hata oluştu. Lütfen tekrar deneyin.");
        console.error(error);
      }
    );
  }
}


polygonModify() {
  const polygon = this.data.polygon;

  // Point nesnesinin tüm bilgilerini servise gönder
  this.modifyPointService.changePolygon(polygon);
  this.toastrService.info("Polygon düzenleyebilirsiniz")
  this.modifyPointService.emitButtonClick()
  this.dialogRef.close();
}

onNoClick(): void {
  this.dialogRef.close();
  this.polygonUpdateForm.reset()
}


}
