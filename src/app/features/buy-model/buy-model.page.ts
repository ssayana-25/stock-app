import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GestureController, Gesture } from '@ionic/angular';
import { IonInput, IonItem, IonLabel, IonToolbar, IonTitle, IonHeader, IonText, IonModal , IonButton, IonButtons, IonIcon} from '@ionic/angular/standalone';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { StockDetails, UserStockDetails } from 'src/app/core/models/stock.model';
import { map, Observable, of, startWith, Subject, takeUntil } from 'rxjs';
import { StockService } from 'src/app/core/services/stock.service';
import { StockStorageService } from 'src/app/core/services/storage.service';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';

@Component({
  selector: 'app-buy-model',
  templateUrl: './buy-model.page.html',
  styleUrls: ['./buy-model.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonLabel,
    IonItem,
    IonInput,
    IonText,
    CurrencyPipe,
    IonModal,
    IonButton, 
    IonButtons, 
    IonIcon
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuyModelPage implements  OnDestroy{
  stock: StockDetails | null = null;
  @ViewChild('thumb', { read: ElementRef }) thumb!: ElementRef;
  @ViewChild('track', { read: ElementRef }) track!: ElementRef;
  @ViewChild(IonModal) modal?: IonModal;

  buyForm: FormGroup;
  total$: Observable<number> = of(0);
  private gesture?: Gesture;
  unsubscribe$ = new Subject<void>();
  isModalOpen$: Observable<boolean> = of(false);

  constructor(
    private fb: FormBuilder, 
    private gestureCtrl: GestureController,
    private stockService: StockService,
    private stockStorage: StockStorageService
  ) {
    addIcons({ close });
    this.buyForm = this.fb.group({
      shares: [0, [Validators.required, Validators.min(1)]],
    });
  }

  get isFormValid(): boolean {
    return this.buyForm.valid;
  }

  ngOnInit() {
    this.isModalOpen$ = this.stockService.isBuyModalOpen$ 
    this.stockService.selectedStock$
    .pipe(
      takeUntil(this.unsubscribe$)
    )
    .subscribe(
      (data)=> this.stock = data
    );

    this.total$ = this.buyForm.valueChanges.pipe(
      startWith(this.buyForm.value),
      map(val => this.computeTotal(val.shares || 0))
    );
    
  }

  onModalPresented() {
    setTimeout(() => {
      try {
        this.initGesture();
      } catch (e) {
        console.error(e);
      }
    }, 0);
  }
  computeTotal(val: number):number{
    return this.stock?.ask ? val * this.stock.ask : 0;
  }

  validateNumber(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }

  initGesture() {
    let hasConfirmed = false;

    this.gesture = this.gestureCtrl.create({
      el: this.thumb.nativeElement,
      threshold: 0,
      gestureName: 'swipe-to-buy',

      onMove: ev => {
        if (!this.isFormValid) return;

        const trackWidth = this.track.nativeElement.offsetWidth;
        const thumbWidth = this.thumb.nativeElement.offsetWidth;
        let newX = ev.deltaX;
        if (newX < 0) newX = 0;
        if (newX > trackWidth - thumbWidth) newX = trackWidth - thumbWidth;

        this.thumb.nativeElement.style.transform = `translateX(${newX}px)`;

        // Confirm purchase if dragged to end
        if (newX >= trackWidth - thumbWidth && !hasConfirmed) {
          hasConfirmed = true;
          this.confirmBuy();
        }
      },

      onEnd: ev => {
        const trackWidth = this.track?.nativeElement.offsetWidth;
        const thumbWidth = this.thumb?.nativeElement.offsetWidth;

        if (ev.deltaX < trackWidth - thumbWidth) {
          this.resetThumb();
          hasConfirmed = false;
        }
      }
    });

    this.gesture.enable(true);
  }

  resetThumb() {
    this.thumb.nativeElement.style.transition = 'transform 0.3s ease';
    this.thumb.nativeElement.style.transform = 'translateX(0)';
    setTimeout(() => {
      this.thumb.nativeElement.style.transition = '';
    }, 300);
  }

  confirmBuy() {
    if (this.stock) {
      const usersStockDetails: UserStockDetails = {
        symbol: this.stock.symbol,
        shares: this.buyForm.value.shares,
        ask: this.stock.ask,
        stockEquity: this.computeTotal(this.buyForm.value.shares),
        change: this.stock.change
      };
      
      this.closeBuyModal(usersStockDetails);
    }
  }

  closeBuyModal(stock?: UserStockDetails) {
    this.buyForm.reset();
    if(stock){
      this.stockService.closeBuyModal(stock);
      this.stockStorage.buyStock(stock);
    }else{
      this.stockService.closeBuyModal();
    }
 
  }

  ngOnDestroy(): void {
    this.gesture?.destroy();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
