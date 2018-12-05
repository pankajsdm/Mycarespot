import { Component } from '@angular/core';
import { ToastController, NavParams, NavController, MenuController } from 'ionic-angular';
import { PatientSimptomNextPage } from './patient-simptom-next/patient-simptom-next';
import { CommonServiceProvider } from '../../../providers/common-service/common-service';
import { DoctorsPage } from "../../doctors/doctors";


@Component({
  selector: 'page-patient-simptom',
  templateUrl: 'patient-simptom.html',
})
export class PatientSimptomPage {

  public user: any = {};
  public symtoms: any;
  public items: any;
  current_user: any;
  public disease: any = [];
  registration_type: boolean;
  lists: any;
  searchQuery: string;
  isSubmitted: boolean = false;
  online: Boolean = true;
  loading: any;
  user_data: any;
  user_picture: String;
  isLoading: Boolean = false;
  error = '';
  isError: Boolean = false;
  constructor(
    private toastCtrl: ToastController,
    public navCtrl: NavController, 
    public authService: CommonServiceProvider,
    public navParams: NavParams
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientSimptomPage');
    this.user_picture = localStorage.getItem('user_picture');   
    this.user.country_code = 'PR +1';
    this.current_user = JSON.parse(localStorage.getItem('user_data'));
    this.defineSymtoms();
  }  



  getItems(ev: any) {
    const val = ev.target.value;
    console.log("val", val);
    if (val && val.trim() != '') {
      this.items = this.symtoms;
      this.items = this.items.filter((item) => {
          if(!this.disease.includes(item.translations.fr.name.toLowerCase()))
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }else{
      this.items = [];
    }
  } 

  selectItem(value){
    this.isError = false;
    this.disease.push(value);
    console.log('Desease', this.disease);
    this.searchQuery = '';
    this.items = [];
  } 

  removeItem(des){
    var index = this.disease.indexOf(des);
    if(index!=-1){
        this.disease.splice(index, 1);
    }
    console.log('remain item', this.disease);
  } 

  saveAndNextPhase(){
    if(this.online){
        if(this.disease.length==0){
            this.isError = true;
            this.error = 'El campo es obligatorio..';
        }else{
            this.isError = false;
            this.authService.showLoader();
            let data = {
                patient_user_id: this.current_user._id,
                symptom_list: this.disease
            }
            this.authService.post('patient/addHealthQuestions', data).then((result) => {
                this.authService.hideLoader();
                this.lists =  result; 
                if(this.lists.code==200){
                    this.navCtrl.push(PatientSimptomNextPage);   
                }else{
                    this.presentToast(this.lists.message);
                }
            },(err) => {
                this.authService.hideLoader();
            this.presentToast('Something wrong! Please try later.');
            });
        }
      }else{
        this.presentToast('Oh no! No internet found.');
      }    
  }

  /* Creating toast */
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 10000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    }); 

