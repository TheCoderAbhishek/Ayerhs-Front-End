import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl: string =
    'https://localhost:44302/ayerhs-security/UserManagement';

  constructor(private http: HttpClient) {}

  getPartitions(): Observable<any> {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('authToken');
      return this.http.get(`${this.baseUrl}/GetPartitions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      return throwError('Token unavailable');
    }
  }

  addPartition(partitionName: string): Observable<any> {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('authToken');
      return this.http.post(
        `${this.baseUrl}/AddPartition/${partitionName}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } else {
      return throwError('Token unavailable');
    }
  }

  updatePartition(updatePartitionData: any): Observable<any> {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('authToken');
      return this.http.put(`${this.baseUrl}/UpdatePartition`, { updatePartitionData }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      return throwError('Token unavailable');
    }
  }

  deletePartition(id: number): Observable<any> {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('authToken');
      return this.http.delete(`${this.baseUrl}/DeletePartition/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      return throwError('Token unavailable');
    }
  }
}
