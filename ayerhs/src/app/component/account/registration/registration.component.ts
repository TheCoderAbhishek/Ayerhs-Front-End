import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  passwordFieldType: string = 'password';
  registerFormDto: RegisterFormDto = {
    ClientName: '',
    ClientUsername: '',
    ClientEmail: '',
    ClientPassword: '',
    ClientMobileNumber: '',
    RoleId: null,
  };

  constructor(private http: HttpClient, private router: Router) {}

  togglePasswordVisibility(): void {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  onRegister(registerForm: NgForm) {
    if (registerForm.invalid) {
      Object.keys(registerForm.controls).forEach((field) => {
        const control = registerForm.control.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }
    this.http
      .post(
        'https://localhost:44302/ayerhs-security/Account/RegisterClient',
        this.registerFormDto
      )
      .subscribe((response: any) => {
        if (response.response === 1) {
          if (
            confirm(
              'Registration Successful. Do you want to activate your account now?'
            )
          ) {
            this.router.navigate(['/otp-verification'], {
              queryParams: { email: this.registerFormDto.ClientEmail },
            });
          } else {
            this.router.navigate(['/login']);
          }
        } else {
          alert('Registration Unsuccessful');
        }
      });
  }
}

interface RegisterFormDto {
  ClientName: string;
  ClientUsername: string;
  ClientEmail: string;
  ClientPassword: string;
  ClientMobileNumber: string;
  RoleId: number | null;
}
