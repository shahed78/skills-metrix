import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AddskillsService {
  private apiUrl = 'http://node-server-url/api/addskils'; 

  constructor(private http: HttpClient) { }

  postData(data: any) {
    return this.http.post(this.apiUrl, data);
  }
}
