import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SimpleModalModule } from 'ngx-simple-modal';
import { NewHuntComponent } from './modal/new-hunt/new-hunt.component';

@NgModule({
  declarations: [
    AppComponent,
    NewHuntComponent
  ],
  imports: [
    BrowserModule, 
    ReactiveFormsModule, 
    SimpleModalModule
  ],
  providers: [],
  entryComponents: [
    NewHuntComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
