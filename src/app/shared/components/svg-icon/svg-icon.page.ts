import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-svg-icon',
  template: `
  <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path *ngFor="let path of paths" [attr.d]="path"/>
  </svg>
`,
  styleUrls: ['./svg-icon.page.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class SvgIconPage {
  @Input() paths: string[] = [];
  @Input() size: number = 24;
  @Input() variant: 'active' | 'inactive' ='inactive';

  get fillColor(): string {
    const colors = {
      active: '#000',
      inactive: '#666'
    };
    return colors[this.variant];
  }
}
