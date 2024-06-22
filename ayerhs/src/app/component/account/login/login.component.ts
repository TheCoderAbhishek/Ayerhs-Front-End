import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  passwordFieldType: string = 'password';

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  inLoginClientDto: InLoginClientDto;
  constructor(private http: HttpClient) {
    this.inLoginClientDto = new InLoginClientDto();
  }

  onLogin() {
    this.http.post('https://localhost:44302/ayerhs-security/Account/LoginClient', this.inLoginClientDto).subscribe((response:any) => {
      if (response.response === 1){
        alert("Login Successful");
      } else {
        alert("Login Unuccessful");
      }
    })
  }
}

export class InLoginClientDto{
  ClientEmail: string;
  ClientPassword: string;
  constructor(){
    this.ClientEmail='',
    this.ClientPassword=''
  }
}
