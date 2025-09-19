import { Injectable } from "@angular/core";
import { combineLatest, map, Observable } from "rxjs";
import { Details, Pricing, StockDetails } from "../models/stock.model";
import { HttpClient } from "@angular/common/http";
import { StockNormalize } from "./stock.normalize";

@Injectable({providedIn: 'root'})
export class StockService{
    details$!: Observable<Details[]>; 
    pricing$!: Observable<Pricing[]>;
    stockDetails$!:Observable<StockDetails[]>
  
    constructor(private http: HttpClient){
        this.pricing$ = this.getPricing();
        this.details$ = this.getDetails();
    }
    getDetails(): Observable<Details[]> {
        return this.http.get<Details[]>('/assets/mock/details.json');
    }
    getPricing(): Observable<Pricing[]> {
        return this.http.get<Pricing[]>('/assets/mock/pricing.json');
    }
 
    getStockDetails(): Observable<StockDetails[]>{
        this.stockDetails$ = combineLatest([this.pricing$, this.details$]).pipe(
            map(([pricing, details]) => StockNormalize.normalize(pricing, details))
          );
        return this.stockDetails$
    }
}