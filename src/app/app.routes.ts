import { Routes } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { SelectAvatarComponent } from './select-avatar/select-avatar.component';

export const routes: Routes = [
    {path: '', component: LogInComponent},
    {path: 'create-account', component: CreateAccountComponent},
    {path: 'select-avatar', component: SelectAvatarComponent}
];
