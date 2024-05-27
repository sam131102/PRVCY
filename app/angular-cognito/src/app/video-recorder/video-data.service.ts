import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs';
import { videodata } from './video-data'; 


@Injectable({
  providedIn: 'root'
})
export class VideoDataService {
  baseUrl = 'http://localhost/api';

  constructor(private http: HttpClient) { }

  store(videodata: videodata){
    return this.http.post('http://localhost/api/uploadVidData.php', {data: videodata}).pipe(
      map((res: any)=>{
        return res['data'];
      })
    )
  }

}