    toast.present();
  }

  cancle() {
    this.authService.cancle();
    setTimeout(() => {
      if(this.authService.action){
        this.navCtrl.setRoot(DoctorsPage);
      }
    }, 2000);    
  }

  defineSymtoms(){
      this.symtoms =   [
          {
              "code": "abdominal_pains",
              "name": "abdominal pains",
              "shortname": "Abd",
              "translations": {
                  "fr": {
                      "name": "douleurs abdominales",
                      "shortname": "Abd"
                  }
              }
          },
          {
              "code": "articular_pain",
              "synonyms": [
                  "articular pain"
              ],
              "name": "joint pain",
              "shortname": "Jnt",
              "translations": {
                  "fr": {
                      "name": "douleurs articulaires",
                      "shortname": "Art"
                  }
              }
          },
          {
              "code": "back_pain",
              "name": "back ache",
              "shortname": "Bk",
              "translations": {
                  "fr": {
                      "name": "mal au dos",
                      "shortname": "Dos"
                  }
              }
          },
          {
              "code": "bruises",
              "synonyms": [
                  "bruises"
              ],
              "name": "bruising",
              "shortname": "Br",
              "translations": {
                  "fr": {
                      "name": "contusions",
                      "shortname": "Cnt"
                  }
              }
          },
          {
              "code": "cough",
              "name": "cough",
              "shortname": "Co",
              "translations": {
                  "fr": {
                      "name": "toux",
                      "shortname": "To"
                  }
              }
          },
          {
              "code": "diarrhea",
              "synonyms": [
                  "diarrhoea"
              ],
              "name": "diarrhea",
              "shortname": "Dr",
              "translations": {
                  "fr": {
                      "name": "diarrhées",
                      "shortname": "D"
                  }
              }
          },
          {
              "code": "difficulty_breathing",
              "name": "difficulty breathing",
              "shortname": "Br",
              "translations": {
                  "fr": {
                      "name": "difficulté à réspirer",
                      "shortname": "Re"
                  }
              }
          },
          {
              "code": "difficulty_swallowing",
              "name": "difficulty swallowing",
              "shortname": "Sw",
              "translations": {
                  "fr": {
                      "name": "difficultés à avaler",
                      "shortname": "Av"
                  }
              }
          },
          {
              "code": "fever",
              "name": "fever",
              "shortname": "Fv",
              "translations": {
                  "fr": {
                      "name": "fièvre",
                      "shortname": "Fvr"
                  }
              }
          },
          {
              "code": "headache",
              "name": "headache",
              "shortname": "Ha",
              "translations": {
                  "fr": {
                      "name": "maux de tête",
                      "shortname": "Te"
                  }
              }
          },
          {
              "code": "hiccups",
              "name": "hiccups",
              "shortname": "Hi",
              "translations": {
                  "fr": {
                      "name": "hoquet",
                      "shortname": "Ho"
                  }
              }
          },
          {
              "code": "intense_fatigue",
              "name": "intense fatigue or weakness",
              "synonyms": [
                  "malaise",
                  "weakness"
              ],
              "shortname": "Wk",
              "translations": {
                  "fr": {
                      "name": "fatigue générale intense",
                      "shortname": "Fat"
                  }
              }
          },
          {
              "code": "jaundice",
              "name": "jaundice",
              "synonyms": [
                  "yellowing"
              ],
              "shortname": "Jnd",
              "translations": {
                  "fr": {
                      "name": "ictère",
                      "shortname": "Ict"
                  }
              }
          },
          {
              "code": "loss_of_appetite",
              "name": "loss of appetite",
              "shortname": "Ap",
              "translations": {
                  "fr": {
                      "name": "perte d'appétit / anorexie",
                      "shortname": "Ap"
                  }
              }
          },
          {
              "code": "muscular_pain",
              "synonyms": [
                  "muscular pain"
              ],
              "name": "muscles or joints",
              "shortname": "Msc",
              "translations": {
                  "fr": {
                      "name": "douleurs musculaires",
                      "shortname": "Mu"
                  }
              }
          },
          {
              "code": "nausea_vomiting",
              "name": "nausea vomiting",
              "shortname": "Vm",
              "translations": {
                  "fr": {
                      "name": "nausées / vomissements",
                      "shortname": "V"
                  }
              }
          },
          {
              "code": "neck_rigidity",
              "synonyms": [
                  "neck stiffness"
              ],
              "name": "neck rigidity",
              "shortname": "Nk",
              "translations": {
                  "fr": {
                      "name": "raideur de la nuque",
                      "shortname": "Nq"
                  }
              }
          },
          {
              "code": "sore_throat",
              "synonyms": [
                  "pharyngitis"
              ],
              "name": "sore throat or swallowing",
              "shortname": "St",
              "translations": {
                  "fr": {
                      "name": "mal à la gorge",
                      "shortname": "Ph"
                  }
              }
          },
          {
              "code": "thoracic_pain",
              "synonyms": [
                  "thoracic pain"
              ],
              "name": "chest pain",
              "shortname": "Chs",
              "translations": {
                  "fr": {
                      "name": "douleurs thoraciques",
                      "shortname": "Tho"
                  }
              }
          },
          {
              "code": "unexplained_bleedings",
              "synonyms": [
                  "haemorrhagic"
              ],
              "name": "unexplained bleedings",
              "shortname": "Bl",
              "translations": {
                  "fr": {
                      "name": "saignement inexpliqué",
                      "shortname": "Hem"
                  }
              }
          },
          {
              "code": "rash",
              "name": "rash",
              "synonyms": [
                  "maculopapular"
              ],
              "description": "Post-viral rash. This is the type of rash that some patients presenting with EbolaZaire hemorrhagic (EBO-Z) fever will reveal but can be hard to see on dark skin people",
              "shortname": "Ra",
              "translations": {
                  "fr": {
                      "name": "éruption cutanée",
                      "shortname": "Er"
                  }
              }
          },
          {
              "code": "red_eyes",
              "name": "red eyes",
              "shortname": "Re",
              "translations": {
                  "fr": {
                      "name": "yeux rouges",
                      "shortname": "Yr"
                  }
              }
          },
          {
              "code": "other_symptoms",
              "name": "other symptoms",
              "shortname": "Oth",
              "translations": {
                  "fr": {
                      "name": "autres symptômes",
                      "shortname": "Autres"
                  }
              }
          }
      ];
  
  }

}
