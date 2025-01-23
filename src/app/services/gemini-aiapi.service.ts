import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGeneratePayload } from '../interfaces/api-types.interface';

@Injectable({
  providedIn: 'root'
})
export class GeminiAIAPIService {
  private apiUrl = 'http://localhost:5250';

  constructor(private http: HttpClient) {}

  generateResponse(promptString: string): Observable<string> {
    const payload: IGeneratePayload = {
      prompt: promptString,
    };

    return this.http.post(`${this.apiUrl}/GeminiAI/generate`, payload, { responseType: "text" });
  }
}
