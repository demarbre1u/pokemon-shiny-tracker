import { Component, ElementRef, ViewChild } from '@angular/core';
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

  // Binds to the searchBar element in the HTML
  @ViewChild('searchBar')
  searchBar: ElementRef;

  // The list of hunts of the user
  huntsList = [];
  // The list of finished hunts
  finishedHuntList = [];
  // The list of filtered finished hunts
  filteredFinishedHuntList = [];
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

      // Whenever the finished hunts list is updated, update the filtered list as well 
      if(this.searchBar) {
        this.filterFinisehedHunts(this.searchBar.nativeElement.value);
      } else {
        this.filterFinisehedHunts('');
      }
    });

    // Loads the list of hunts
    this.hunt.loadHuntList();

    this.filteredFinishedHuntList = this.finishedHuntList;
  }

  // Sets the current hunt selected by the player
  setCurrentHunt(uid) {    
    this.hunt.setCurrentHunt(uid);
  }

  // Deletes a hunt from the hunts list
  deleteHunt(uid) {
    this.hunt.deleteHunt(uid);
  }

  // Filter the list of finished hunts containing a search term
  filterFinisehedHunts(searchTerm) {
    const lcSearchTerm = searchTerm.toLowerCase();
    
    let result;
    switch(lcSearchTerm) {
      case '*masuda':
        result = this.finishedHuntList.filter(hunt => hunt.options.masuda);
        break;
      case '*charm':
        result = this.finishedHuntList.filter(hunt => hunt.options.charm);
        break;
      default:
        result = this.finishedHuntList.filter(hunt => hunt.name.toLowerCase().includes(lcSearchTerm));
        break;
    }

    this.filteredFinishedHuntList = result;
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
