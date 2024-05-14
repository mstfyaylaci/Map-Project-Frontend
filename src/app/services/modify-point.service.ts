import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Point } from '../models/point';
import { Polygon } from '../models/polygon';

@Injectable({
  providedIn: 'root'
})
export class ModifyPointService {

  private pointSource = new BehaviorSubject<Point | null>(null);
  currentPoint = this.pointSource.asObservable();

  private polygonSource = new BehaviorSubject<Polygon | null>(null);
  currentPolygon = this.polygonSource.asObservable();

  private buttonClickSource = new Subject<void>();
  buttonClick$ = this.buttonClickSource.asObservable();
  
  constructor() { }

  changePoint(point: Point) {
    this.pointSource.next(point);
  }
  changePolygon(polygon: Polygon) {
    this.polygonSource.next(polygon);
  }

  
 

  emitButtonClick() {
    this.buttonClickSource.next();
    
  }

}
