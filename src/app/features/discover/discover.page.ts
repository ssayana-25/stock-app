import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import {
  IonContent,
  IonSearchbar,
  IonList,
  IonLabel,
  IonItem
} from '@ionic/angular/standalone';
import { Observable, of} from 'rxjs';
import { StockDetails, UserStockDetails } from 'src/app/core/models/stock.model';
import { StockService } from 'src/app/core/services/stock.service';
import { StockStorageService } from 'src/app/core/services/storage.service';
import { InstrumentPage } from 'src/app/shared/components/instrument/instrument.page';
import { StockCardPage } from 'src/app/shared/components/stock-card/stock-card.page';
import { BuyModelPage } from '../buy-model/buy-model.page';
import { ToastMsgComponent } from 'src/app/shared/components/toast-msg/toast-msg.component';
import { trackById } from 'src/app/shared/utils/stock-helper';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonSearchbar,
    IonList,
    IonLabel,
    IonItem,
    CommonModule,
    StockCardPage,
    InstrumentPage,
    BuyModelPage,
    ToastMsgComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscoverPage implements OnInit {
  stocks: StockDetails[] = [];
  filteredStock$: Observable<StockDetails[]> = of([]);
  searchTerm = '';
  rvStockList$: Observable<StockDetails[]> = of([]);
  topVolumeStocks$: Observable<StockDetails[]> = of([]);
  trackById!: (index: number, stock: StockDetails | UserStockDetails) => string;

  @ViewChild(IonSearchbar) serachBar!: IonSearchbar;
  
  constructor(
    private stockService: StockService,
    private recentlyViewed: StockStorageService
  ) {}

  ngOnInit() {
      this.topVolumeStocks$ = this.stockService.topVolumeStocks();
      this.rvStockList$ = this.recentlyViewed.recentlyViewed$
      this.filteredStock$ = this.stockService.filteredStocks();
      this.trackById = trackById;
  }

  onClearInput() {
    this.stockService.setQuery('');
    this.serachBar.value = '';
  }

  filterList(event: any) {
    const query = event?.target?.value?.toLowerCase() ?? '';
    if (!query) return;
      this.stockService.setQuery(query);
  }


  // Add to recently viewed on click of a stock from search results
  selectRVStock(stock: StockDetails) {
    this.openBuyModal(stock);
    this.recentlyViewed.addRecentSearch(stock);
  }

  openBuyModal(stock: StockDetails) {
    this.stockService.openBuyModal(stock);
  }

}
