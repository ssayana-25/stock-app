import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonImg } from '@ionic/angular/standalone';
import { StockDetails } from 'src/app/core/models/stock.model';
import { TypePillPage } from '../type-pill/type-pill.page';

@Component({
  selector: 'app-stock-card',
  templateUrl: './stock-card.page.html',
  styleUrls: ['./stock-card.page.scss'],
  standalone: true,
  imports: [
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonImg,
    CommonModule,
    TypePillPage
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockCardPage {
  @Input() stock!: StockDetails;
  @Output() selected = new EventEmitter<StockDetails>();
  @Input() size: 'small' | 'medium' | 'large' = 'small';

  selectStock() {
    this.selected.emit(this.stock);
  }
  
  get price(): number {
    return this.stock?.volume > 0 ? this.stock.marketCap / this.stock.volume : 0;
  }

  get isSmall() { return this.size === 'small'; }
  get isMedium() { return this.size === 'medium'; }
  get isLarge() { return this.size === 'large'; }

}
