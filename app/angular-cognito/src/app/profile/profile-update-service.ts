import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { map } from 'rxjs';
import { profile } from './profile';


@Injectable({
  providedIn: 'root'
})
export class ProfileUpdateService {
  baseUrl = 'http://localhost/api';
  
  constructor(private http: HttpClient) { }

  update(profile: profile) {



    return this.http.put('http://localhost/api/update.php', {data: profile});
  }

}
