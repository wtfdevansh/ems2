import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashService } from '../services/dash-service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {

  constructor(private dashService: DashService) {}

  // Data properties
  allUsers: any[] = [];
  accessRequests: any[] = [];
  filteredUsers: any[] = [];
  
  // UI state
  isLoading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  activeTab: 'all' | 'requests' = 'all';
  
  // Search and filter properties
  searchTerm = '';
  selectedRole = 'all';
  selectedProject = 'all';
  selectedAccess = 'all';
  
  // Edit state
  editingUser: any = null;
  editRole = '';
  editProject = '';
  isUpdating = false;

  // Available options for dropdowns
  roles = ['all', 'user', 'admin'];
  projects = ['all', 'not assigned', 'Project Alpha', 'Project Beta', 'Project Gamma', 'Project Delta'];
  accessOptions = ['all', 'true', 'false'];

  ngOnInit() {
    this.loadAllUsers();
    this.loadAccessRequests();
  }

  loadAllUsers() {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.dashService.getAllUsers().subscribe({
      next: (res) => {
        this.allUsers = res?.data || [];
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to load users';
        this.isLoading = false;
        console.error('Error loading users:', err);
      }
    });
  }

  loadAccessRequests() {
    this.dashService.getAccessRequests().subscribe({
      next: (res) => {
        this.accessRequests = res?.data || [];
      },
      error: (err) => {
        console.error('Error loading access requests:', err);
      }
    });
  }

  applyFilters() {
    let filtered = [...this.allUsers];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.firstname.toLowerCase().includes(searchLower) ||
        user.lastname.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }

    // Apply role filter
    if (this.selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === this.selectedRole);
    }

    // Apply project filter
    if (this.selectedProject !== 'all') {
      filtered = filtered.filter(user => user.project === this.selectedProject);
    }

    // Apply access filter
    if (this.selectedAccess !== 'all') {
      const accessValue = this.selectedAccess === 'true';
      filtered = filtered.filter(user => user.canAccess === accessValue);
    }

    this.filteredUsers = filtered;
  }

  onSearchChange() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedRole = 'all';
    this.selectedProject = 'all';
    this.selectedAccess = 'all';
    this.applyFilters();
  }

  startEditUser(user: any) {
    this.editingUser = user;
    this.editRole = user.role;
    this.editProject = user.project;
  }

  cancelEdit() {
    this.editingUser = null;
    this.editRole = '';
    this.editProject = '';
  }

  updateUser() {
    if (!this.editingUser) return;

    this.isUpdating = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.dashService.updateUserRoleAndProject(
      this.editingUser.email, 
      this.editRole, 
      this.editProject
    ).subscribe({
      next: (res) => {
        // Update the user in the local arrays
        const updatedUser = res?.data;
        if (updatedUser) {
          const index = this.allUsers.findIndex(u => u.email === updatedUser.email);
          if (index !== -1) {
            this.allUsers[index] = updatedUser;
          }
          
          const requestIndex = this.accessRequests.findIndex(u => u.email === updatedUser.email);
          if (requestIndex !== -1) {
            this.accessRequests[requestIndex] = updatedUser;
          }
          
          this.applyFilters();
        }
        
        this.isUpdating = false;
        this.successMessage = 'User updated successfully!';
        this.editingUser = null;
        this.editRole = '';
        this.editProject = '';
        
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to update user';
        this.isUpdating = false;
        console.error('Error updating user:', err);
      }
    });
  }

  updateUserAccess(user: any, canAccess: boolean) {
    this.isUpdating = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.dashService.updateUserAccess(user.email, canAccess).subscribe({
      next: (res) => {
        // Update the user in the local arrays
        const updatedUser = res?.data;
        if (updatedUser) {
          const index = this.allUsers.findIndex(u => u.email === updatedUser.email);
          if (index !== -1) {
            this.allUsers[index] = updatedUser;
          }
          
          // Remove from or add to access requests based on new status
          if (canAccess) {
            this.accessRequests = this.accessRequests.filter(u => u.email !== updatedUser.email);
          } else {
            const requestIndex = this.accessRequests.findIndex(u => u.email === updatedUser.email);
            if (requestIndex === -1) {
              this.accessRequests.unshift(updatedUser);
            } else {
              this.accessRequests[requestIndex] = updatedUser;
            }
          }
          
          this.applyFilters();
        }
        
        this.isUpdating = false;
        this.successMessage = `User access ${canAccess ? 'granted' : 'revoked'} successfully!`;
        
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to update user access';
        this.isUpdating = false;
        console.error('Error updating user access:', err);
      }
    });
  }

  getProfilePhotoUrl(user: any): string {
    if (user?.profilePhoto) {
      return `http://localhost:3000${user.profilePhoto}`;
    }
    return '';
  }

  getStatusBadgeClass(canAccess: boolean): string {
    return canAccess ? 'status-badge granted' : 'status-badge pending';
  }

  getRoleBadgeClass(role: string): string {
    return role === 'admin' ? 'role-badge admin' : 'role-badge user';
  }
}
