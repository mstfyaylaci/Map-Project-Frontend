import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CordinateService {

  private coordinatesSubject=new BehaviorSubject<any>({})

  constructor() { }

  sendCoordinates(coordinates: any) {
    
    this.coordinatesSubject.next(coordinates);
  }

  getCoordinates() {
    return this.coordinatesSubject.asObservable();
  }
}
