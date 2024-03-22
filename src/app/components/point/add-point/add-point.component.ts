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

  point: Point = new Point();
  isDrawingModeActive: boolean = false;



  constructor(
    private pointService: PointService,
    public dialog: MatDialog,
    private addPointService: AddPointService
  ) { }

  ngOnInit(): void {

  }

  

  onToggleDrawingMode() {
    // toggleDrawingMode olayını tetikle
    

    this.addPointService.emitButtonClick();



  }





}