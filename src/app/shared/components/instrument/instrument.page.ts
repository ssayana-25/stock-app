import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonItem, IonLabel } from '@ionic/angular/standalone';
import { StockDetails, UserStockDetails } from 'src/app/core/models/stock.model';

@Component({
  selector: 'app-instrument',
  templateUrl: './instrument.page.html',
  styleUrls: ['./instrument.page.scss'],
  standalone: true,
  imports: [CommonModule, IonItem, IonLabel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstrumentPage implements OnInit {
  @Input() stock!: UserStockDetails | StockDetails;
  @Input() isUserStock: boolean = false;
  @Output() selected = new EventEmitter<StockDetails>();

  constructor() {}

  ngOnInit() {}

  stockShares(): number | undefined {
    if (this.isUserStock && 'shares' in this.stock) {
      return (this.stock as UserStockDetails).shares;
    }
    return undefined;
  }
  getFullName(): string | undefined {
    if (!this.isUserStock && 'fullName' in this.stock) {
      return (this.stock as StockDetails).fullName;
    }
    return undefined;
  }
  selectStock(){
    this.selected.emit(this.stock as StockDetails)
  }
}
