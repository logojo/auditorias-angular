import { Component } from '@angular/core';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [ MatProgressSpinnerModule ],
  template: `
  <div class="flex justify-content-center align-items-center h-full">
   <mat-spinner  color="warn" [diameter]="50"></mat-spinner>
  </div>
  `,
})
export class LoadingComponent {

}
