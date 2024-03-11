import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { RouterModule } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-new-passwort',
  standalone: true,
  imports: [MatCardModule,RouterModule,MatButtonModule,MatIconModule],
  templateUrl: './new-passwort.component.html',
  styleUrl: './new-passwort.component.scss'
})
export class NewPasswortComponent {

}
