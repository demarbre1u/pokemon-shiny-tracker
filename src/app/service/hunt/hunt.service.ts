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

    const newHunt = {
      id: uid,
      name: huntData.huntPokemon, 
      img: huntData.huntPokemonImg,
      method: method,
      counter: counter, 

      options: {
        masuda: huntData.huntMasuda,
        charm: huntData.huntShinyCharm,
        gen: huntData.huntGen
      }
    };

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

    this.saveHuntList();
    this.currentHuntChangedSource.next(this.currentHunt);
  }

  // Increments the counter of the current hunt
  incrementHuntCounter(uid) {
    this.huntsList.map(e => {
      if(e.id === uid) {
        e.counter++;
      }
    });

    this.updateCurrentHunt(uid);
  }

  // Decrements the counter of the current hunt
  decrementHuntCounter(uid) {
    this.huntsList.map(e => {
      if(e.id === uid) {
        // The counter can't go bellow 0
        e.counter = e.counter === 0 ? 0 : e.counter - 1;
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
}
