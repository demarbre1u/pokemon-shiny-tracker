import { Component } from '@angular/core';
import { SimpleModalService } from 'ngx-simple-modal';
import { NewHuntComponent } from './modal/new-hunt/new-hunt.component';
import { HuntService } from './service/hunt/hunt.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // The title of the app
  title = 'pokemon-shiny-tracker';

  // The list of hunts of the user
  huntsList = [];
  // The list of finished hunts
  finishedHuntList = [];
  // The current hunt selected by the user
  currentHunt: any = null;

  constructor(private hunt: HuntService, private simpleModalService: SimpleModalService) {
    // Updates the list of hunts whenever it is updated
    this.hunt.huntsChanged$.subscribe(hunts => {
      this.huntsList = hunts;
    });

    // Updates the current hunt whenever is is updated
    this.hunt.currentHuntChanged$.subscribe(hunt => {
      this.currentHunt = hunt;
    });

    this.hunt.finishedHuntsChanged$.subscribe(hunts => {
      this.finishedHuntList = hunts;
    });

    // Loads the list of hunts
    this.hunt.loadHuntList();
  }

  // Sets the current hunt selected by the player
  setCurrentHunt(uid) {    
    this.hunt.setCurrentHunt(uid);
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
