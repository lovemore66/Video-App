import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideosService } from 'src/app/services/videos.service';
import { Tab, Video } from 'src/app/models/video';
import { Router } from '@angular/router';
import { DateFormatPipe } from 'src/app/shared/pipes/date-format.pipe';

@Component({
  selector: 'app-videos-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './videos-list.component.html',
  styleUrls: ['./videos-list.component.scss'],
  providers: [DateFormatPipe],
})
export class VideosListComponent {
  videos$!: Video[];
  selectedVideo!: Video;
  activeTab: number = 1;
  loading: boolean = true;
  tabs: Tab[] = [
    {
      tabNumber: 1,
      iconActive: '../../../assets/icons/visualization-b.png',
      iconInactive: '../../../assets/icons/visualization.png',
      altText: 'Visualization Tab',
    },
    {
      tabNumber: 2,
      iconActive: '../../../assets/icons/list-b.png',
      iconInactive: '../../../assets/icons/list.png',
      altText: 'List Tab',
    },
  ];

  constructor(
    private videoService: VideosService,
    private router: Router,
    private dateFormatPipe: DateFormatPipe
  ) {}

  ngOnInit(): void {
    this.videoService.getVideos().subscribe((res) => {
      console.log(res);
      this.videos$ = res;
      this.loading = false;
    });
  }

  toggleTab(tabNumber: number) {
    this.activeTab = tabNumber;
  }

  showVideoDetails(videoId: any): void {
    this.router.navigate(['/video', videoId]);
  }

  getFormattedDate(date: string): string {
    return this.dateFormatPipe.transform(date);
  }
}
