import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class TwitterService {

  API_URL: string = `http://localhost:5000`;

  constructor(private http: Http) {}

  getData(query: string){
    query = query.replace(/#/, `[HASH]`);
    return this.http.get(`${this.API_URL}/data/${query}`).toPromise()
    .then(
      res => {
        console.log(res.json())
        return res.json().map(item => { return {
          geometry: {
            type: "point",
            longitude: item[`longitude`],
            latitude: item[`latitude`]
          },
          attributes: {
            ObjectID: 1,
            size: 50
          }
        }})
      },
      err => {console.log(err); return -1}
    ).catch(err => {console.log(err); return -1});
  }

}
