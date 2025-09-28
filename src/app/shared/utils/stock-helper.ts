import { StockDetails, UserStockDetails } from 'src/app/core/models/stock.model';

export function getTopStocksBy(stocks: StockDetails[], n: number, key: keyof StockDetails): StockDetails[] {
    let top: StockDetails[] = [];
  
    for (const stock of stocks) {
      if (top.length < n) {
        top.push(stock);
        top.sort((a, b) => (a[key] as number) - (b[key] as number));
      } else if ((stock[key] as number) > (top[0][key] as number)) {
        top[0] = stock;
        top.sort((a, b) => (a[key] as number) - (b[key] as number));
      }
    }
    return [...top].sort((a, b) => (b[key] as number) - (a[key] as number));
}

export function trackById(index: number, stock: StockDetails | UserStockDetails) {
  return stock.symbol;
}