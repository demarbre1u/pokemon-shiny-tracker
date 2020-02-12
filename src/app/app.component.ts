import { Component, HostListener } from '@angular/core';

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

  private counter = 0

  // Listens to Keyboard events to increment / decrement counter if either the '+' or '-' keys are pressed
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event);

    if (event.keyCode === KEY_CODE.PLUS_SIGN_1 || event.keyCode === KEY_CODE.PLUS_SIGN_2) {
      this.increment();
    }

    if (event.keyCode === KEY_CODE.MINUS_SIGN_1 || event.keyCode === KEY_CODE.MINUS_SIGN_2) {
      this.decrement();
    }
  }

  increment()
  {
    this.counter++
  }

  decrement()
  {
    this.counter--

    // Counter can't go below 0
    this.counter = this.counter <= 0 ? 0 : this.counter
  }
}
