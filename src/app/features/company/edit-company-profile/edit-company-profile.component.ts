import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CompanyProfile } from '../../../core/models/CompanyProfile.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-company-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-company-profile.component.html',
  styleUrl: './edit-company-profile.component.scss'
})
export class EditCompanyProfileComponent implements OnChanges {
  @Input() companyProfile!: CompanyProfile;
  @Output() profileUpdated = new EventEmitter<CompanyProfile>();

  isUploadingLogo = false;
  isUploadingBackground = false;


  profileForm!: FormGroup;
  companyLogoPreview!: string;
  backgroundDpPreview!: string;

  constructor(private fb: FormBuilder) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['companyProfile'] && this.companyProfile) {
      this.initForm();
    }
  }

  initForm() {
    this.profileForm = this.fb.group({
      companyName: [this.companyProfile.companyName, Validators.required],
      industry: [this.companyProfile.industry, Validators.required],
      website: [this.companyProfile.website, [Validators.required, Validators.pattern(/https?:\/\/.*/)]],
      location: [this.companyProfile.location, Validators.required],
      companySize: [this.companyProfile.companySize, Validators.required],
      aboutCompany: [this.companyProfile.aboutCompany],
      companyLogo: [this.companyProfile.companyLogo],
      backgroundDp: [this.companyProfile.backgroundDp],
      workingDays: [this.companyProfile.workingDays, Validators.required],
    });

    this.companyLogoPreview = this.companyProfile.companyLogo;
    this.backgroundDpPreview = this.companyProfile.backgroundDp;
  }


  onImageChange(event: Event, type: 'logo' | 'background') {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'unsigned_krish');

      if (type === 'logo') {
        this.isUploadingLogo = true;
      } else {
        this.isUploadingBackground = true;
      }

      fetch('https://api.cloudinary.com/v1_1/cloudkrish/image/upload', {
        method: 'POST',
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if (type === 'logo') {
            this.companyLogoPreview = data.secure_url;
            console.log(this.companyLogoPreview);
            this.profileForm.patchValue({ companyLogo: data.secure_url });
          } else {
            this.backgroundDpPreview = data.secure_url;
            console.log(this.backgroundDpPreview);
            this.profileForm.patchValue({ backgroundDp: data.secure_url });
          }
        })
        .catch(err => {
          console.error('Cloudinary Upload Error:', err);
        })
        .finally(() => {
          if (type === 'logo') {
            this.isUploadingLogo = false;
          } else {
            this.isUploadingBackground = false;
          }
        });
    }
  }


  get f() {
    return this.profileForm.controls;
  }

  imageLoaded(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.classList.remove('opacity-0');
  }


  submitForm() {
    if (this.profileForm.valid) {
      console.log(this.profileForm.value);
      this.profileUpdated.emit(this.profileForm.value);
    }
  }
}
