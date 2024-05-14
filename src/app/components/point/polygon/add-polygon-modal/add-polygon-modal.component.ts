import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Polygon } from '../../../../models/polygon';
import { PolygonService } from '../../../../services/polygon/polygon.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PolygonData } from './polygonData';

@Component({
  selector: 'app-add-polygon-modal',
  templateUrl: './add-polygon-modal.component.html',
  styleUrl: './add-polygon-modal.component.scss'
})
export class AddPolygonModalComponent implements OnInit{
  
  polygonAddForm: FormGroup;
  polygon = new Polygon();
  /**
   *
   */
  constructor(
    private polygonService:PolygonService,
    private toastrService:ToastrService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddPolygonModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PolygonData) {
    
  }
  
  onNoClick(): void {
    this.dialogRef.close();
    this.polygonAddForm.reset()
  }

  ngOnInit(): void {
   this.createForm()
  }

  createForm() {
    
    this.polygonAddForm = this.formBuilder.group({
        polygonName: ["", Validators.required],
        wkt: [this.data.wkt, Validators.required]
    });

   
}
  add() {
    if (this.polygonAddForm.valid) {
      this.polygon = Object.assign({}, this.polygonAddForm.value);
      this.polygonService.addPolygon(this.polygon).subscribe(
        (response) => {
          this.toastrService.success(response.message);
          this.dialogRef.close();
        },
        (error) => {
          this.toastrService.error("Bir hata oluştu. Lütfen tekrar deneyin.");
          console.error(error);
        }
      );
    } 
  }
}
