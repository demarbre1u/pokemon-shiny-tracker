import { Component } from '@angular/core';
import { SimpleModalComponent } from "ngx-simple-modal";
import { FormControl, FormGroup, Validators } from '@angular/forms';

import * as PokemonJson from '../../../assets/data/pokemon.json';

export interface NewHuntModel {
  title:string;
}

@Component({
  selector: 'app-new-hunt',
  templateUrl: './new-hunt.component.html',
  styleUrls: ['./new-hunt.component.css']
})
export class NewHuntComponent extends SimpleModalComponent<NewHuntModel, boolean> implements NewHuntModel {
  title: string;

  huntForm = new FormGroup({
    huntName: new FormControl('', Validators.required),
    huntPokemon: new FormControl('', Validators.required),
    huntGen: new FormControl('', Validators.required),
    huntMethod: new FormControl('', Validators.required),
    huntMasuda: new FormControl({value: '', disabled: true}),
    huntShinyCharm: new FormControl('')
  })

  pokemonList = PokemonJson['default'].list
  
  constructor() { super(); }

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
    this.close();
  }
}
