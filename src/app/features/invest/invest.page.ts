import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonModal, IonContent, 
  IonButton, IonToast, IonList, IonItem, IonLabel 
} from '@ionic/angular/standalone';
import { Observable, Subject } from 'rxjs';

import { StockDetails, UserStockDetails } from 'src/app/core/models/stock.model';
import { StockService } from 'src/app/core/services/stock.service';
import { StockCardPage } from 'src/app/shared/components/stock-card/stock-card.page';
import { BuyModelPage } from '../buy-model/buy-model.page';
import { getTopStocksBy } from 'src/app/shared/utils/stock-helper';
import { StockStorageService } from 'src/app/core/services/storage.service';
import { InstrumentPage } from 'src/app/shared/components/instrument/instrument.page';

@Component({
  selector: 'app-invest',
  templateUrl: 'invest.page.html',
  styleUrls: ['invest.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonModal, CommonModule, 
    StockCardPage, BuyModelPage, IonContent, IonToast, 
    IonList, InstrumentPage, IonItem, IonLabel
  ],
})
export class InvestPage implements OnInit {
  stock$!: Observable<StockDetails[]>;
  isModalOpen = false;
  isToastOpen = false;
  selectedStock?: StockDetails;
  stocks: StockDetails[] = [];
  trendingStocks: StockDetails[] = [];
  userStocks: UserStockDetails[] = [];
  totalEquity?: number;
  unsubscribe$ = new Subject<void>();

  constructor(
    private stockService: StockService,
    private userStockList: StockStorageService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Fetch stock details
    this.stockService.getStockDetails().subscribe(data => {
      this.stocks = data;

      // Get top 10 trending stocks (by market cap)
      this.trendingStocks = getTopStocksBy(data, 10, 'marketCap');
      this.getUserStockList();
    });
  }

  // Load user stock list from storage
  async getUserStockList() {
    this.userStocks = await this.userStockList.getUserStockList();
    console.log(this.userStocks);

    this.totalEquity = this.userStocks.reduce(
      (acc, stock) => acc + stock.stockEquity, 
      0
    );
  }

  // Buy stocks and update storage
  async buyStocks(stock: UserStockDetails) {
    await this.userStockList.buyStock(stock);
    this.getUserStockList();
  }

  openBuyModal(stock: StockDetails) {
    this.selectedStock = stock;
    this.isModalOpen = true;
  }
  trackById(index: number, stock: StockDetails | UserStockDetails) {
    return stock.symbol;
  }

  closeBuyModal(stock?: UserStockDetails) {
    this.isModalOpen = false;
    this.cd.markForCheck();

    if (stock) {
      this.isToastOpen = true;
      this.buyStocks(stock);
    }
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
