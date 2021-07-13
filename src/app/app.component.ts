import { Component, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SimpleModalService } from 'ngx-simple-modal';
import { NewHuntComponent } from './modal/new-hunt/new-hunt.component';
import { HuntService } from './service/hunt/hunt.service';

export enum KEY_CODE {
  PLUS_SIGN_1 = 187,
  PLUS_SIGN_2 = 107,
  MINUS_SIGN_1 = 189,
  MINUS_SIGN_2 = 109
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pokemon-shiny-tracker';

  huntForm = new FormGroup({
    huntName: new FormControl()
  });

  private huntsList = [];
  private currentHunt: any = null;

  private baseOdd = 0;
  private rollNumber = 1;
  private shinyProbability = '';

  constructor(private hunt: HuntService, private simpleModalService: SimpleModalService) {
    this.hunt.huntsChanged$.subscribe(hunts => {
      this.huntsList = hunts;
    });

    this.hunt.currentHuntChanged$.subscribe(hunt => {
      this.currentHunt = hunt;

      if(! hunt) {
        return;
      }

      this.baseOdd = this.getBaseOdds(hunt.options.gen);
      this.shinyProbability = this.calculateShinyProbability().toFixed(2);
    });

    this.hunt.loadHuntList();
  }

  // Listens to Keyboard events to increment / decrement counter if either the '+' or '-' keys are pressed
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.PLUS_SIGN_1 || event.keyCode === KEY_CODE.PLUS_SIGN_2) {
      this.incrementCounter();
    }

    if (event.keyCode === KEY_CODE.MINUS_SIGN_1 || event.keyCode === KEY_CODE.MINUS_SIGN_2) {
      this.decrementCounter();
    }
  }

  // Calculates the probability of encountering a shiny
  calculateShinyProbability() {
    if(!this.currentHunt || this.currentHunt.counter === 0) {
      return 0;
    }
    
    const p = this.getRollNumbers() / this.baseOdd;
    const n = this.currentHunt.counter;
    const probability = 1 - Math.pow(1 - p, n);

    return probability * 100;
  }

  getBaseOdds(generation) {
    let baseOdd = 0;
    switch(generation) {
      case '1':
        baseOdd = 8192;
        break;
      case '2':
        baseOdd = 4096;
        break;
      default:
        baseOdd = 8192;
        break;
    }

    return baseOdd;
  }

  // Returns the number of shiny rolls
  getRollNumbers() {
    let rollNumbers = this.rollNumber;

    if(this.currentHunt.options.masuda) {
      rollNumbers += 5;
    }

    if(this.currentHunt.options.charm) {
      rollNumbers += 2;
    }

    return rollNumbers;
  }

  // Sets the current hunt selected by the player
  setCurrentHunt(uid) {    
    this.hunt.setCurrentHunt(uid);
  }

  // Increments the counter of the current hunt
  incrementCounter() {
    const currentId = this.currentHunt.id;
    this.hunt.incrementHuntCounter(currentId);
  }

  // Decrements the counter of the current hunt
  decrementCounter() {
    const currentId = this.currentHunt.id;
    this.hunt.decrementHuntCounter(currentId);
  }

  // Sets the counter of the current hunt to a given number
  setCounter(value) {
    const currentId = this.currentHunt.id;
    this.hunt.setHuntCounter(currentId, value);
  }

  // Deletes a hunt from the hunts list
  deleteHunt(uid) {
    this.hunt.deleteHunt(uid);
  }

  showNewHuntModal() {
    this.simpleModalService.addModal(NewHuntComponent, {
      title: 'New hunt',
    })
    .subscribe((huntData) => {
      if(huntData) {
        this.hunt.addHunt(huntData);
      }
    });
  }
}
