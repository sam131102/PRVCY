import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { map } from 'rxjs';
import { videolist } from './videolist'; 


@Injectable({
  providedIn: 'root'
})
export class VideoListService {
  baseUrl = 'http://localhost/api';

  constructor(private http: HttpClient) { }

  getAll(videolist: videolist){
    let params = new HttpParams()
    .set('username', videolist.username)
    .set('organizationcode', videolist.organizationcode);
                            

    return this.http.get('http://localhost/api/listOrg.php', {params}).pipe(
      map((res: any)=>{
        return res['data'];
      })
    )
  }

//   store(signup: signup){
//     return this.http.post('http://localhost/api/store.php', {data: signup}).pipe(
//       map((res: any)=>{
//         return res['data'];
//       })
//     )
//   }

}
