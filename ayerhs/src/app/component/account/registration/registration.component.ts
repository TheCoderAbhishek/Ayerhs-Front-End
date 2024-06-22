import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
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

  constructor(private http: HttpClient) {}

  togglePasswordVisibility(): void {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onRegister() {
    this.http
      .post(
        'https://localhost:44302/ayerhs-security/Account/RegisterClient',
        this.registerFormDto
      )
      .subscribe((response: any) => {
        if (response.response === 1) {
          alert('Registration Successful');
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
