/* * * ./app/comments/services/comment.service.ts * * */
// Imports
import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';



// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AuthService {
    
     constructor (private http: Http) {}


     getUsers(){
        return this.http.get("http://localhost:1337/auth/donors_public") // ...using post request   
     }

     getHospitals(){
        return this.http.get("http://localhost:1337/hospital/index") // ...using post request   
       
     }

}