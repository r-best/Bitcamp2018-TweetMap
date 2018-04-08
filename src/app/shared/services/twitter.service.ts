import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class TwitterService {

  API_URL: string = `http://localhost:5000`;

  constructor(private http: Http) {}

  getData(query: string){
    return this.http.get(`${this.API_URL}/data/${query}`).toPromise()
    .then(
      res => {
        console.log(res.json())
        return res.json()
      },
      err => {console.log(err); return {}}
    ).catch(err => {console.log(err); return {}});
  }

}
