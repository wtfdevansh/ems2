import { Routes } from '@angular/router';
import { Register } from './register/register';
import { Login } from './login/login';
import { UserDashboard } from './user-dashboard/user-dashboard';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';



export const routes: Routes = [
    {
        path: "",
        redirectTo: 'login',
        pathMatch: "full"
    },
    {
        path: 'register',
        component: Register
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'user-dashboard/:email',
        component: UserDashboard

    },
    {
        path: 'admin',
        component: AdminDashboard

    },
    {
        path: '**',
        redirectTo: "login"
    }
];
