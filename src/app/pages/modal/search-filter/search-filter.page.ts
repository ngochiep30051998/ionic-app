import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { MEAL, STATUS_FILTER } from 'src/app/constants/common';
import { ICategory, IFilter } from 'src/app/interfaces/common.interfaces';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.page.html',
  styleUrls: ['./search-filter.page.scss'],
})
export class SearchFilterPage implements OnInit, OnDestroy {

  public MEAL = MEAL;
  public STATUS_FILTER = STATUS_FILTER;
  @Input() filterParams: IFilter;
  public categories: ICategory[] = [];
  private catSub$: Subscription;
  constructor(
    private modalCtrl: ModalController,
    private firebaseService: FirebaseService
  ) {
    this.catSub$ = this.firebaseService.getCategories().subscribe((res: ICategory[]) => {
      this.categories = res;
      console.log(this.categories);
    });
  }

  ngOnInit() {
    console.log(this.filterParams)
  }

  closeModal() {
    this.modalCtrl.dismiss(this.filterParams);
  }
  ngOnDestroy() {
    if (this.catSub$) {
      this.catSub$.unsubscribe();
    }
  }

}
