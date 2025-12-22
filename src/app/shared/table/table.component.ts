import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent <T extends Record<string, unknown>>{
  @Input() columns: { key: keyof T & string, label: string }[] = [];  
  @Input() data: T[] = [];  
  @Input() actions: { label: string, icon: string, action: string, class: string }[] = []; 
  @Output() actionClick = new EventEmitter<{ action: string, row: T }>();

  onActionClick(action: string, row: T, event: Event) {
    event.stopPropagation(); 
    this.actionClick.emit({ action, row });
  }

  trackByFn(index: number, item: T) {
    return item['id']??index;
  }
}
