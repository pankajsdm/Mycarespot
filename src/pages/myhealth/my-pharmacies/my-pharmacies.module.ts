import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyPharmaciesPage } from './my-pharmacies';

@NgModule({
  declarations: [
    MyPharmaciesPage,
  ],
  imports: [
    IonicPageModule.forChild(MyPharmaciesPage),
  ],
})
export class MyPharmaciesPageModule {}
