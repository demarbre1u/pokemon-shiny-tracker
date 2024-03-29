import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SimpleModalModule } from 'ngx-simple-modal';
import { NewHuntComponent } from './modal/new-hunt/new-hunt.component';

import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav'; 
import { MatInputModule } from '@angular/material/input'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { PokemonComponent } from './components/pokemon/pokemon.component';

@NgModule({
  declarations: [
    AppComponent,
    NewHuntComponent,
    PokemonComponent
  ],
  imports: [
    BrowserModule, 
    BrowserAnimationsModule,
    ReactiveFormsModule, 
    SimpleModalModule, 
    MatSelectModule, 
    NgxMatSelectSearchModule, 
    MatSidenavModule,
    MatCheckboxModule,
    MatInputModule,
    MatTabsModule
  ],
  providers: [],
  entryComponents: [
    NewHuntComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
