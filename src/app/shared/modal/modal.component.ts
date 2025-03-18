import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() isOpen: boolean = false;
  @Input() modalType: 'addCompany' | 'view' | 'delete' = 'view';
  @Output() closeModal = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<any>();

  companyName: string = '';
  companyEmail: string = '';
  companyWebsite: string = '';

  close() {
    this.closeModal.emit();
  }

  submit() {
    if (this.modalType === 'addCompany') {
      const newCompany = {
        name: this.companyName,
        email: this.companyEmail,
        website: this.companyWebsite,
      };
      this.confirm.emit(newCompany);
    }
  }
}