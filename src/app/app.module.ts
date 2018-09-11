
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
import { MedicalCarePage } from './../pages/medical-care/medical-care';
import { DoctorsPage } from '../pages/doctors/doctors';
import { DoctorProfilePage } from './../pages/doctor-profile/doctor-profile';
import { ConversationPage } from './../pages/conversation/conversation';
import { MyhealthPage } from './../pages/myhealth/myhealth';
import { MyRecordsPage } from './../pages/myhealth/my-records/my-records';
import { MyDocumentsPage } from './../pages/myhealth/my-documents/my-documents';
import { MySuppliersPage } from './../pages/myhealth/my-suppliers/my-suppliers';
import { MyPharmaciesPage } from './../pages/myhealth/my-pharmacies/my-pharmacies';
import { DiagnosticsPage } from './../pages/myhealth/my-records/diagnostics/diagnostics';
import { RecoveryPasswordPage } from './../pages/recovery-password/recovery-password';
import { RegisterOptionsPage } from './../pages/register-options/register-options';
import { RegisterAccountPage } from './../pages/register-account/register-account'
import { CommonServiceProvider } from './../providers/common-service/common-service';
  
import { PatientInfoPage } from './../pages/patient-info/patient-info';
import { AddMinorPage } from './../pages/add-minor/add-minor';
import { PatientSimptomPage } from './../pages/patient-info/patient-simptom/patient-simptom';
import { RiskFactorsPage } from './../pages/patient-info/risk-factors/risk-factors';
import { MedicalHistoryPage } from './../pages/patient-info/medical-history/medical-history';
import { BodyMeasurementsPage } from './../pages/patient-info/body-measurements/body-measurements';
import { VitalsPage } from './../pages/patient-info/vitals/vitals';
import { PharmacyPage } from './../pages/patient-info/pharmacy/pharmacy';
import { PharmacyAddPage } from './../pages/patient-info/pharmacy-add/pharmacy-add';
import { PharmacyMapPage } from './../pages/patient-info/pharmacy-map/pharmacy-map';


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
    MedicalCarePage,
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
    AddMinorPage,
    PatientSimptomPage,
    RiskFactorsPage,
    MedicalHistoryPage,
    BodyMeasurementsPage,
    VitalsPage,
    PharmacyPage,
    PharmacyAddPage,
    PharmacyMapPage,
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
    MedicalCarePage,
    DoctorsPage,
    DoctorProfilePage,
    MyhealthPage,
    MyRecordsPage,
    MyDocumentsPage,
    MySuppliersPage,
    MyPharmaciesPage,
    DiagnosticsPage,
    PatientInfoPage,
    AddMinorPage,
    PatientSimptomPage,
    RiskFactorsPage,
    MedicalHistoryPage,
    BodyMeasurementsPage,
    VitalsPage,
    PharmacyPage,
    PharmacyAddPage,
    PharmacyMapPage,
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