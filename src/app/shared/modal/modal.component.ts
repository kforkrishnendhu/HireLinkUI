import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CompanyProfile } from '../../core/models/CompanyProfile.model';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() title = '';
  @Input() isOpen = false;
  @Input() modalType: 'addCompany' | 'view' | 'delete' = 'view';
  @Output() closeModal = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<CompanyProfile>();

  companyName = '';
  companyEmail = '';
  companyWebsite = '';

  close() {
    this.closeModal.emit();
  }

  submit() {
    if (this.modalType === 'addCompany') {
      const newCompany :CompanyProfile = {
        companyName: this.companyName,
        website: this.companyWebsite,
        companyId: 0,
        industry: '',
        location: '',
        companySize: '',
        companyLogo: '',
        backgroundDp: '',
        images: [],
        isProfileCompleted: false
      };
      this.confirm.emit(newCompany);
    }
  }
}