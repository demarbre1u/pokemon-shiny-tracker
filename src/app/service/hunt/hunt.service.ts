import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as uuid from 'uuid';

// List of options available for a hunt
export enum OPTION_CODE {
  MASUDA =  1,
  CHARM = 2
};

// List of methods available for a hunt
export enum METHOD_CODE {
  RANDOM_ENCOUNTER = 1, 
  SOFT_RESET = 2,
  EGGS = 3,
  RUN_AWAY = 4
};

@Injectable({
  providedIn: 'root'
})
export class HuntService {
  // List of hunts created by the user
  private huntsList = [];
  // Subject / Observer to notify the components of the app when list of hunts has changed
  private huntsChangedSource = new Subject<any>();
  huntsChanged$ = this.huntsChangedSource.asObservable();

  // List of finished hunts
  private finishedHuntList = [];
  // Subject / Observer to notify the components of the app when list of finished hunts has changed
  private finishedHuntsChangedSource = new Subject<any>();
  finishedHuntsChanged$ = this.finishedHuntsChangedSource.asObservable();

  // The current list selected by the user
  private currentHunt = {};
  // Subject / Observer to notify the components of the app when the current hunt has changed
  private currentHuntChangedSource = new Subject<any>();
  currentHuntChanged$ = this.currentHuntChangedSource.asObservable();

  constructor() {}

  // Loads the list of hunts
  loadHuntList() {
    this.huntsList = this.getHuntList();
    this.saveHuntList();

    this.finishedHuntList = this.getFinishedHuntList();
    this.saveFinishedHuntList();
  }

  // Adds a new hunt to the hunt list
  addHunt(huntData) {
    // While the generated ID is not truly unique, we genrate a new one
    let uid = uuid.v4();
    while(this.huntsList.filter(e => e.id === uid).length) {
      uid = uuid.v4();
    }

    // Sets the text that will be displayed besides the counter
    let method = '';
    switch(Number.parseInt(huntData.huntMethod)) {
      case METHOD_CODE.RANDOM_ENCOUNTER:
        method = 'REs';
        break;
      case METHOD_CODE.SOFT_RESET:
        method = 'SRs';
        break;
      case METHOD_CODE.EGGS:
        method = 'Eggs';
        break;
      case METHOD_CODE.RUN_AWAY:
        method = 'RAs';
        break;
    }

    // Sets the starting value of the counter
    const counter = huntData.huntCounter ? Number.parseInt(huntData.huntCounter) : 0;
    const increment = huntData.huntIncrement ? Number.parseInt(huntData.huntIncrement) : 1;

    const newHunt = {
      id: uid,
      name: huntData.huntPokemon, 
      img: huntData.huntPokemonImg,
      method: method,
      counter: counter, 
      increment: increment, 
      shinyProbability: '0',

      options: {
        masuda: huntData.huntMasuda,
        charm: huntData.huntShinyCharm,
        gen: huntData.huntGen
      }
    };

    // Re-calculate the siny probability
    newHunt.shinyProbability = this.calculateShinyProbability(newHunt).toFixed(2); 

    // Adds the new hunt to the list of hunts
    this.huntsList.push(newHunt);
    this.saveHuntList()
  }

  // Deletes a hunt from the hunt list
  deleteHunt(uid) {
    this.huntsList = this.huntsList.filter(e => e.id !== uid);
    this.saveHuntList();

    // If the deleted hunt is the current one, we set the current one to null to avoid any issue
    if(this.currentHunt['id'] === uid) {
      this.currentHunt = null;
      this.currentHuntChangedSource.next(this.currentHunt);
    }
  }

  // Sets the current hunt, selected by the player
  setCurrentHunt(uid) {
    const hunt = this.huntsList.filter(e => e.id === uid)[0];

    this.currentHunt = hunt;
    this.currentHuntChangedSource.next(this.currentHunt);
  }

  // Change the current hunt when its data has been updated
  updateCurrentHunt(uid) {
    this.currentHunt = this.huntsList.filter(e => e.id === uid)[0];

    // Re-calculate the siny probability
    this.currentHunt['shinyProbability'] = this.calculateShinyProbability(this.currentHunt).toFixed(2); 

    this.saveHuntList();
    this.currentHuntChangedSource.next(this.currentHunt);
  }

  // Calculates the probability of encountering a shiny
  calculateShinyProbability(currentHunt) {
    const baseOdd = this.getBaseOdds(currentHunt.options.gen);

    // No need to calculate if the counter is 0
    if(! currentHunt || currentHunt.counter === 0) {
      return 0;
    }
    
    // Calculates the probability to have found 1 shiny
    const p = this.getRollNumbers(currentHunt) / baseOdd;
    const n = currentHunt.counter;
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
  getRollNumbers(currentHunt) {
    let rollNumbers = 1;

    if(currentHunt.options.masuda) {
      rollNumbers += 5;
    }

    if(currentHunt.options.charm) {
      rollNumbers += 2;
    }

    return rollNumbers;
  }

  // Increments the counter of the current hunt
  incrementHuntCounter(uid) {
    this.huntsList.map(e => {
      if(e.id === uid) {
        e.counter += e.increment;
      }
    });

    this.updateCurrentHunt(uid);
  }

  // Decrements the counter of the current hunt
  decrementHuntCounter(uid) {
    this.huntsList.map(e => {
      if(e.id === uid) {
        e.counter -= e.increment;

        // The counter can't go bellow 0        
        if(e.counter < 0) {
          e.counter = 0;
        }
      }
    });

    this.updateCurrentHunt(uid);
  }

  // Sets the counter of the current hunt to a given value
  setHuntCounter(uid, value) {
    this.huntsList.map(e => {
      if(e.id === uid) {
        e.counter = value;
      }
    });

    this.updateCurrentHunt(uid);
  }

  foundShiny(uid) {
    const finishedHunt = this.huntsList.filter(hunt => hunt.id === uid)[0];
    const remainingHunts = this.huntsList.filter(hunt => hunt.id !== uid);

    this.finishedHuntList.push(finishedHunt);
    this.huntsList = remainingHunts;

    if(this.currentHunt['id'] === uid) {
      this.currentHunt = null;

      this.currentHuntChangedSource.next(this.currentHunt);
    }

    this.saveHuntList();
    this.huntsChangedSource.next(this.huntsList);

    this.saveFinishedHuntList();
    this.finishedHuntsChangedSource.next(this.finishedHuntList);
  }

  // Saves the hunt list into the browser's local storage
  saveHuntList() {
    localStorage.setItem('huntsList', JSON.stringify(this.huntsList));
    this.huntsChangedSource.next(this.huntsList);
  }

  // Gets the hunt list from the browser's local storage
  getHuntList() {
    const huntList = JSON.parse(localStorage.getItem('huntsList'));

    return huntList ? huntList : [];
  }

  // Saves the hunt list into the browser's local storage
  saveFinishedHuntList() {
    localStorage.setItem('finishedHuntsList', JSON.stringify(this.finishedHuntList));
    this.finishedHuntsChangedSource.next(this.finishedHuntList);
  }

  // Gets the finished hunt list from the browser's local storage 
  getFinishedHuntList() {
    const finishedHuntList = JSON.parse(localStorage.getItem('finishedHuntsList'));

    return finishedHuntList ? finishedHuntList : [];
  }
}
