import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButton, IonToast, IonList, IonItem, IonLabel 
} from '@ionic/angular/standalone';
import { map, Observable, of, switchMap, timer } from 'rxjs';

import { StockDetails, UserStockDetails } from 'src/app/core/models/stock.model';
import { StockService } from 'src/app/core/services/stock.service';
import { StockCardPage } from 'src/app/shared/components/stock-card/stock-card.page';
import { BuyModelPage } from '../buy-model/buy-model.page';
import { StockStorageService } from 'src/app/core/services/storage.service';
import { InstrumentPage } from 'src/app/shared/components/instrument/instrument.page';
import { ToastMsgComponent } from 'src/app/shared/components/toast-msg/toast-msg.component';
import { NotificationService } from 'src/app/core/services/notification-service';
import { trackById } from 'src/app/shared/utils/stock-helper';
@Component({
  selector: 'app-invest',
  templateUrl: 'invest.page.html',
  styleUrls: ['invest.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, CommonModule, 
    StockCardPage, BuyModelPage, IonContent, IonToast, 
    IonList, InstrumentPage, IonItem, IonLabel, ToastMsgComponent, IonButton
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvestPage implements OnInit, OnDestroy {
  stock$: Observable<StockDetails[]> = of([]);
  selectedStock?: StockDetails;
  stocks: StockDetails[] = [];
  trendingStocks$: Observable<StockDetails[]> = of([]);
  userStocks$: Observable<UserStockDetails[]> = of([]);
  totalEquity$: Observable<number> = of(0);
  notificationsEnabled$: Observable<boolean>= of(false);
  trackById!: (index: number, stock: StockDetails | UserStockDetails) => string;

  constructor(
    private stockService: StockService,
    private userStockList: StockStorageService,
    private notificationService : NotificationService
  ) {}

  ngOnInit(): void {
    // fetch trending stocks
    this.trendingStocks$ =   timer(0, 5000).pipe(  
      switchMap(() => this.stockService.trendingStocks())
    )
    // fetch stocks bought and the equity on them
    this.userStocks$ = this.userStockList.userStockList$;
    this.totalEquity$ = this.userStockList.totalEquity$
    this.notificationsEnabled$ = this.notificationService.notificationsEnabled$
    this.trackById = trackById
  }
  
  enableAlerts(){
    this.notificationService.startAlerts();
  }
  openBuyModal(stock: StockDetails) {
    this.stockService.openBuyModal(stock);
  }

  ngOnDestroy(): void {
    this.notificationService.stopAlerts();
  }
}
