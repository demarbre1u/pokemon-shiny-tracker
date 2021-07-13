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
  // The title displayed in the modal
  title: string;

  // Form configs
  huntForm = new FormGroup({
    huntPokemon: new FormControl('', Validators.required),
    huntGen: new FormControl('', Validators.required),
    huntMethod: new FormControl('', Validators.required),
    huntMasuda: new FormControl({value: '', disabled: true}),
    huntShinyCharm: new FormControl(''),
    huntCounter: new FormControl('')
  });

  // FormControl of the Pokémon select
  pokemonFilterControl: FormControl = new FormControl();

  // List of every Pokémon available
  pokemonList = PokemonJson['default'].list;
  // Observable containing a filtered list of Pokémon
  filteredPokemonList: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor() { super(); }

  ngOnInit() {
    this.filteredPokemonList.next(this.pokemonList.slice());

    // Whenever the user types a keyword in the Pokémon select filter, a new list containing the filtered Pokémon is built
    this.pokemonFilterControl.valueChanges
    .subscribe(() => {
      this.filterPokemonList();
    });
  }

  // Builds a new list of Pokémon depending on the keyword the user typed
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

  // When the hunt method is changed, enable / disable some options
  methodChanged($event) {
    let masudaCheckbox = this.huntForm.get('huntMasuda');
        
    // Masuda method can't be used if the hunt isn't breeding
    if($event == 3) {
      masudaCheckbox.enable();
    } else {
      masudaCheckbox.disable();
    }
  }
  
  // When the user clicks on the 'OK' button of the modal
  confirm() {
    this.result = this.huntForm.value;
   
    // We add the image of the chosen Pokémon to the hunt data
    const chosenPokemon = (this.pokemonList.filter(pokemon => pokemon.name === this.huntForm.value.huntPokemon))[0];
    this.result['huntPokemonImg'] = chosenPokemon.img; 

    this.close();
  }
}
