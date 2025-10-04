import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashService } from '../services/dash-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css'
})
export class UserDashboard implements OnInit{

  constructor(private dashservices : DashService , private route : ActivatedRoute){}

  userData: any = null
  email !: string;
  isLoading = true;
  errorMessage: string | null = null;
  isEditMode = false;
  isSaving = false;
  successMessage: string | null = null;
  editForm: any = {};
  selectedFile: File | null = null;
  isUploading = false;

  ngOnInit(){

    this.route.paramMap.subscribe(params => {
      this.email = params.get('email')!;

      if(this.email){
        this.isLoading = true;
        this.errorMessage = null;

        console.log("namaste")

        this.dashservices.getUserByEmail(this.email).subscribe({
          next: (res) => {
            this.userData = res?.data || res; 
            console.log(res)
            this.isLoading = false;
          },
          error: (err) => {
            this.errorMessage = err?.error?.message || 'Failed to load user data.';
            this.isLoading = false;
            console.error('User fetch error:', err);
          }
        })
      }
    })

  }

  getMaskedPassword(): string {
    const password: string = this.userData?.password || '';
    if(!password){
      return '********';
    }
    return '*'.repeat(Math.max(password.length, 8));
  }

  toggleEditMode() {
    if (!this.isEditMode) {
      // Initialize edit form with current user data
      this.editForm = {
        firstname: this.userData?.firstname || '',
        lastname: this.userData?.lastname || '',
        email: this.userData?.email || '',
        password: '',
        profilePhoto: this.userData?.profilePhoto || ''
      };
    }
    this.isEditMode = !this.isEditMode;
    this.successMessage = null;
    this.errorMessage = null;
  }

  cancelEdit() {
    this.isEditMode = false;
    this.editForm = {};
    this.successMessage = null;
    this.errorMessage = null;
  }

  saveChanges() {
    if (!this.email) {
      this.errorMessage = 'No email found for update';
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;
    this.successMessage = null;

    // Remove empty password from update if not provided
    const updateData = { ...this.editForm };
    if (!updateData.password) {
      delete updateData.password;
    }

    this.dashservices.updateUser(this.email, updateData).subscribe({
      next: (res) => {
        this.userData = res?.data || res;
        this.isEditMode = false;
        this.isSaving = false;
        this.successMessage = 'Profile updated successfully!';
        this.editForm = {};
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to update profile';
        this.isSaving = false;
        console.error('Update error:', err);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Please select a valid image file (JPEG, PNG, GIF, or WebP)';
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'File size must be less than 5MB';
        return;
      }
      
      this.selectedFile = file;
      this.errorMessage = null;
    }
  }

  uploadProfilePhoto() {
    if (!this.selectedFile || !this.email) {
      this.errorMessage = 'Please select a file to upload';
      return;
    }

    this.isUploading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.dashservices.uploadProfilePhoto(this.email, this.selectedFile).subscribe({
      next: (res) => {
        this.userData = res?.data || res;
        this.isUploading = false;
        this.successMessage = 'Profile photo uploaded successfully!';
        this.selectedFile = null;
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to upload profile photo';
        this.isUploading = false;
        console.error('Upload error:', err);
      }
    });
  }

  getProfilePhotoUrl(): string {
    if (this.userData?.profilePhoto) {
      return `http://localhost:3000${this.userData.profilePhoto}`;
    }
    return '';
  }

}
