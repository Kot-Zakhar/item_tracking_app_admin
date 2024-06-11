import { AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';

export function passwordMatchValidatorFactory(originalField: string, confirmationField: string): (g: AbstractControl) => ValidationErrors | null {
  return (g: AbstractControl): ValidationErrors | null => {
    const group = g as FormGroup;
  
    if (g.get(originalField)?.value !== g.get(confirmationField)?.value) {
      group.controls[confirmationField].setErrors( { 'mismatch': true });
      return { 'mismatch': true };
    }
    
    group.controls[confirmationField].setErrors(null);
  
    return null;
  }
}
