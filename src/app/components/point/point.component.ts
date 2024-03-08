import { Component, OnInit } from '@angular/core';
import { Point } from '../../models/point';
import { PointService } from '../../services/point.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-point',
  templateUrl: './point.component.html',
  styleUrl: './point.component.scss'
})
export class PointComponent implements OnInit {

  points: Point[] = []
  point: Point
  dataLoaded = false
  filterText = ""

  constructor(
    private pointService: PointService,
    private toastrService:ToastrService) { }

  ngOnInit(): void {
    this.getPoints()
  }
  getPoints() {
    this.pointService.getPoints().subscribe((response) => {
      this.points = response.data
      this.dataLoaded = true
      this.toastrService.success(response.message)
    })
  }

  deletePoint(point: Point) {
    this.pointService.deletePoint(point).subscribe(response => {
      this.points = this.points.filter(p => p !== point);
      this.toastrService.error(response.message,point.pointName)

    })

  }
}
