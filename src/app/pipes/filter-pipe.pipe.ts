import { Pipe, PipeTransform } from '@angular/core';
import { Point } from '../models/point';

@Pipe({
  name: 'filterPipe'
})
export class FilterPipePipe implements PipeTransform {

  transform(value: Point[], filterText: string): Point[] {
    filterText=filterText?
                filterText.toLocaleLowerCase()
                :""
    return filterText?
            value.filter((p:Point)=>p.pointName.toLocaleLowerCase().indexOf(filterText)!==-1)
            :value;
  }

}
