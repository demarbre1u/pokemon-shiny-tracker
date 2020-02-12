import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import * as uuid from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class HuntService {

  private huntsList = []
  private huntsChangedSource = new Subject<any>()
  huntsChanged$ = this.huntsChangedSource.asObservable()

  private currentHunt = {}
  private currentHuntChangedSource = new Subject<any>()
  currentHuntChanged$ = this.currentHuntChangedSource.asObservable()

  constructor() { }

  loadHuntList()
  {
    this.huntsList = this.getHuntList()
    this.saveHuntList()
  }

  // Adds a new hunt to the hunt list
  addHunt(name)
  {
    // While the generated ID is not truly unique, we genrate a new one
    let uid = uuid.v4()
    while(this.huntsList.filter(e => e.id === uid).length)
    {
      uid = uuid.v4()
    }

    let newHunt = {
      id: uid,
      name: name, 
      counter: 0, 
    }

    this.huntsList.push(newHunt)

    this.saveHuntList()
  }

  // Deletes a hunt from the hunt list
  deleteHunt(uid)
  {
    this.huntsList = this.huntsList.filter(e => e.id !== uid)

    this.saveHuntList()

    // If the deleted hunt is the current one, we set the current one to null to avoid any issue
    if(this.currentHunt['id'] === uid)
    {
      this.currentHunt = null
      this.currentHuntChangedSource.next(this.currentHunt)
    }
  }

  // Sets the current hunt, selected by the player
  setCurrentHunt(uid)
  {
    let hunt = this.huntsList.filter(e => e.id === uid)[0]

    this.currentHunt = hunt

    this.currentHuntChangedSource.next(this.currentHunt)
  }

  // Increments the counter of the current hunt
  incrementHuntCounter(uid)
  {
    this.huntsList.map(e => {
      if(e.id === uid)
        e.counter++
    })

    this.currentHunt = this.huntsList.filter(e => e.id === uid)[0]

    this.saveHuntList()
    this.currentHuntChangedSource.next(this.currentHunt)
  }

  // Decrements the counter of the current hunt
  decrementHuntCounter(uid)
  {
    this.huntsList.map(e => {
      if(e.id === uid)
        e.counter = e.counter === 0 ? 0 : e.counter - 1
    })

    this.currentHunt = this.huntsList.filter(e => e.id === uid)[0]

    this.saveHuntList()
    this.currentHuntChangedSource.next(this.currentHunt)
  }

  // Saves the hunt list into the browser's local storage
  saveHuntList()
  {
    localStorage.setItem('huntsList', JSON.stringify(this.huntsList))

    this.huntsChangedSource.next(this.huntsList)
  }

  // Gets the hunt list from the  
  getHuntList()
  {
    let huntList = JSON.parse(localStorage.getItem('huntsList'))

    return huntList ? huntList : []
  }
}
