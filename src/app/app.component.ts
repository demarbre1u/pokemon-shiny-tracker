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

  constructor(private hunt: HuntService)
  {
    this.hunt.huntsChanged$.subscribe(hunts => {
      this.huntsList = hunts
    })

    this.hunt.currentHuntChanged$.subscribe(hunt => {
      this.currentHunt = hunt
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

  onSubmit()
  {
    let huntName = this.huntForm.value.huntName

    this.hunt.addHunt(huntName)

    this.huntForm.reset()
  }

  setCurrentHunt(uid)
  {    
    this.hunt.setCurrentHunt(uid)
  }

  incrementCounter()
  {
    let currentId = this.currentHunt.id
    this.hunt.incrementHuntCounter(currentId)
  }

  setCounter(value)
  {
    let currentId = this.currentHunt.id

    this.hunt.setHuntCounter(currentId, value)
  }

  decrementCounter()
  {
    let currentId = this.currentHunt.id
    this.hunt.decrementHuntCounter(currentId)
  }

  deleteHunt(uid)
  {
    this.hunt.deleteHunt(uid)
  }
}
