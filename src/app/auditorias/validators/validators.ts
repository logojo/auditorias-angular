import { ValidationErrors, AbstractControl } from '@angular/forms';

export const requireIf = ( field: string, rule: string, fieldRule: string ) => {
    return ( formGroup : AbstractControl) : ValidationErrors | null => {

        const fieldValue = formGroup.get(field)?.value;
        const fieldRuleValue = formGroup.get(fieldRule)?.value;
        

        if( fieldRuleValue?.nombre === rule && !fieldValue ){
            return {
                required: true
          }
        }

        return null
    }
}