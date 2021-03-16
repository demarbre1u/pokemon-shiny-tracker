import { Component } from '@angular/core';
import { SimpleModalComponent } from "ngx-simple-modal";

export interface NewHuntModel {
  title:string;
}

@Component({
  selector: 'app-new-hunt',
  templateUrl: './new-hunt.component.html',
  styleUrls: ['./new-hunt.component.css']
})
export class NewHuntComponent extends SimpleModalComponent<NewHuntModel, boolean> implements NewHuntModel {
  title: string;

  constructor() { super(); }

  confirm() {
    // we set modal result as true on click on confirm button,
    // then we can get modal result from caller code
    this.result = true;
    this.close();
  }
}
