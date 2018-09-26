
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
import { RegisterAccountPage } from './../pages/register-account/register-account';
import { CountryCodePage } from './../pages/register-account/country-code/country-code';
import { CommonServiceProvider } from './../providers/common-service/common-service';
    
import { PatientInfoPage } from './../pages/patient-info/patient-info';
import { OptionsSimptomPage } from './../pages/patient-info/options-simptom/options-simptom';

import { AddMinorPage } from './../pages/add-minor/add-minor';
import { PatientSimptomPage } from './../pages/patient-info/patient-simptom/patient-simptom';
import { PatientSimptomNextPage } from './../pages/patient-info/patient-simptom/patient-simptom-next/patient-simptom-next';
import { RiskFactorsPage } from './../pages/patient-info/risk-factors/risk-factors';

import { MedicalHistoryPage } from './../pages/patient-info/medical-history/medical-history';
import { MedicalHistoryPhase2Page } from './../pages/patient-info/medical-history/medical-history-phase2/medical-history-phase2';
import { MedicalHistoryPhase3Page } from './../pages/patient-info/medical-history/medical-history-phase3/medical-history-phase3';
import { MedicalHistoryPhase4Page } from './../pages/patient-info/medical-history/medical-history-phase4/medical-history-phase4';
import { MedicalHistoryPhase5Page } from './../pages/patient-info/medical-history/medical-history-phase5/medical-history-phase5';

import { BodyMeasurementsPage } from './../pages/patient-info/body-measurements/body-measurements';
import { BodyMeasurementChooserPage } from './../pages/patient-info/body-measurements/body-measurement-chooser/body-measurement-chooser';

import { VitalsPage } from './../pages/patient-info/vitals/vitals';
import { VitalsChooserPage } from './../pages/patient-info/vitals/vitals-chooser/vitals-chooser';


import { PharmacyPage } from './../pages/patient-info/pharmacy/pharmacy';
import { PharmacyAddPage } from './../pages/patient-info/pharmacy/pharmacy-add/pharmacy-add';
import { PharmacyMapPage } from './../pages/patient-info/pharmacy/pharmacy-map/pharmacy-map';
import { PharmacySearchPage } from '../pages/patient-info/pharmacy/pharmacy-search/pharmacy-search';
import { SummaryPage } from './../pages/patient-info/summary/summary';
import { InsuranceDetailPage } from './../pages/patient-info/insurance-list/insurance-detail/insurance-detail';
import { InsuranceListPage } from './../pages/patient-info/insurance-list/insurance-list';
import { VisitingCostPage } from './../pages/patient-info/visiting-cost/visiting-cost';


import { SchedulePage } from './../pages/schedule/schedule';
import { AppointmentsPage } from './../pages/schedule/appointments/appointments';
import { AppointmentsRequestPage } from './../pages/schedule/appointments-request/appointments-request';
import { ListAppointmentsPage } from './../pages/schedule/list-appointments/list-appointments';




/* Defined pipe here */
import { LikePipe } from './../pipes/like.pipe';

@NgModule({
  declarations: [
    MyApp,
    TimeAgoPipe,
    LoginPage,
    TabsPage,
    HomePage,
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
    OptionsSimptomPage,
    AddMinorPage,
    PatientSimptomPage,
    PatientSimptomNextPage,
    RiskFactorsPage,
    MedicalHistoryPage,
    MedicalHistoryPhase2Page,
    MedicalHistoryPhase3Page,
    MedicalHistoryPhase4Page,
    MedicalHistoryPhase5Page,

    BodyMeasurementsPage,
    BodyMeasurementChooserPage,

    VitalsPage,
    VitalsChooserPage,
    
    PharmacyPage,
    PharmacyAddPage,
    PharmacyMapPage,
    PharmacySearchPage,
    SummaryPage,
    InsuranceDetailPage,
    InsuranceListPage,
    VisitingCostPage,

    SchedulePage,
    AppointmentsPage,
    AppointmentsRequestPage,
    ListAppointmentsPage,

    RecoveryPasswordPage,   
    RegisterOptionsPage,
    RegisterAccountPage,
    CountryCodePage,
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
    OptionsSimptomPage,
    AddMinorPage,
    PatientSimptomPage,
    PatientSimptomNextPage,
    RiskFactorsPage,

    MedicalHistoryPage,
    MedicalHistoryPhase2Page,
    MedicalHistoryPhase3Page,
    MedicalHistoryPhase4Page,
    MedicalHistoryPhase5Page,

    BodyMeasurementsPage,
    BodyMeasurementChooserPage,

    VitalsPage,
    VitalsChooserPage,

    PharmacyPage,
    PharmacyAddPage,
    PharmacyMapPage,
    PharmacySearchPage,
    SummaryPage,
    InsuranceDetailPage,
    InsuranceListPage,
    VisitingCostPage,

    SchedulePage,
    AppointmentsPage,
    AppointmentsRequestPage,
    ListAppointmentsPage,

    ConversationPage,
    RecoveryPasswordPage,
    RegisterOptionsPage,
    RegisterAccountPage,
    CountryCodePage 
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