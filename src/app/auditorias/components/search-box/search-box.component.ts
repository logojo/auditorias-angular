import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-search-box',
  standalone: true,
  templateUrl: './search-box.component.html',
  imports: [
    MatFormFieldModule,
    MatInputModule
  ]
})
export class SearchBoxComponent {
  private debouncerSubscription? : Subscription;
  private debouncer: Subject<string> = new Subject<string>();
  
  @Input()
  public placeholder : string = ''

  @Input()
  public initialValue : string = ''

  @Output()
  public onValue = new EventEmitter<string>()

  @Output()
  public onDebounce = new EventEmitter<string>()


  ngOnInit() :void {
    this.debouncerSubscription = this.debouncer
    .pipe(
      debounceTime(300)
    )
    .subscribe( value => {
      this.onDebounce.emit(value);
    })
  }

  ngOnDestroy() : void {
    this.debouncerSubscription?.unsubscribe()
  }

  onKeyPress( value : string ) {
   this.debouncer.next( value )
  }
}
