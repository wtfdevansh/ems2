import { Component, KeyValueDiffers, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Authservice } from '../services/authservice';
import { routes } from '../app.routes';
import { Route , Router } from '@angular/router';
import { AdminDashboard } from '../admin-dashboard/admin-dashboard';
import { UserDashboard } from '../user-dashboard/user-dashboard';
import { jwtDecode } from 'jwt-decode';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule , AdminDashboard , UserDashboard],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit{

  loginForm !: FormGroup

  constructor(private authservice : Authservice , private fb : FormBuilder , private router : Router){}

  ngOnInit(): void {

    this.loginForm = this.fb.group({

      email : ['' , [Validators.required , Validators.email]],
      password: ['' , [Validators.required]]

    })
    
  }

  onLogin(){

    if(this.loginForm.valid){

      console.log('Form is valid, submitting:', this.loginForm.value);
      this.authservice.login(this.loginForm.value).subscribe({
        next: res => {

          console.log('Login:', res)

          localStorage.setItem('token' , res.token)

          const token = localStorage.getItem('token')

          if(token){
            const decode = jwtDecode<any>(token)

            if(decode.role === 'admin'){

              this.router.navigate(['/admin'])
  
            }else{
  
              this.router.navigate(['/user-dashboard' , decode.email])
  
            }

          }
        },
        error: err => console.error('Login error:', err)
      });

    }else{
      console.log("form is invalid" , this.loginForm.errors)
    }

  }

}
