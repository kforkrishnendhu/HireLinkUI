import { Directive, Input } from '@angular/core';
import { AbstractControl, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';


@Directive({
  selector: '[appMustMatch]',
  standalone: true
})
export class MustMatchDirective implements Validator {
  @Input('appMustMatch') mustMatchFields!: string[];

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.mustMatchFields || this.mustMatchFields.length !== 2 || !control.parent) {
      return null;
    }

    const parent = control.parent;
    const passwordControl = parent.get(this.mustMatchFields[0]);
    const confirmPasswordControl = parent.get(this.mustMatchFields[1]);

    if (!passwordControl || !confirmPasswordControl) return null;

    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ mustMatch: true });
      return { mustMatch: true };
    } else {
      if (confirmPasswordControl.hasError('mustMatch')) {
        confirmPasswordControl.setErrors(null);
      }
    }

    return null;
  }
}