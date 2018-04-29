import { Component, OnInit, OnDestroy } from '@angular/core';
const template =  '<h1>My First Angular 2 App</h1>'

import {Router} from "@angular/router";

import { AuthService } from './services/auth.service';
import { last } from 'rxjs/operator/last';




@Component({
    selector: 'my-app',
    templateUrl: 'templates/app.component.html',
    providers: [AuthService]
})
export class AppComponent implements OnInit { 


    users = [''];
    hospitals = [''];
    n_hospitals = [''];

    constructor(public auth_service :AuthService) { 
        this.users =[]
        this.hospitals =[]
        this.n_hospitals = []
    }
    ngOnInit() {
        console.log("started")
        this.auth_service.getUsers()
        .subscribe(
            (data)=>{
                this.users = data.json()
                console.log(this.users)
            },
            (err)=>{
                console.log(err)
            }
        )


        this.auth_service.getHospitals()
        .subscribe(
            (data)=>{
                let arr = data.json()
                this.hospitals = arr.filter(
                    (h) => h.isVerified ==true
                )
                this.n_hospitals = arr.filter(
                    (h) => h.isVerified ==false
                )
                console.log(this.hospitals)
            },
            (err)=>{
                console.log(err)
            }
        )



    }
    

}

