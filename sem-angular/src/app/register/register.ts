import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Authservice } from '../services/authservice';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {

  registerForm!: FormGroup;

  constructor(private authService: Authservice, private fb: FormBuilder , private router : Router) {}

  ngOnInit() {
    console.log('Register component initialized!');
    this.registerForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role: ['user']
    });
    console.log('Register form created:', this.registerForm);
  }

  onRegister() {
    if (this.registerForm.valid) {
      console.log('Form is valid, submitting:', this.registerForm.value);
      this.authService.register(this.registerForm.value).subscribe({
        next: res => {console.log('Registered:', res) ; this.router.navigate(['/login'])},  
        error: err => console.error('Registration error:', err)
      });
    } else {
      console.log('Form is invalid:', this.registerForm.errors);
    }
  }
}

