import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, Observable, of } from "rxjs";
import { Details, Pricing, StockDetails, UserStockDetails } from "../models/stock.model";
import { HttpClient } from "@angular/common/http";
import { StockNormalize } from "./stock.normalize";
import { getTopStocksBy } from "src/app/shared/utils/stock-helper";

@Injectable({providedIn: 'root'})
export class StockService{
    details$!: Observable<Details[]>; 
    pricing$!: Observable<Pricing[]>;
    stockDetails$!:Observable<StockDetails[]>

    private querySearchSubject = new BehaviorSubject<string>('');
    querySearch$= this.querySearchSubject.asObservable();
    filteredStock$: Observable<StockDetails[]> = of([])

    private selectedStockSubject = new BehaviorSubject<StockDetails | null>(null);
    selectedStock$ = this.selectedStockSubject.asObservable();
    private buyModalSubject = new BehaviorSubject<boolean>(false);
    isBuyModalOpen$ = this.buyModalSubject.asObservable();
    private buyToastMsgSubject = new BehaviorSubject<boolean>(false);
    showBuyToastmsg$ = this.buyToastMsgSubject.asObservable();

    constructor(private http: HttpClient){
        this.pricing$ = this.getPricing();
        this.details$ = this.getDetails();
        this.stockDetails$ = combineLatest([this.pricing$, this.details$]).pipe(
            map(([pricing, details]) => StockNormalize.normalize(pricing, details))
        );
    }
    getDetails(): Observable<Details[]> {
        return this.http.get<Details[]>('/assets/mock/details.json');
    }
    getPricing(): Observable<Pricing[]> {
        return this.http.get<Pricing[]>('/assets/mock/pricing.json');
    }

    trendingStocks():Observable<StockDetails[]>{
        return this.stockDetails$.pipe(
            map(data => getTopStocksBy(data, 10, 'marketCap'))
        )
    }
    topVolumeStocks(): Observable<StockDetails[]>{
        return this.stockDetails$.pipe(
            map(data => getTopStocksBy(data, 3, 'volume'))
        )
    }
 
    filteredStocks(): Observable<StockDetails[]> {
       return  combineLatest([
        this.stockDetails$,
        this.querySearch$.pipe(
            distinctUntilChanged()
        )
       ]).pipe(
        map(([stocks, search]) =>{
            const trimmed = search.trim().toLowerCase();
            if (!trimmed) return []; 
            return stocks.filter(
                  (stock) =>
                    stock.symbol.toLowerCase().includes(search) ||
                    stock.fullName.toLowerCase().includes(search)
                )
            })
       )
    }
    setQuery(query: string):void{
        this.querySearchSubject.next(query);
    }
    openBuyModal(stock: StockDetails):void{
        this.selectedStockSubject.next(stock);
        this.buyToastMsgSubject.next(false);
        this.buyModalSubject.next(true);
    }

    closeBuyModal(stockBought?: UserStockDetails){
        if(stockBought){
            this.buyToastMsgSubject.next(true);
        }
        this.buyModalSubject.next(false); 
    }
}