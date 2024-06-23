import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.css'],
})
export class OtpVerificationComponent {
  email: string = '';
  otp: string = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
  }

  onVerifyOtp(otpForm: NgForm) {
    if (otpForm.invalid) {
      Object.keys(otpForm.controls).forEach((field) => {
        const control = otpForm.control.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }

    const otpVerificationDto = {
      email: this.email,
      otp: this.otp,
    };

    this.http
      .post(
        'https://localhost:44302/ayerhs-security/Account/OtpVerification',
        otpVerificationDto
      )
      .subscribe((response: any) => {
        if (response.response === 1) {
          alert('OTP Verification Successful');
          this.router.navigate(['/login']);
        } else {
          alert('OTP Verification Unsuccessful');
        }
      });
  }
}
