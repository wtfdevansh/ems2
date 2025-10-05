import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashService {

  constructor(private http : HttpClient){}

  private baseUrl = 'https://ems2-1-e0iy.onrender.com/api/dash'

  getUserByEmail(email : string): Observable<any>{

    const token = localStorage.getItem('token')

    return this.http.get(`${this.baseUrl}/user/${encodeURIComponent(email)}` as string,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

  }

  updateUser(email: string, userData: any): Observable<any> {
    const token = localStorage.getItem('token');
    
    return this.http.put(`${this.baseUrl}/user/${encodeURIComponent(email)}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  uploadProfilePhoto(email: string, file: File): Observable<any> {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('profilePhoto', file);
    
    return this.http.post(`${this.baseUrl}/user/${encodeURIComponent(email)}/upload-photo`, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getProfilePhotoUrl(email: string): string {
    return `${this.baseUrl.replace('/api/dash', '')}/user/${encodeURIComponent(email)}/profile-photo`;
  }

  // Admin functions
  getAllUsers(search?: string, role?: string, project?: string, canAccess?: boolean): Observable<any> {
    const token = localStorage.getItem('token');
    let params = new URLSearchParams();
    
    if (search) params.append('search', search);
    if (role) params.append('role', role);
    if (project) params.append('project', project);
    if (canAccess !== undefined) params.append('canAccess', canAccess.toString());
    
    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}/admin/users?${queryString}` : `${this.baseUrl}/admin/users`;
    
    return this.http.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getAccessRequests(): Observable<any> {
    const token = localStorage.getItem('token');
    
    return this.http.get(`${this.baseUrl}/admin/access-requests`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  updateUserRoleAndProject(email: string, role: string, project: string): Observable<any> {
    const token = localStorage.getItem('token');
    
    return this.http.put(`${this.baseUrl}/admin/user/${encodeURIComponent(email)}/role-project`, 
      { role, project }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }

  updateUserAccess(email: string, canAccess: boolean): Observable<any> {
    const token = localStorage.getItem('token');
    
    return this.http.put(`${this.baseUrl}/admin/user/${encodeURIComponent(email)}/access`, 
      { canAccess }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }
  
}
