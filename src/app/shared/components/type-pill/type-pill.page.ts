import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonBadge} from '@ionic/angular/standalone';

@Component({
  selector: 'app-type-pill',
  templateUrl: './type-pill.page.html',
  styleUrls: ['./type-pill.page.scss'],
  standalone: true,
  imports: [IonBadge, CommonModule]
})
export class TypePillPage{
  @Input() type!: 'etf' | 'stock'

}
