import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  IonContent,
  IonSearchbar,
  IonList,
  IonLabel,
  IonItem
} from '@ionic/angular/standalone';
import { map, Subject, takeUntil } from 'rxjs';
import { StockDetails } from 'src/app/core/models/stock.model';
import { StockService } from 'src/app/core/services/stock.service';
import { StockStorageService } from 'src/app/core/services/storage.service';
import { InstrumentPage } from 'src/app/shared/components/instrument/instrument.page';
import { StockCardPage } from 'src/app/shared/components/stock-card/stock-card.page';
import { getTopStocksBy } from 'src/app/shared/utils/stock-helper';

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
    InstrumentPage
  ]
})
export class DiscoverPage implements OnInit, OnDestroy {
  stocks: StockDetails[] = [];
  filteredStocks: StockDetails[] = [];
  searchTerm = '';
  rvStockList: StockDetails[] = [];
  topVolumeStocks: StockDetails[] = [];
  unsubscribe$ = new Subject<void>();

  constructor(
    private stockService: StockService,
    private recentlyViewed: StockStorageService
  ) {}

  ngOnInit() {
    this.stockService
      .getStockDetails()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.stocks = data;
        this.filteredStocks = [];
        this.loadRVStockList();

        // Displaying top 3 volume stocks assuming it is based on volume
        this.topVolumeStocks = getTopStocksBy(data, 3, 'volume');
      });
  }

  async loadRVStockList() {
    this.rvStockList = await this.recentlyViewed.getRecentSearch();
  }

  onClearInput() {
    this.filteredStocks = [];
  }

  filterList(event: any) {
    const query = event?.target?.value?.toLowerCase() ?? '';
    if (!query) return;

    this.filteredStocks = this.stocks.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(query) ||
        stock.fullName.toLowerCase().includes(query)
    );
  }

  // Add to recently viewed on click of a stock from search results
  async selectRVStock(stock: StockDetails) {
    await this.recentlyViewed.addRecentSearch(stock);
    this.loadRVStockList();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
