import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../auth/services/auth.service';



@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatButtonModule, 
    MatSidenavModule, 
    MatIconModule, 
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    RouterLink],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export default class LayoutComponent {
  private AuthService = inject( AuthService );

  @ViewChild('drawer')
  drawer!: MatSidenav;

  public  sidebarItems = [
    {label: 'Inicio', icon: 'dashboard', url: './dashboard' },
    {label: 'Auditorias', icon: 'summarize', url: './auditorias' },
  ]

  logout(){
    this.AuthService.onLogout()
  }

  actualUrl( url: string ) {    
    this.drawer.toggle()
    localStorage.setItem('url', `/auditorias/${url.slice(2)}`)
  }
}
