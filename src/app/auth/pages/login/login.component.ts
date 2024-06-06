import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBar} from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatCardModule, 
    MatInputModule, 
    MatFormFieldModule,
    MatButtonModule,    
  ], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {
  private fb = inject( FormBuilder );
  private authService = inject( AuthService );
  private router = inject( Router)

  public loginForm : FormGroup = this.fb.group({
    email: ['joel@zacatecas.gob.mx', [ Validators.required, Validators.email ]],
    password: ['1234Qwer', [ Validators.required ]]
  })

  constructor(private _snackBar: MatSnackBar) {}

  login() : void {    
    const { email, password } = this.loginForm.value;
    this.authService.onLogin( email, password )
        .subscribe({
          next: () => this.router.navigateByUrl('/auditorias'),
          error: ( message ) => {
            this._snackBar.open(message, 'error!!!', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
          }
        })
  }
}
