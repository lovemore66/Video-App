import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideosService } from 'src/app/services/videos.service';
import { Author } from 'src/app/models/video';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user$!: any;
  currentPath!: string;

  constructor(private videoService: VideosService, private router: Router) {}
  ngOnInit(): void {
    this.videoService.getUser().subscribe((user: Author) => {
      this.user$ = user;
      this.videoService.setLoggedInUser(user);
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.handleUrlChange(event.url);
      }
    });
  }

  private handleUrlChange(url: string): void {
    this.currentPath = url;
  }

  navigaeToHome(): void {
    this.router.navigate(['/']);
  }
}
