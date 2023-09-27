import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { Author, Reactions, Video } from '../models/video';

@Injectable({
  providedIn: 'root',
})
export class VideosService {
  private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public user$: Observable<Author> = this.userSubject.asObservable();
  apiUrl: string = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  setLoggedInUser(user: Author): void {
    this.userSubject.next(user);
  }

  getLoggedInUser(): Observable<Author> {
    return this.userSubject.asObservable();
  }

  getUser(): Observable<Author> {
    const url = `${this.apiUrl}/users/self`;
    return this.http.get<Author>(url).pipe(catchError(this.handleError));
  }

  getReactions(videoId: string): Observable<Reactions[]> {
    const url = `${this.apiUrl}/videos/${videoId}/reactions`;
    return this.http.get<Reactions[]>(url).pipe(catchError(this.handleError));
  }

  getVideos(): Observable<Video[]> {
    const url = `${this.apiUrl}/videos`;
    return this.http.get<Video[]>(url).pipe(catchError(this.handleError));
  }

  getVideoById(id: number): Observable<any> {
    const url = `${this.apiUrl}/videos/${id}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  updateTitle(title: string, videoId: string): Observable<any> {
    const url = `${this.apiUrl}/videos/${videoId}`;
    return this.http
      .patch<any>(url, { title: title })
      .pipe(catchError(this.handleError));
  }

  addStarOrSnapshot(
    videoId: string,
    type: string,
    timeframe: number,
    dataUri?: string
  ): Observable<any> {
    const url = `${this.apiUrl}/videos/${videoId}/reactions`;
    const body = {
      videoId,
      type,
      timeframe,
      dataUri: dataUri || null,
    };
    return this.http.post<any>(url, body).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError('Something went wrong, please try again later.');
  }
}
