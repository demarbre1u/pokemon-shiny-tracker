import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import * as uuid from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class HuntService {

  OPTION_CODE = {
    MASUDA: 1, 
    CHAIN: 2, 
    CHARM: 3
  }

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
  addHunt(huntData)
  {
    // While the generated ID is not truly unique, we genrate a new one
    let uid = uuid.v4()
    while(this.huntsList.filter(e => e.id === uid).length)
    {
      uid = uuid.v4()
    }

    let newHunt = {
      id: uid,
      name: huntData.huntName, 
      counter: 0, 

      options: {
        masuda: huntData.huntMasuda, 
        chain: false, 
        charm: huntData.huntShinyCharm,
        gen: huntData.huntGgen
      }
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

  // Sets the counter of the current hunt to a given value
  setHuntCounter(uid, value)
  {
    this.huntsList.map(e => {
      if(e.id === uid)
        e.counter = value
    })

    this.currentHunt = this.huntsList.filter(e => e.id === uid)[0]

    this.saveHuntList()
    this.currentHuntChangedSource.next(this.currentHunt)
  }

  // Sets the name of the current hunt
  setHuntName(uid, newName)
  {
    this.huntsList.map(e => {
      if(e.id === uid)
        e.name = newName === '' ? e.name : newName
    })

    this.currentHunt = this.huntsList.filter(e => e.id === uid)[0]

    this.saveHuntList()
    this.currentHuntChangedSource.next(this.currentHunt)
  }

  // Sets the value of the option corresponding to the given option code
  setHuntOption(uid, value, code)
  {
    let option = ''
    switch(code) 
    {
      case this.OPTION_CODE.MASUDA:
        option = 'masuda'
        break
      case this.OPTION_CODE.CHAIN:
        option = 'chain'
        break
      case this.OPTION_CODE.CHARM:
        option = 'charm'
        break
      default: 
        // If we get here, the option doesn't exist
        return
    }

    this.huntsList.map(e => {
      if(e.id === uid)
        e.options[option] = value
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
