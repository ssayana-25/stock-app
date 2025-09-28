import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage-angular';
import { StockDetails, UserStockDetails } from "../models/stock.model";
import { BehaviorSubject, map, Observable, reduce } from "rxjs";

@Injectable({ providedIn: 'root' })
export class StockStorageService {
  private stockStorageInstance: Storage | null = null;
  private RECENTLY_VIEW_STORAGE_KEY = 'recently_viewed';
  private USER_STOCK_LIST_STORAGE_KEY = 'user_stock_list';

  private recentlyViewedSubject = new BehaviorSubject<StockDetails[]>([]);
  recentlyViewed$ = this.recentlyViewedSubject.asObservable();
  private userStockListSubject = new BehaviorSubject<UserStockDetails[]>([]);
  userStockList$ = this.userStockListSubject.asObservable();
  totalEquity$ = this.userStockList$.pipe(
    map(stocks => stocks.reduce((acc, stock) =>  acc + stock.stockEquity, 0 ))
  )

  constructor() {
    this.initStockStorage();
  }

  // Initialize storage instance
  async initStockStorage(): Promise<void> {
    this.stockStorageInstance = new Storage();
    await this.stockStorageInstance.create();
    const rw = await this.stockStorageInstance?.get(this.RECENTLY_VIEW_STORAGE_KEY) || [];
    this.recentlyViewedSubject.next(rw);
    const usl = await this.stockStorageInstance?.get(this.USER_STOCK_LIST_STORAGE_KEY) || [];
    this.userStockListSubject.next(usl);
  }

  // Add a stock to recently viewed
  async addRecentSearch(rwStock: StockDetails): Promise<void> {
    let recentlyViewed = this.recentlyViewedSubject.value;
    recentlyViewed = recentlyViewed.filter((stock) => stock?.symbol !== rwStock.symbol);
    recentlyViewed.unshift(rwStock);
    recentlyViewed = recentlyViewed.slice(0, 5); // limit list to 5
    await this.stockStorageInstance?.set(this.RECENTLY_VIEW_STORAGE_KEY, recentlyViewed);
    this.recentlyViewedSubject.next(recentlyViewed);
  }

  // Buy stock
  async buyStock(stockAdded: UserStockDetails): Promise<void> {
    let stockList = this.userStockListSubject.value;
    stockList = stockList.filter((stock) => stock?.symbol !== stockAdded.symbol);
    stockList.unshift(stockAdded);
    await this.stockStorageInstance?.set(this.USER_STOCK_LIST_STORAGE_KEY, stockList);
    this.userStockListSubject.next(stockList);
  
  }
  
}
