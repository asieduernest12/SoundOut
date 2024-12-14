import { Component, OnInit } from '@angular/core';
import { WordService } from '../../core/services/word.service';
import { AudioService } from '../../core/services/audio.service';
import { Word, WordAttempt } from '../../core/models/word.model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  currentWord: Word | null = null;
  currentLetterIndex = 0;
  attempts = 0;
  startTime: number | null = null;
  score = 0;

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