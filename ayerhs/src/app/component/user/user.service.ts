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
      return this.http.put(
        `${this.baseUrl}/UpdatePartition`,
        updatePartitionData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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

  getGroups(id: number): Observable<any> {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('authToken');
      return this.http.get(`${this.baseUrl}/GetGroups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      return throwError('Token unavailable');
    }
  }

  addGroup(addGroupData: any): Observable<any> {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('authToken');
      return this.http.post(`${this.baseUrl}/AddGroup`, addGroupData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      return throwError('Token unavailable');
    }
  }

  updateGroup(updateGroupDto: any): Observable<any> {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('authToken');
      return this.http.put(`${this.baseUrl}/UpdateGroup`, updateGroupDto, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      return throwError('Token unavailable');
    }
  }

  softDeleteGroup(id: number): Observable<any> {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('authToken');
      return this.http.patch(`${this.baseUrl}/SoftDeleteGroup/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      return throwError('Token unavailable');
    }
  }

  restoreDeletedGroup(id: number): Observable<any> {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('authToken');
      return this.http.patch(
        `${this.baseUrl}/RecoverDeletedGroup/${id}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } else {
      return throwError('Token unavailable');
    }
  }

  deleteGroup(id: number): Observable<any> {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('authToken');
      return this.http.delete(`${this.baseUrl}/DeleteGroup/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      return throwError('Token unavailable');
    }
  }

  changePartitionGroup(changePartitionGroupData: any): Observable<any> {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('authToken');
      return this.http.patch(
        `${this.baseUrl}/ChangePartitionGroup`,
        changePartitionGroupData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } else {
      return throwError('Token unavailable');
    }
  }

  enableDisableGroup(id: number): Observable<any> {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('authToken');
      return this.http.patch(
        `${this.baseUrl}/EnableDisableGroup/${id}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } else {
      return throwError('Token unavailable');
    }
  }
}
