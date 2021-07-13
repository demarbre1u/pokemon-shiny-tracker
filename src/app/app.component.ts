import { Component, HostListener } from '@angular/core';
import { SimpleModalService } from 'ngx-simple-modal';
import { NewHuntComponent } from './modal/new-hunt/new-hunt.component';
import { HuntService } from './service/hunt/hunt.service';

// Enum containing the key codes for the '+' et '-' keys
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
  // The title of the app
  title = 'pokemon-shiny-tracker';

  // The list of hunts of the user
  private huntsList = [];
  // The current hunt selected by the user
  private currentHunt: any = null;

  // The base odd to find a shiny
  private baseOdd = 0;
  // The number of roll per encounter
  private rollNumber = 1;
  // The probability to have found one shiny
  private shinyProbability = '';

  constructor(private hunt: HuntService, private simpleModalService: SimpleModalService) {
    // Updates the list of hunts whenever it is updated
    this.hunt.huntsChanged$.subscribe(hunts => {
      this.huntsList = hunts;
    });

    // Updates the current hunt whenever is is updated
    this.hunt.currentHuntChanged$.subscribe(hunt => {
      this.currentHunt = hunt;

      if(! hunt) {
        return;
      }

      // Calculates the base odd and the shiny probability
      this.baseOdd = this.getBaseOdds(hunt.options.gen);
      this.shinyProbability = this.calculateShinyProbability().toFixed(2);
    });

    // Loads the list of hunts
    this.hunt.loadHuntList();
  }

  // Listens to Keyboard events to increment / decrement counter if either the '+' or '-' key are pressed
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
    // No need to calculate if the counter is 0
    if(!this.currentHunt || this.currentHunt.counter === 0) {
      return 0;
    }
    
    // Calculates the probability to have found 1 shiny
    const p = this.getRollNumbers() / this.baseOdd;
    const n = this.currentHunt.counter;
    const probability = 1 - Math.pow(1 - p, n);

    // Transforms the probability to a percentage
    return probability * 100;
  }

  // Returns the base odd to find a shiny, depending on the selected generation
  getBaseOdds(generation) {
    let baseOdd = 8192;
    switch(generation) {
      case '1':
        baseOdd = 8192;
        break;
      case '2':
        baseOdd = 4096;
        break;
    }

    return baseOdd;
  }

  // Returns the number of shiny rolls depending on the selected options
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

  // Shows a modal to create a new hunt
  showNewHuntModal() {
    this.simpleModalService.addModal(NewHuntComponent, {
      title: 'New hunt',
    })
    .subscribe((huntData) => {
      // When the user closes the modal, if 'OK' was clicked, we add the hunt to the list of hunts
      if(huntData) {
        this.hunt.addHunt(huntData);
      }
    });
  }
}
