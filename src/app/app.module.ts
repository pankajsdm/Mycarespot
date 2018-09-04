
/* Defined required modules and component here */
import { NgModule, ErrorHandler, Pipe, PipeTransform, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule, Http } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TimeAgoPipe } from "time-ago-pipe";
import { MyApp } from './app.component';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
  

/* Defined page components here */
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { FeedPage } from '../pages/feed/feed';
import { DoctorsPage } from '../pages/doctors/doctors';
import { DoctorProfilePage } from './../pages/doctor-profile/doctor-profile';
import { ConversationPage } from './../pages/conversation/conversation';
import { MyhealthPage } from './../pages/myhealth/myhealth';
import { MyRecordsPage } from './../pages/myhealth/my-records/my-records';
import { MyDocumentsPage } from './../pages/myhealth/my-documents/my-documents';
import { MySuppliersPage } from './../pages/myhealth/my-suppliers/my-suppliers';
import { MyPharmaciesPage } from './../pages/myhealth/my-pharmacies/my-pharmacies';
import { DiagnosticsPage } from './../pages/myhealth/my-records/diagnostics/diagnostics';
import { RecoveryPasswordPage } from '../pages/recovery-password/recovery-password';
import { RegisterOptionsPage } from '../pages/register-options/register-options';
import { RegisterAccountPage } from '../pages/register-account/register-account'
import { CommonServiceProvider } from '../providers/common-service/common-service';
import { PatientInfoPage } from './../pages/patient-info/patient-info';

/* Defined pipe here */
import { LikePipe } from './../pipes/like.pipe';
  
@NgModule({
  declarations: [
    MyApp,
    TimeAgoPipe,
    LoginPage,
    TabsPage,
    HomePage,
    AboutPage,
    ContactPage,
    FeedPage,
    DoctorsPage,
    DoctorProfilePage,
    ConversationPage,
    MyhealthPage,
    MyRecordsPage,
    MyDocumentsPage,
    MySuppliersPage,
    MyPharmaciesPage,
    DiagnosticsPage,
    PatientInfoPage,
    RecoveryPasswordPage,
    RegisterOptionsPage,
    RegisterAccountPage,
    LikePipe
  ],      
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    TabsPage,
    HomePage,
    AboutPage,
    ContactPage,
    FeedPage,
    DoctorsPage,
    DoctorProfilePage,
    
    MyhealthPage,
    MyRecordsPage,
    MyDocumentsPage,
    MySuppliersPage,
    MyPharmaciesPage,
    DiagnosticsPage,
    PatientInfoPage,
    ConversationPage,
    RecoveryPasswordPage,
    RegisterOptionsPage,
    RegisterAccountPage
  ],
  exports: [LikePipe],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CommonServiceProvider
  ]
})
export class AppModule {}