import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Word, WordAttempt } from '../models/word.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  private apiUrl = `${environment.apiUrl}/words`;

  constructor(private http: HttpClient) {}

  getWords(difficulty?: number): Observable<Word[]> {
    const params = difficulty ? { difficulty: difficulty.toString() } : {};
    return this.http.get<Word[]>(this.apiUrl, { params });
  }

  submitAttempt(attempt: WordAttempt): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/attempts`, attempt);
  }
}