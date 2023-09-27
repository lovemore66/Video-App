import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { VideosService } from 'src/app/services/videos.service';
import { Author, Reactions, Video } from 'src/app/models/video';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { DateFormatPipe } from 'src/app/shared/pipes/date-format.pipe';
import { TimeFormatPipe } from 'src/app/shared/pipes/time-format.pipe';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
} from '@angular/animations';

@Component({
  selector: 'app-video-details',
  standalone: true,
  templateUrl: './video-details.component.html',
  styleUrls: ['./video-details.component.scss'],
  providers: [DateFormatPipe, TimeFormatPipe],
  imports: [CommonModule, FormsModule],
  animations: [
    trigger('animateChild', [
      state(
        'up',
        style({
          opacity: 0,
          transform: 'translateY(-50%)',
        })
      ),
      transition('* => up', [
        animate(
          '2s',
          keyframes([
            style({ opacity: 0, transform: 'translateY(0)', offset: 0 }),
            style({ opacity: 1, transform: 'translateY(-100px)', offset: 0.5 }),
            style({ opacity: 0, transform: 'translateY(-220px)', offset: 1.0 }),
          ])
        ),
      ]),
    ]),
  ],
})
export class VideoDetailsComponent {
  video$!: Observable<Video>;
  Reactions$!: Reactions[];
  inputValue!: string;
  videoId!: string;
  logedInUser!: Author;
  currentTimeFrame: number = 0.010111;
  currentDataUri!: string;
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef;
  @ViewChild('canvas', { static: false }) canvas!: ElementRef;
  videoPlayerRef: any;
  capturedImageData!: string;
  animateState: string = '';
  showChild: boolean = false;
  loading: boolean = true;
  selectedTab: number = -0;

  constructor(
    private videoService: VideosService,
    private route: ActivatedRoute,
    private dateFormatPipe: DateFormatPipe,
    private timeFormatPipe: TimeFormatPipe
  ) {}

  ngOnInit(): void {
    const videoId: any = this.route.snapshot.paramMap.get('id');
    this.video$ = this.videoService.getVideoById(videoId);
    this.initiateValue();

    this.videoService.getLoggedInUser().subscribe((user: Author) => {
      this.logedInUser = user;
    });

    this.videoService.getReactions(videoId).subscribe((res) => {
      this.Reactions$ = res;
      this.sortByDates(this.Reactions$);
    });
  }

  selectTab(tabNumber: number): void {
    this.selectedTab = tabNumber + 1;
  }

  getFormattedTime(date: any): string {
    return this.timeFormatPipe.transform(date);
  }

  animateChild(): void {
    this.showChild = true;
    this.animateState = 'up';
    setTimeout(() => {
      this.showChild = false;
      this.animateState = '';
    }, 5000);
  }

  moveVideoForward(timeFrame: number, index: number) {
    this.selectTab(index);
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      const video = this.videoPlayer.nativeElement;
      video.currentTime = timeFrame;
    }
  }

  onVideoLoaded(): void {
    this.moveVideoForward(0.001, -1);
    this.captureFrame();
    this.loading = false;
  }

  save(): void {
    this.videoService.updateTitle(this.inputValue, this.videoId).subscribe();
  }

  initiateValue(): void {
    this.video$.subscribe((res) => {
      this.inputValue = res.title;
      this.videoId = res.id;
    });
  }

  getFormattedDate(date: any): any {
    return this.dateFormatPipe.transform(date);
  }

  onTimeUpdate(event: Event): void {
    this.captureFrame();
  }

  addSnapshotOrStar(
    VideoId: string,
    type: string,
    timeframe: number,
    dataUri?: any
  ) {
    this.videoService
      .addStarOrSnapshot(VideoId, type, timeframe, dataUri)
      .subscribe((res) => {
        if (res) {
          this.Reactions$.unshift(res[res.length - 1]);
        }
        if (type === 'star') {
          this.animateChild();
        }
      });
  }

  sortByDates(data: any[]): any[] {
    return data.sort((a, b) => {
      const dateA = a.postedDate || a.createdDate;
      const dateB = b.postedDate || b.createdDate;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
  }

  captureFrame() {
    if (!this.videoPlayer || !this.canvas) {
      console.error('Elements not available.');
      return;
    }

    const video = this.videoPlayer.nativeElement;
    const canvas = this.canvas.nativeElement;
    this.currentTimeFrame = video.currentTime;
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, videoWidth, videoHeight);
    //This will not work with the current API due to CORS issues. A change is needed on the backend to support this
    const base64ImageData = canvas.toDataURL('image/png');
    // Should you use a local video on the above method it will Work or create dataUri.
    this.currentDataUri = base64ImageData;
  }
}
