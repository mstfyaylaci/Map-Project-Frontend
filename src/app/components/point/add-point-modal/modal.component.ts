import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Mapdata } from './mapData';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PointService } from '../../../services/point.service';
import { ToastrService } from 'ngx-toastr';
import { Point } from '../../../models/point';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit{

  pointAddForm: FormGroup;
  point: Point = new Point();

  constructor(
    private pointService:PointService,
    private toastrService:ToastrService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Mapdata
  ) {}

  

  onNoClick(): void {
    this.dialogRef.close();
    this.pointAddForm.reset()
  }

  ngOnInit(): void {
    this.createForm();
   
}

createForm() {
    this.pointAddForm = this.formBuilder.group({
        pointName: ["", Validators.required],
        pointNumber: ["", Validators.required],
        latitude: ["", Validators.required],
        longitude: ["", Validators.required]
    });

    if (this.data.clickedCoordinate && this.data.clickedCoordinate.length === 2) {
        this.pointAddForm.patchValue({
            latitude: this.data.clickedCoordinate[0],
            longitude: this.data.clickedCoordinate[1]
        });
    } else {
        // Default values or handle the case when clickedCoordinate is not available
    }
}


  add() {
    if (this.pointAddForm.valid) {
      this.point = Object.assign({}, this.pointAddForm.value);
      this.pointService.addPoint(this.point).subscribe(
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
