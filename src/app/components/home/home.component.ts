import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GeminiAIAPIService } from 'src/app/services/gemini-aiapi.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  userPrompt: string = '';

  // Form field dummy data
  name: string = 'Yadul Manoj';
  email: string = 'yadul.manoj@people10.com';
  educationalPreparation: string =
    "School: Test School, From: July 2019, To: June 2021, Degree: Bachelor's in Computer Science, GPA: 4.0";
  schoolCertificates: string =
    'Physical Education - issued by National Board for Professional Teaching Standards (NBPTS)';
  employmentInformation: string =
    'Position: Senior Software Engineer, Company: Tech Solutions Inc., Location: San Francisco, CA, Employment Period: January 2018 to Present';
  studentTeachingExp: string =
    'Student Teacher, School Name: Lincoln Elementary School, Location: Denver, CO, Grade Level: 4th Grade, Duration: January 2023 to May 2023';
  jobDescription: string =
    'Sunshine Elementary School seeks an energetic 4th Grade Teacher to deliver creative lessons in math, reading, science, and social studies. The role involves planning hands-on activities, adapting instruction for diverse learners, tracking student progress, and fostering a safe, inclusive classroom environment. The teacher will also integrate technology, collaborate with colleagues, and maintain strong communication with parents. A Bachelor’s degree in Elementary Education, a valid Florida teaching certification, and a passion for teaching are required. We offer competitive salary, health benefits, professional development opportunities, and state retirement plan participation.';
  jobSpecificInfo: string =
    "I have four years of experience as a 4th Grade Teacher, where I designed engaging lesson plans with hands-on science experiments, interactive math games, and group reading activities, improving test scores by 15%. I tailored instruction for diverse learners, integrated technology like Google Classroom, and led projects such as 'Environmental Awareness Week' to promote creativity and collaboration. Strong parent communication and teamwork with colleagues helped foster a supportive and inclusive learning environment for all students.";

  // Response from the API
  response: string = "";
  // Error message
  error: string | null = null;
  // Set to true when API is getting executed
  loading: boolean = false;
  // Set to true when Job Specific Infomation is provided
  isChecked: boolean = false;

  constructor(private apiService: GeminiAIAPIService) {}

  ngOnInit(): void {}

  // Called on Generate button click; Call the API to generate response
  onGenerate(): void {
    this.loading = true;
    this.response = "";
    this.error = null;

    this.userPrompt = `
      Provide only the requested content without any introductory or concluding statements. Here is the request:
      Generate a standardized cover letter with the following details summarized and any known details prepopulated:
      Name - ${this.name};
      Email - ${this.email};
      Educational preparation - ${this.educationalPreparation};
      School certificates - ${this.schoolCertificates};
      Employment information - ${this.employmentInformation};
      Student teaching experience - ${this.studentTeachingExp}
      ${
        this.isChecked && this.jobSpecificInfo
          ? `; Job specific information - ${this.jobSpecificInfo}`
          : ''
      }
    `;

    // Remove all the tabs and unwanted spaces
    this.userPrompt = this.userPrompt.replace(/\s+/g, ' ').trim();

    // console.log(this.userPrompt);

    this.apiService.generateResponse(this.userPrompt).subscribe((res: string) => {
        this.response = res;
        this.loading = false;
      },
      (err: HttpErrorResponse) => {
        this.error = 'Failed to generate response. Please try again.';
        this.loading = false;
      },
    );
  }

  // Conditions to disable the Generate button
  disableGenerate(): boolean {
    if (
      this.loading ||
      (this.name &&
        this.email &&
        this.educationalPreparation &&
        this.schoolCertificates &&
        this.employmentInformation &&
        this.studentTeachingExp)
    ) {
      return false;
    } else {
      return true;
    }
  }

  // Save response of the API to a PDF
  savePDF(): void {
    this.openPDFInNewTab(this.response);
  }

  // Generate and open the PDF in a new tab
  openPDFInNewTab(content: string): void {
    const doc = new jsPDF();

    // Add the content to the PDF
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;

    // Split text into lines to avoid text overflow
    const lines = doc.splitTextToSize(content, pageWidth);

    // Add the lines to the document
    doc.text(lines, margin, margin);

    // Generate a Blob from the PDF
    const pdfBlob = doc.output('blob');

    // Create a URL for the Blob and open it in a new tab
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  }
}
