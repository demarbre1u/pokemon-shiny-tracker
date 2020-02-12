import { Component, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HuntService } from './service/hunt/hunt.service';

export enum KEY_CODE {
  PLUS_SIGN_1 = 187,
  PLUS_SIGN_2 = 107,
  MINUS_SIGN_1 = 189,
  MINUS_SIGN_2 = 109
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pokemon-shiny-tracker';

  huntForm = new FormGroup({
    huntName: new FormControl()
  })

  private huntsList = []
  private currentHunt: any = null

  private baseOdd = 4096
  private rollNumber = 1
  private shinyProbability = ''

  constructor(private hunt: HuntService)
  {
    this.hunt.huntsChanged$.subscribe(hunts => {
      this.huntsList = hunts
    })

    this.hunt.currentHuntChanged$.subscribe(hunt => {
      this.currentHunt = hunt

      this.shinyProbability = this.calculateShinyProbability().toFixed(2)
    })

    this.hunt.loadHuntList()
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
  calculateShinyProbability()
  {
    if(!this.currentHunt || this.currentHunt.counter === 0) 
      return 0
    
    let p = this.getRollNumbers() / this.baseOdd
    let n = this.currentHunt.counter
    let probability = 1 - Math.pow(1 - p, n)

    return probability * 100
  }

  // Returns the number of shiny rolls
  getRollNumbers()
  {
    let rollNumbers = this.rollNumber

    if(this.currentHunt.options.masuda)
      rollNumbers += 5

    if(this.currentHunt.options.charm)
      rollNumbers += 2

    // Depending on the chain number, we add more rolls
    if(this.currentHunt.options.chain)
    {
      if(this.currentHunt.counter > 50)
        rollNumbers += 1 

      if(this.currentHunt.counter > 100)
        rollNumbers += 1 

      if(this.currentHunt.counter > 200)
        rollNumbers += 1 

      if(this.currentHunt.counter > 300)
        rollNumbers += 1 

      if(this.currentHunt.counter > 500)
        rollNumbers += 1 
    }

    return rollNumbers
  }

  // Adds a new hunt to the hunts list
  addHunt()
  {
    let huntName = this.huntForm.value.huntName

    this.hunt.addHunt(huntName)

    this.huntForm.reset()
  }

  // Sets the current hunt selected by the player
  setCurrentHunt(uid)
  {    
    this.hunt.setCurrentHunt(uid)
  }

  // Increments the counter of the current hunt
  incrementCounter()
  {
    let currentId = this.currentHunt.id
    this.hunt.incrementHuntCounter(currentId)
  }

  // Decrements the counter of the current hunt
  decrementCounter()
  {
    let currentId = this.currentHunt.id
    this.hunt.decrementHuntCounter(currentId)
  }

  // Sets the counter of the current hunt to a given number
  setCounter(value)
  {
    let currentId = this.currentHunt.id

    this.hunt.setHuntCounter(currentId, value)
  }

  // Sets the name of the current hunt
  setHuntName(element, uid, newName)
  {
    if(newName === '')
      element.value = this.currentHunt.name

    this.hunt.setHuntName(uid, newName)
  }

  // Deletes a hunt from the hunts list
  deleteHunt(uid)
  {
    this.hunt.deleteHunt(uid)
  }

  // Sets the value of the Masuda Method option on the current hunt
  setOptionMasuda(value)
  {
    let currentId = this.currentHunt.id

    this.hunt.setHuntOptionMasuda(currentId, value)
  }

  // Sets the value of the Chain Encouters option on the current hunt
  setOptionChain(value)
  {
    let currentId = this.currentHunt.id

    this.hunt.setHuntOptionChain(currentId, value)
  }

  // Sets the value of the Shiny Charm method on the current hunt
  setOptionCharm(value)
  {
    let currentId = this.currentHunt.id

    this.hunt.setHuntOptionCharm(currentId, value)
  }
}
