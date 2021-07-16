import { Component, HostListener, Input, OnInit } from '@angular/core';
import { HuntService } from 'src/app/service/hunt/hunt.service';

// Enum containing the key codes for the '+' et '-' keys
export enum KEY_CODE {
  PLUS_SIGN_1 = 187,
  PLUS_SIGN_2 = 107,
  MINUS_SIGN_1 = 189,
  MINUS_SIGN_2 = 109
};

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.css']
})
export class PokemonComponent implements OnInit {
  // The hunt data to display
  @Input('currentHunt')
  currentHunt: any;

  // Whether the hunt is finished or not
  @Input('finished')
  finished: boolean = false;

  constructor(private hunt: HuntService) { }

  ngOnInit() {}

  // Listens to Keyboard events to increment / decrement counter if either the '+' or '-' key are pressed
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    // If the hunt is finished, no need to listen to those events
    if(this.finished) {
      return;
    }

    if (event.keyCode === KEY_CODE.PLUS_SIGN_1 || event.keyCode === KEY_CODE.PLUS_SIGN_2) {
      this.incrementCounter();
    }

    if (event.keyCode === KEY_CODE.MINUS_SIGN_1 || event.keyCode === KEY_CODE.MINUS_SIGN_2) {
      this.decrementCounter();
    }
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

  // Moves the current hunt to the finished hunts list
  foundShiny() {
    const currentId = this.currentHunt.id;
    this.hunt.foundShiny(currentId);
  }

  // Deletes a finished hunt from the finished hunts list
  deleteFinishedHunt() {
    const currentId = this.currentHunt.id;
    this.hunt.deleteFinishedHunt(currentId);
  }
}
