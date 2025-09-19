import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage-angular';
import { StockDetails, UserStockDetails } from "../models/stock.model";

@Injectable({ providedIn: 'root' })
export class StockStorageService {
  private stockStorageInstance: Storage | null = null;
  private RECENTLY_VIEW_STORAGE_KEY = 'recently_viewed';
  private USER_STOCK_LIST_STORAGE_KEY = 'user_stock_list';
  constructor() {
    this.initStockStorage();
  }

  // Initialize storage instance
  async initStockStorage(): Promise<void> {
    this.stockStorageInstance = new Storage();
    await this.stockStorageInstance.create();
  }

  // Get recently viewed stocks
  async getRecentSearch(): Promise<StockDetails[]> {
    return (await this.stockStorageInstance?.get(this.RECENTLY_VIEW_STORAGE_KEY)) || [];
  }

  // Add a stock to recently viewed
  async addRecentSearch(rwStock: StockDetails): Promise<void> {
    let recentlyViewed = await this.getRecentSearch();
    recentlyViewed = recentlyViewed.filter((stock) => stock?.symbol !== rwStock.symbol);
    recentlyViewed.unshift(rwStock);
    recentlyViewed = recentlyViewed.slice(0, 5); // limit list to 5
    await this.stockStorageInstance?.set(this.RECENTLY_VIEW_STORAGE_KEY, recentlyViewed);
  }

  // get the list of stocks the user has bought
  async getUserStockList(): Promise<UserStockDetails[]> {
    return (await this.stockStorageInstance?.get(this.USER_STOCK_LIST_STORAGE_KEY)) || [];
  }

  // Buy stock
  async buyStock(stockAdded: UserStockDetails): Promise<void> {
    let stockList = await this.getUserStockList();
    stockList = stockList.filter((stock) => stock?.symbol !== stockAdded.symbol);
    stockList.unshift(stockAdded);
    await this.stockStorageInstance?.set(this.USER_STOCK_LIST_STORAGE_KEY, stockList);
  }
}
