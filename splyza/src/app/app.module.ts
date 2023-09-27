import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from "./shared/header/header.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { FormsModule } from '@angular/forms';
import { DateFormatPipe } from './shared/pipes/date-format.pipe';
import { TimeFormatPipe } from './shared/pipes/time-format.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
    declarations: [
        AppComponent,
        DateFormatPipe,
        TimeFormatPipe
    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule, FormsModule, HomeComponent, HttpClientModule,
        HeaderComponent,
        FooterComponent,
    ],
    exports: [DateFormatPipe]
})
export class AppModule { }
