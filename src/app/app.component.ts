import { Component } from '@angular/core';
import { Resume, Experience, Education, Skill } from './resume';
import { ScriptService } from './script.service';
declare let pdfMake: any ;


// const {createCanvas, loadImage} = require('canvas');
// function getImage(url, size) {
//     return loadImage(url).then(image => {
//         const canvas = createCanvas(size, size);
//         let ctx = canvas.getContext('2d');
//         ctx.drawImage(image, 0, 0);
//         return canvas.toDataURL();
//     });
// }

//const imageData =  getImage("../assets/images/logoelitech.png", "10");


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  resume = new Resume();

  degrees = ['B.E.', 'M.E.', 'B.Com', 'M.Com'];

  constructor(private scriptService: ScriptService) {
    this.resume = JSON.parse(sessionStorage.getItem('resume')) || new Resume();
    if (!this.resume.experiences || this.resume.experiences.length === 0) {
      this.resume.experiences = [];
      this.resume.experiences.push(new Experience());
    }
    if (!this.resume.educations || this.resume.educations.length === 0) {
      this.resume.educations = [];
      this.resume.educations.push(new Education());
    }
    if (!this.resume.skills || this.resume.skills.length === 0) {
      this.resume.skills = [];
      this.resume.skills.push(new Skill());
    }

    console.log('Loading External Scripts');
    this.scriptService.load('pdfMake', 'vfsFonts');
  }

  addExperience() {
    this.resume.experiences.push(new Experience());
  }

  addEducation() {
    this.resume.educations.push(new Education());
  }

  generatePdf(action = 'open') {
    console.log(pdfMake);
    const documentDefinition = this.getDocumentDefinition();

    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(); break;

      default: pdfMake.createPdf(documentDefinition).open(); break;
    }

  }


  resetForm() {
    this.resume = new Resume();
  }

  getDocumentDefinition() {
    sessionStorage.setItem('resume', JSON.stringify(this.resume));
    return {

    //   header: function (currentPage, pageCount) {
    //     return {
    //       table: {
    //           body: [
    //               [
    //                 {
    //                   image: 'data:image/jpeg,'+imageData,
    //                   width: 100,
    //                   height: 100,
    //               }
    //               ],
    //           ]
    //       },
    //       layout: 'noBorders'
    //   };
    // },
      footer: function (currentPage, pageCount) {
        return {
         
                
                  columns: [

                    [
                                
                        { text: "ELITECH: 23/25 Rue Jean Jacques Rousseau - 75001 Paris - Tél. +33 1 84258155 - email : info@elitech.fr - site Internet : www.elitech.fr" , margin: [ 85, 10, 30, 0 ] ,fontSize:7 },
                        { text: "SIRET 509 723 607 00016 - RCS PARIS 509 723 607 - SARL au capital de 10.000,00 Euros - N° TVA FR 74 509 723 607 - NAF 6202A" , margin: [ 92, 1, 30, 2 ] ,fontSize:7 },

                        
                      ],
                    ]
                
          
        };
    },

      content: [
        {
          text: this.resume.name,
          bold: true,
          fontSize: 20,
          color: '#445b71',
          alignment: 'center',
          margin: [1, 1, 1, 20]
        },

        

        {
          text: 'Contact :',
          style: 'header',
          color: '#445b71'
        },
        {
          columns: [
            [ {
              text: 'Email : ' + this.resume.email,
            },
            {
              text: 'Téléphone : ' + this.resume.contactNo,
            },
            {
              text: 'Adresse : '+this.resume.address,
              
            },
           
            {
              text: 'GitHub : ' + this.resume.socialProfile,
              link: this.resume.socialProfile,
              
            }
            ],
            [
              this.getProfilePicObject()
            ]
          ]
        },
        {
          text: 'Compétences :',
          style: 'header',
          color: '#445b71'
        },
        {
          columns : [
            {
              ul : [
                ...this.resume.skills.filter((value, index) => index % 3 === 0).map(s => s.value)
              ]
            },
            {
              ul : [
                ...this.resume.skills.filter((value, index) => index % 3 === 1).map(s => s.value)
              ]
            },
            {
              ul : [
                ...this.resume.skills.filter((value, index) => index % 3 === 2).map(s => s.value)
              ]
            }
          ]
        },
        {
          text: 'Expérience',
          style: 'header',
          color: '#445b71'
        },
        this.getExperienceObject(this.resume.experiences),

        {
          text: 'Education',
          style: 'header',
          color: '#445b71'
        },
        this.getEducationObject(this.resume.educations),
        {
          text: '',
          style: 'header'
        },
        {
          text: this.resume.otherDetails
        },
       
       
      ],
      info: {
        title: this.resume.name + '_RESUME',
        author: this.resume.name,
        subject: 'RESUME',
        keywords: 'RESUME, ONLINE RESUME',
      },
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 20, 0, 10],
            decoration: 'underline'
          },
          name: {
            fontSize: 16,
            bold: true
          },
          jobTitle: {
            fontSize: 14,
            bold: true,
            italics: true
          },
          sign: {
            margin: [0, 50, 0, 10],
            alignment: 'right',
            italics: true
          },
          tableHeader: {
            bold: true,
           
          }
        }
    };
  }

  getExperienceObject(experiences: Experience[]) {

    const exs = [];

    experiences.forEach(experience => {
      exs.push(
        [{
          columns: [
            [{
              text: experience.jobTitle,
              style: 'jobTitle'
            },
            {
              text: experience.employer,
            },
            {
              text: experience.jobDescription,
            }],
            {
              text: 'Experience : ' + experience.experience + ' Months',
              alignment: 'right'
            }
          ]
        }]
      );
    });

    return {
      table: {
        widths: ['*'],
        body: [
          ...exs
        ]
      }
    };
  }

  getEducationObject(educations: Education[]) {
    return {
      table: {
        widths: ['*', '*', '*', '*'],
        body: [
          [{
            text: 'Degree',
            style: 'tableHeader'
          },
          {
            text: 'College',
            style: 'tableHeader'
          },
          {
            text: 'Passing Year',
            style: 'tableHeader'
          },
          {
            text: 'Result',
            style: 'tableHeader'
          },
          ],
          ...educations.map(ed => {
            return [ed.degree, ed.college, ed.passingYear, ed.percentage];
          })
        ]
      }
    };
  }

  getProfilePicObject() {
    if (this.resume.profilePic) {
      return {
        image: this.resume.profilePic ,
        width: 75,
        alignment : 'right'
      };
    }
    return null;
  }

  fileChanged(e) {
    const file = e.target.files[0];
    this.getBase64(file);
  }

  getBase64(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      this.resume.profilePic = reader.result as string;
    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }

  addSkill() {
    this.resume.skills.push(new Skill());
  }

}
