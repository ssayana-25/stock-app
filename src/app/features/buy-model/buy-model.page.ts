import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GestureController, Gesture } from '@ionic/angular';
import { IonInput, IonItem, IonLabel, IonToolbar, IonTitle, IonHeader } from '@ionic/angular/standalone';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { StockDetails, UserStockDetails } from 'src/app/core/models/stock.model';
import { Subject } from 'rxjs';

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
    CurrencyPipe
  ]
})
export class BuyModelPage implements AfterViewInit , OnDestroy{
  @Input() stock?: StockDetails;
  @Output() dismiss = new EventEmitter<UserStockDetails>();

  @ViewChild('thumb', { read: ElementRef }) thumb!: ElementRef;
  @ViewChild('track', { read: ElementRef }) track!: ElementRef;

  buyForm: FormGroup;
  total: number = 0;
  private gesture?: Gesture;
  unsubscribe$ = new Subject<void>();

  constructor(private fb: FormBuilder, private gestureCtrl: GestureController) {
    this.buyForm = this.fb.group({
      shares: [null, [Validators.required, Validators.min(1)]],
    });
  }

  get isFormValid(): boolean {
    return this.buyForm.valid;
  }

  ngOnInit() {
    if (!this.stock) return;
    console.log(this.stock);
    this.buyForm.valueChanges.subscribe(val => {
      const quantity = val.shares || 0;
      this.total = this.stock?.ask ? quantity * this.stock.ask : 0;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.initGesture(), 50);
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
        const trackWidth = this.track.nativeElement.offsetWidth;
        const thumbWidth = this.thumb.nativeElement.offsetWidth;

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
        stockEquity: this.total,
        change: this.stock.change
      };
      this.buyForm.reset();
      this.dismiss.emit(usersStockDetails);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
