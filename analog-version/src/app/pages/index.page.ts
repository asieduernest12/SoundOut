import { Component, OnInit } from '@angular/core';
import { WordService } from '../core/services/word.service';
import { AudioService } from '../core/services/audio.service';
import { Word, WordAttempt } from '../core/models/word.model';

@Component({
  selector: 'app-game',
  standalone: true,
  template: `
    <div class="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 py-8">
      <div class="container mx-auto px-4">
        <!-- Score Display -->
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-purple-800">Score: {{ score }}</h2>
        </div>

        <!-- Word Display -->
        <div class="bg-white rounded-lg shadow-lg p-8 mb-8 max-w-2xl mx-auto">
          <div class="flex justify-center space-x-4">
            <div *ngFor="let letter of currentWord?.word.split(''); let i = index"
                 class="w-16 h-16 flex items-center justify-center text-3xl font-bold rounded-lg"
                 [ngClass]="{'bg-green-200': i < currentLetterIndex, 'bg-gray-100': i >= currentLetterIndex}">
              {{ letter }}
            </div>
          </div>
          
          <!-- Phonetic Spelling -->
          <div class="text-center mt-4 text-gray-600">
            {{ currentWord?.phoneticSpelling }}
          </div>
        </div>

        <!-- Letter Buttons -->
        <div class="grid grid-cols-7 gap-2 max-w-3xl mx-auto">
          <button *ngFor="let letter of letters"
                  (click)="onLetterClick(letter)"
                  class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-6 rounded-lg transition-colors">
            {{ letter }}
          </button>
        </div>

        <!-- Attempts Counter -->
        <div class="text-center mt-8 text-gray-600">
          Attempts: {{ attempts }}
        </div>
      </div>
    </div>
  `,
  imports: [
    CommonModule
  ]
})
export default class GamePage implements OnInit {
  currentWord: Word | null = null;
  currentLetterIndex = 0;
  attempts = 0;
  startTime: number | null = null;
  score = 0;
  letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  constructor(
    private wordService: WordService,
    private audioService: AudioService
  ) {}

  ngOnInit(): void {
    this.loadNewWord();
  }

  private loadNewWord(): void {
    this.wordService.getWords().subscribe(words => {
      this.currentWord = words[0];
      this.currentLetterIndex = 0;
      this.attempts = 0;
      this.startTime = Date.now();
    });
  }

  onLetterClick(letter: string): void {
    if (!this.currentWord) return;

    const correctLetter = this.currentWord.word[this.currentLetterIndex].toLowerCase();
    if (letter.toLowerCase() === correctLetter) {
      this.audioService.playLetterSound(letter);
      this.currentLetterIndex++;

      if (this.currentLetterIndex === this.currentWord.word.length) {
        this.handleWordCompletion();
      }
    } else {
      this.attempts++;
    }
  }

  private handleWordCompletion(): void {
    if (!this.currentWord || !this.startTime) return;

    const timeTaken = Math.floor((Date.now() - this.startTime) / 1000);
    const points = this.calculatePoints(timeTaken, this.attempts);

    const attempt: WordAttempt = {
      wordId: this.currentWord.id,
      attempts: this.attempts,
      timeTaken,
      points
    };

    this.wordService.submitAttempt(attempt).subscribe(() => {
      this.score += points;
      this.audioService.playSuccessSound();
      this.loadNewWord();
    });
  }

  private calculatePoints(timeTaken: number, attempts: number): number {
    const basePoints = 100;
    const timeDeduction = Math.floor(timeTaken / 5) * 10;
    const attemptDeduction = (attempts - 1) * 15;
    return Math.max(basePoints - timeDeduction - attemptDeduction, 10);
  }
}