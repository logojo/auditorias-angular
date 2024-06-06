import { Routes } from '@angular/router';
import { isNotAuthenticatedGuard, isAuthenticatedGuard } from './auth/guards';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent:() => import('./auth/pages/login/login.component')
    },    
    {
        path: 'auditorias',
        loadComponent:() => import('./auditorias/layout/layout.component'),
        canActivate:[ isAuthenticatedGuard ],
        children: [
            { 
                path: 'dashboard', 
                loadComponent:() => import('./auditorias/pages/dashboard/dashboard.component'),
                title: 'Inicio'  
            },
            { 
                path: 'auditorias', 
                loadComponent:() => import('./auditorias/pages/auditorias/auditorias.component'),
                title: 'Auditorias' },
            { 
                path: 'planeacion/:id', 
                loadComponent:() => import('./auditorias/pages/planeacion/planeacion.component'),
                title: 'Planeación' 
            },
            { 
                path: 'ejecucion/:id', 
                loadComponent:() => import('./auditorias/pages/ejecucion/ejecucion.component'),
                title: 'Ejecución' 
            },
            { path: '**', redirectTo: 'dashboard' }
        ]
          
    },
    { path: '**', redirectTo: 'login'} 
];
