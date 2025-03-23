import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JobSeeker } from '../../core/models/JobSeeker.model';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  @Input() columns: { key: string, label: string }[] = [];  // Table Headers
  @Input() data: any[] = [];  // Table Data
  @Input() actions: { label: string, icon: string, action: string, class: string }[] = []; // Actions
  @Output() actionClick = new EventEmitter<{ action: string, row: JobSeeker }>();

  onActionClick(action: string, row: JobSeeker, event: Event) {
    event.stopPropagation(); 
    this.actionClick.emit({ action, row });
  }

  trackByFn(index: number, item: any) {
    return item.id || index;
  }
}
