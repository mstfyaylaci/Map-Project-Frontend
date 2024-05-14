import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AddPointService {
 

  

  constructor() { }

  
  private buttonClickSource = new Subject<string>();
  buttonClick$ = this.buttonClickSource.asObservable();

  emitButtonClick(geometry: string) {
    this.buttonClickSource.next(geometry);
  }

  
  
  

}
