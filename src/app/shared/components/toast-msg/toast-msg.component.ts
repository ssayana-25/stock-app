import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { 
  IonToast
} from '@ionic/angular/standalone';
import { Observable, of } from 'rxjs';
import { StockDetails } from 'src/app/core/models/stock.model';
import { StockService } from 'src/app/core/services/stock.service';

@Component({
  selector: 'app-toast-msg',
  templateUrl: './toast-msg.component.html',
  styleUrls: ['./toast-msg.component.scss'],
  imports: [
     IonToast, CommonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastMsgComponent  implements OnInit {
  isToastMsgOpen$ : Observable<any> = of(true);
  selectedStock$: Observable<StockDetails | null> = of(null);
  constructor(
    private stockService : StockService
  ) {

   }

  ngOnInit() {
    this.isToastMsgOpen$ = this.stockService.showBuyToastmsg$;
    this.selectedStock$ = this.stockService.selectedStock$;
  }

}
