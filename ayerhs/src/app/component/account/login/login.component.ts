import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  passwordFieldType: string = 'password';

  togglePasswordVisibility(): void {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  inLoginClientDto: InLoginClientDto;
  constructor(private http: HttpClient, private router: Router) {
    this.inLoginClientDto = new InLoginClientDto();
  }

  navigateToRegistration() {
    this.router.navigate(['/registration']);
  }

  onLogin(loginForm: NgForm) {
    if (loginForm.invalid) {
      Object.keys(loginForm.controls).forEach((field) => {
        const control = loginForm.control.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }
    this.http
      .post(
        'https://localhost:44302/ayerhs-security/Account/LoginClient',
        this.inLoginClientDto
      )
      .subscribe((response: any) => {
        if (response.response === 1) {
          alert('Login Successful');
        } else {
          alert('Login Unsuccessful');
        }
      });
  }
}

export class InLoginClientDto {
  ClientEmail: string;
  ClientPassword: string;
  constructor() {
    this.ClientEmail = '';
    this.ClientPassword = '';
  }
}
