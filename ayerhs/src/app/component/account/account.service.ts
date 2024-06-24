import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private baseUrl: string = 'https://localhost:44302/ayerhs-security/Account';

  constructor(private http: HttpClient) {}

  loginClient(loginData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/LoginClient`, loginData);
  }

  registerClient(registerData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/RegisterClient`, registerData);
  }

  generateOtp(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/OtpGenerationAndEmail`, {
      Email: email,
    });
  }

  verifyOtp(otpData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/OtpVerification`, otpData);
  }
}
