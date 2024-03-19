import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule, Router, } from '@angular/router';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-head-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './head-dashboard.component.html',
  styleUrl: './head-dashboard.component.scss'
})
export class HeadDashboardComponent {
  downloadService = inject(StorageService)
  userId = '';
  profilePicture: any;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getIdFromURL();
    this.downloadProfileDatas(this.userId);
  }


  /**
     * read UserID from the Url.
     */
  getIdFromURL() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.userId = id;
    }
    console.log('die id ist:', this.userId);
  }


  downloadProfileDatas(userID: any) {
    this.downloadService.downloadAvatar(userID)
    
  }
}


