import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioContext: AudioContext;
  private oscillator: OscillatorNode | null = null;

  constructor() {
    this.audioContext = new AudioContext();
  }

  playLetterSound(letter: string): void {
    // Map letters to frequencies (simple mapping for demonstration)
    const baseFrequency = 440; // A4 note
    const letterCode = letter.toLowerCase().charCodeAt(0) - 97;
    const frequency = baseFrequency * Math.pow(2, letterCode / 12);

    this.oscillator?.stop();
    this.oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    this.oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);

    this.oscillator.start();
    this.oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  playSuccessSound(): void {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(587.33, this.audioContext.currentTime); // D5
    gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }
}