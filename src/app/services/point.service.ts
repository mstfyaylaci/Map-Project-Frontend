import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { Point } from '../models/point';
import { ResponseModel } from '../models/responseModel';
import { SingleResponseModel } from '../models/singleResponseModel';


@Injectable({
  providedIn: 'root'
})
export class PointService {


  
  apiUrl="https://localhost:44363/api/"

  constructor(private httpClient:HttpClient) { }


  getPoints():Observable<ListResponseModel<Point>>{
    let newPath=this.apiUrl+"Points/getall"

    return this.httpClient.get<ListResponseModel<Point>>(newPath)
  }

  getPointById(pointId:number):Observable<SingleResponseModel<Point>>{
    let newPath=this.apiUrl+"Points/getid?id="+pointId

    return this.httpClient.get<SingleResponseModel<Point>>(newPath)
  }
  

  addPoint(point:Point):Observable<ResponseModel>{
    let newPath=this.apiUrl+"Points/add"

    return this.httpClient.post<ResponseModel>(newPath,point).pipe(
      tap(data=>console.log(JSON.stringify(data))),
      catchError(this.handleError)
    )
  }

  deletePoint(point:Point):Observable<ResponseModel>{
    let newPath=this.apiUrl+"Points/delete"
    return this.httpClient.post<ResponseModel>(newPath,point).pipe(
      tap(data=>console.log(JSON.stringify(data))),
      catchError(this.handleError)
    )
  }

  updatePoint(point:Point):Observable<ResponseModel>{
    let newPath=this.apiUrl+"Points/update"
    return this.httpClient.post<ResponseModel>(newPath,point).pipe(
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
