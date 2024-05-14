import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ListResponseModel } from '../../models/listResponseModel';

import { Observable, catchError, tap, throwError } from 'rxjs';
import { SingleResponseModel } from '../../models/singleResponseModel';
import { ResponseModel } from '../../models/responseModel';
import { Polygon } from '../../models/polygon';

@Injectable({
  providedIn: 'root'
})
export class PolygonService {

  apiUrl="https://localhost:44363/api/"

  constructor(private httpClient:HttpClient) { }


  

  getPolygons():Observable<ListResponseModel<Polygon>>{
    let newPath=this.apiUrl+"Polygons/getall"

    return this.httpClient.get<ListResponseModel<Polygon>>(newPath)
  }

  getPolygonById(polygonId:number):Observable<SingleResponseModel<Polygon>>{
    let newPath=this.apiUrl+"Polygons/getid?id="+polygonId

    return this.httpClient.get<SingleResponseModel<Polygon>>(newPath)
  }
  

  addPolygon(polygon:Polygon):Observable<ResponseModel>{
    let newPath=this.apiUrl+"Polygons/add"

    return this.httpClient.post<ResponseModel>(newPath,polygon).pipe(
      tap(data=>console.log(JSON.stringify(data))),
      catchError(this.handleError)
    )
  }

  deletePolygon(polygon:Polygon):Observable<ResponseModel>{
    let newPath=this.apiUrl+"Polygons/delete"
    return this.httpClient.post<ResponseModel>(newPath,polygon).pipe(
      tap(data=>console.log(JSON.stringify(data))),
      catchError(this.handleError)
    )
  }

  updatePolygon(polygon:Polygon):Observable<ResponseModel>{
    let newPath=this.apiUrl+"Polygons/update"
    return this.httpClient.post<ResponseModel>(newPath,polygon).pipe(
      tap(data=>console.log(JSON.stringify(data))),
      catchError(this.handleError)
    )
  }

  handleError(err: HttpErrorResponse) {
    let errorMessage = ''
    if (err.error instanceof ErrorEvent) {
      errorMessage = 'bir hata oluştu' + err.error.message
    }
    else {
      errorMessage = 'Siistemsel bir hata'
    }
    return throwError(errorMessage)
  }
}
