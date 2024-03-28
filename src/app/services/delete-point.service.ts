import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Point } from '../models/point';

@Injectable({
  providedIn: 'root'
})
export class DeletePointService {

  private pointSource = new BehaviorSubject<Point | null>(null);
  currentPoint = this.pointSource.asObservable();

  constructor() { }

  changePoint(point: Point) {
    this.pointSource.next(point);
  }

  private buttonClickSource = new Subject<void>();
  buttonClick$ = this.buttonClickSource.asObservable();
  
 

  emitButtonClick() {
    this.buttonClickSource.next();
    
  }
}
