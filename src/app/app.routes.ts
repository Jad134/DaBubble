import { Routes } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';
import { CreateAccountComponent } from './create-account/create-account.component';

export const routes: Routes = [
    {path: '', component: LogInComponent},
    {path: 'create-account', component: CreateAccountComponent}
];
