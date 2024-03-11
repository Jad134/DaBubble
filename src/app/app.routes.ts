import { Routes } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { SelectAvatarComponent } from './select-avatar/select-avatar.component';
import { ResetPasswortComponent } from './log-in/reset-passwort/reset-passwort.component';
import { NewPasswortComponent } from './log-in/reset-passwort/new-passwort/new-passwort.component';


export const routes: Routes = [
    {path: '', component: LogInComponent},
    {path: 'create-account', component: CreateAccountComponent},
    {path: 'select-avatar', component: SelectAvatarComponent},
    {path: 'reset-password', component: ResetPasswortComponent},
    {path: 'new-password', component: NewPasswortComponent}
];
