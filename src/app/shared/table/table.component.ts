import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  @Input() columns: { key: string, label: string }[] = [];  
  @Input() data: any[] = [];  
  @Input() actions: { label: string, icon: string, action: string, class: string }[] = []; 
  @Output() actionClick = new EventEmitter<{ action: string, row: any }>();

  onActionClick(action: string, row: any, event: Event) {
    event.stopPropagation(); 
    this.actionClick.emit({ action, row });
  }

  trackByFn(index: number, item: any) {
    return item.id || index;
  }
}
