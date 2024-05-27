import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { map } from 'rxjs';
import { comment } from './comment';


@Injectable({
  providedIn: 'root'
})
export class CommentService {
  baseUrl = 'http://localhost/api';

  constructor(private http: HttpClient) { }

  getComments(comment: comment){
    let params = new HttpParams()
    .set('username', comment.username)
    .set('title', comment.title)
    .set('comment', comment.comment);
                            

    return this.http.get('http://localhost/api/getComments.php', {params}).pipe(
      map((res: any)=>{
        return res['data'];
      })
    )
  }


}
