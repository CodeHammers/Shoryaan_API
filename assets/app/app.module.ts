import { NgModule }       from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { AppComponent }   from './app.component';


import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';




const appRoutes: Routes = [  

    { path: '', component: AppComponent },

  ];
  


@NgModule({
    declarations: [AppComponent],
    imports:      [
        //RouterModule.forRoot(appRoutes),
        BrowserModule,
        HttpModule
    ],
    bootstrap:    [AppComponent],
})
export class AppModule {}