export interface Details {
    id: string;
    symbol: string;
    type: 'stock' | 'etf';
    fullName: string;
    logo: string;
    volume: number;
    marketCap: number;
  }
  
  export interface Pricing {
    id: string;
    symbol: string;
    open: number;
    close: number;
    ask: number;
    high: number;
    low: number;
  }

  export interface StockDetails extends Details{
    change: number;
    ask: number;
    low: number;
    high: number;
  }

  export interface UserStockDetails{
    symbol: string;
    shares: number;
    ask: number;
    stockEquity: number;
    change: number;
  }