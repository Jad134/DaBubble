import { Routes } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { SelectAvatarComponent } from './select-avatar/select-avatar.component';
import { ResetPasswortComponent } from './log-in/reset-passwort/reset-passwort.component';
import { NewPasswortComponent } from './log-in/reset-passwort/new-passwort/new-passwort.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ImprintComponent } from './imprint/imprint.component';
import { DataprotectionComponent } from './dataprotection/dataprotection.component';

export const routes: Routes = [
<<<<<<< HEAD
  //{ path: '', component: LogInComponent },
=======
  { path: '', component: LogInComponent }, 
>>>>>>> 3f4139983a96455fe4b0850b6c65983c7570670b
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'select-avatar/:id', component: SelectAvatarComponent },
  { path: 'reset-password', component: ResetPasswortComponent },
  { path: 'new-password', component: NewPasswortComponent },
  // { path: '', component: DashboardComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'dataprotection', component: DataprotectionComponent },
];
