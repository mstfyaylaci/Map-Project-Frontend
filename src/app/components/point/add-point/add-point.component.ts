import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { Point } from '../../../models/point';

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
    
    
    private addPointService: AddPointService
  ) { }

  ngOnInit(): void {

  }

  

  onToggleDrawingMode() {
    // toggleDrawingMode olayını tetikle
    

    this.addPointService.emitButtonClick();



  }





}