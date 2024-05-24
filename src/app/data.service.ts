import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseData } from './app.component';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {

   }

   getFiles(): Observable<ResponseData> {
      return this.http.get<ResponseData>('./assets/loc.json');
    }

}
