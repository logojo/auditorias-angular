import { Component, computed, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import {MatButtonModule} from '@angular/material/button'

import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/interfaces';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './shared/loading/loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,MatButtonModule, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private AuthService = inject( AuthService );
  private router = inject( Router );

  public finishedCheck = computed<boolean>( () => {
    if( this.AuthService.authStatus() === AuthStatus.ckecking )
         return false
    return true 
  });

  public authStatusEffect = effect(() => {
    switch(this.AuthService.authStatus()){
      case AuthStatus.ckecking:
        return;
      case AuthStatus.authenticated:
        this.router.navigateByUrl(localStorage.getItem('url') || '/auditorias')
        return;
      case AuthStatus.notAuthenticated:
        this.router.navigateByUrl('/auth')
        return;
    }


    
  })
}
