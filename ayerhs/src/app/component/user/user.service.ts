import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl: string = 'https://localhost:44302/ayerhs-security/UserManagement';

  constructor(private http: HttpClient) {}

  getPartitions(): Observable<any> {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('authToken');
      return this.http.get(`${this.baseUrl}/GetPartitions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } else {
      return throwError('localStorage unavailable');
    }
  }
}
