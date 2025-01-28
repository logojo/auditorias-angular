import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, QueryList, Renderer2, ViewChild, ViewChildren, inject, input, effect, output, LOCALE_ID, OnChanges, SimpleChanges } from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import {StepperOrientation, StepperSelectionEvent} from '@angular/cdk/stepper';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepper, MatStepperModule} from '@angular/material/stepper';
import {MatSelect, MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from '@angular/material/core';

import { Stepper } from '../../interfaces/auditorias.interface';
import { Observable, map } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';


interface Struture {
  stepperFields : Stepper[];
  titles : string[]
}
@Component({
  selector: 'app-stteper',
  standalone: true,
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
    provideNativeDateAdapter(),   
  ],
  imports: [
    CommonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule
  ],
  templateUrl: './stteper.component.html',
  styleUrl: './stteper.component.css'
})
export class StteperComponent implements OnChanges {
   private fb = inject( FormBuilder );
   private redered2 = inject( Renderer2 );  
   private cd = inject( ChangeDetectorRef );
   private breakpointObserver = inject( BreakpointObserver );

   @Output()
   public onElementForm: EventEmitter<any> = new EventEmitter()

   public onStepEmitter = output<any>();
   
   @ViewChildren('input') inputsArray!: QueryList<ElementRef>
   @ViewChild(MatStepper) stepper!: MatStepper;
   @ViewChild(MatSelect) select!: MatSelect;

   @Input({required: true})
   public stepperFields :Stepper[] = []

   @Input({required: true})
   public titles :string[] = []

   public step = input.required<number>()
   public several = input<boolean>(false)

   public auditoria: FormGroup[] = []

   stepperOrientation!: Observable<StepperOrientation>;

   constructor() {
    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
      
     effect(() => {  
        if( !this.step() ){
            this.stepper.reset()
        } else if( this.step() > 0 && this.step() < this.stepperFields.length  ) {
           if( !this.several() )
               this.stepper.selectedIndex = this.step() -1
        } else if( this.stepperFields.length !== 0) {
              this.stepper.selectedIndex = this.stepperFields.length -1;
       }
     })
  }

  ngOnChanges(changes: any): void {
     if( this.stepperFields.length > 0) {
      this.stepperFields.forEach(step => {
          const formGroup = this.fb.group({});
            step.fields.forEach(field => {
            
            const validators = [];
            if ( field.required ) {
              validators.push(Validators.required);
            }
            formGroup.addControl(field.name, this.fb.control(field.value || '', validators));
          });
  
          this.auditoria.push(formGroup);
        });
          
     }
  }
  
  isCompleted ( index : number ) : boolean {
    if( index < this.step()-1 )
        return true
    return false
  }

  showInputs( live : boolean, option : string, rules: string[], inputs: string[],  formIndex: string|number ) {
    let index = 0

    if(typeof formIndex === 'string'){
      let step = formIndex as string;
      index = +step.split(' ')[1] - 1
    }else {
      index = formIndex;
    }
    

    const form = this.auditoria[index];
    const validators = [Validators.required];

     if( live ) {
      inputs.map(input => {
        const el : ElementRef<HTMLElement> = this.getElementRef( input+'-'+(index+1) )
        if ( rules.includes(option)) {          
          form.get(input)?.setValidators(validators);            
          this.redered2.setStyle(el.nativeElement, 'display', 'block') 
        } else {
           form.get(input)?.clearValidators();
           this.redered2.setStyle(el.nativeElement, 'display', 'none') 
        }

         form.get(input)?.updateValueAndValidity()
      })
     }   
  }

  getElementRef( item : string ) {     
    let toArray = this.inputsArray.toArray();
    return toArray.find(el => el.nativeElement.id == item) as ElementRef<HTMLElement> 
  }

  submitForm(formIndex: number): void {
    const form = this.auditoria[formIndex];
    
    if ( form.valid ) {  
         this.onElementForm.emit( { ...form.value, step: formIndex + 1 })       
    } 
  }

  onFileChange(formIndex: string, event: Event  ) {
    const step = +formIndex.split(' ')[1] - 1;
    
    const form = this.auditoria[step];
    const input = event.target as HTMLInputElement;

    let reader = new FileReader();
   
    if(input.files && input.files.length) {
      const file:File = input.files[0];
      reader.readAsDataURL(file);
    
      reader.onload = () => {
        form.patchValue({
          file: file
      });        
        this.cd.markForCheck();
      };
    }
  }

  fillFields( event : StepperSelectionEvent) {
      this.onStepEmitter.emit( event.selectedIndex )
  }

}


  



