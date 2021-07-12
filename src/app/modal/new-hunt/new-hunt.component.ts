import { Component, OnDestroy, OnInit } from '@angular/core';
import { SimpleModalComponent } from "ngx-simple-modal";
import { FormControl, FormGroup, Validators } from '@angular/forms';

import * as PokemonJson from '../../../assets/data/pokemon.json';
import { ReplaySubject } from 'rxjs';

export interface NewHuntModel {
  title:string;
}

@Component({
  selector: 'app-new-hunt',
  templateUrl: './new-hunt.component.html',
  styleUrls: ['./new-hunt.component.css']
})
export class NewHuntComponent extends SimpleModalComponent<NewHuntModel, boolean> implements NewHuntModel, OnInit {
  title: string;

  huntForm = new FormGroup({
    huntPokemon: new FormControl('', Validators.required),
    huntGen: new FormControl('', Validators.required),
    huntMethod: new FormControl('', Validators.required),
    huntMasuda: new FormControl({value: '', disabled: true}),
    huntShinyCharm: new FormControl('')
  })

  pokemonFilterControl: FormControl = new FormControl();

  pokemonList = PokemonJson['default'].list
  filteredPokemonList: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor() { super(); }

  ngOnInit() {
    this.filteredPokemonList.next(this.pokemonList.slice());

    this.pokemonFilterControl.valueChanges
    .subscribe(() => {
      this.filterPokemonList();
    });
  }

  private filterPokemonList() {
    if (!this.pokemonList) {
      return;
    }
  
    // Get the keyword typed by the user
    let search = this.pokemonFilterControl.value;
    if (!search) {
      this.filteredPokemonList.next(this.pokemonList.slice());
        return;
      } else {
        search = search.toLowerCase();
      }

    // Filter the pokémon list
    this.filteredPokemonList.next(
      this.pokemonList.filter(list => list.name.toLowerCase().indexOf(search) > -1)
    );
  }

  methodChanged($event) {
    let masudaCheckbox = this.huntForm.get('huntMasuda')
        
    if($event == 3) {
      masudaCheckbox.enable()
    } else {
      masudaCheckbox.disable()
    }
  }
  
  confirm() {
    this.result = this.huntForm.value;
   
    const chosenPokemon = (this.pokemonList.filter(pokemon => pokemon.name === this.huntForm.value.huntPokemon))[0];
    this.result['huntPokemonImg'] = chosenPokemon.img; 

    this.close();
  }
}
