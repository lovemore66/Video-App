import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideosListComponent } from '../videos-list/videos-list.component';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule,
    VideosListComponent,
    HeaderComponent,
    FooterComponent,
    RouterModule,
  ],
})
export class HomeComponent {}
