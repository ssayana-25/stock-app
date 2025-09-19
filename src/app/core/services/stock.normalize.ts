import { Details, Pricing, StockDetails } from "../models/stock.model";

export class StockNormalize {
  
  /**
   * Normalize pricing and details into StockDetails[]
   * @param pricing Array of Pricing objects
   * @param details Array of Details objects
   * @returns Array of normalized StockDetails
   */
  static normalize(pricing: Pricing[], details: Details[]): StockDetails[] {
    return details.map((d) => {
      const stock = pricing.find((p) => p.symbol === d.symbol);
      const change =
        stock?.open != null && stock?.ask != null
          ? ((stock.ask - stock.open) / stock.open) * 100
          : null;

      return {
        id: d.symbol,
        symbol: d.symbol,
        type: d.type,
        fullName: d.fullName,
        logo: d.logo,
        change,
        ask: stock?.ask ?? null,
        marketCap: d.marketCap,
        volume: d.volume ?? null,
        low: stock?.low ?? null,
        high: stock?.high ?? null,
      } as StockDetails;
    });
  }
}
