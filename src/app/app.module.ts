import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SimpleModalModule } from 'ngx-simple-modal';
import { NewHuntComponent } from './modal/new-hunt/new-hunt.component';

import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [
    AppComponent,
    NewHuntComponent
  ],
  imports: [
    BrowserModule, 
    BrowserAnimationsModule,
    ReactiveFormsModule, 
    SimpleModalModule, 
    MatSelectModule, 
    NgxMatSelectSearchModule, 
    MatSidenavModule,
    MatCheckboxModule
  ],
  providers: [],
  entryComponents: [
    NewHuntComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
