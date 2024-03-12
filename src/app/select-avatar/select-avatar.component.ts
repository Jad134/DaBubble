import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FirestoreService } from '../services/firestore.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-select-avatar',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './select-avatar.component.html',
  styleUrl: './select-avatar.component.scss'
})
export class SelectAvatarComponent {
  firestore = inject(FirestoreService)
  name: string = "Tobias Buchner";
  userId = '';

  constructor(private route: ActivatedRoute){};

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null){
      this.userId = id;
    }
    console.log('Get id: ', this.userId);
    //Hier fehlt noch die Funktion zum laden der User Daten aus Firestore
    let data = this.firestore.getUserDataById(this.userId);
    console.log(data);
}

}
