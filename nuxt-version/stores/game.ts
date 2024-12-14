import { defineStore } from 'pinia'
import type { Word, WordAttempt } from '~/types'

export const useGameStore = defineStore('game', {
  state: () => ({
    currentWord: null as Word | null,
    score: 0,
    attempts: 0,
    currentLetterIndex: 0,
    startTime: null as number | null
  }),

  actions: {
    async loadNewWord() {
      const { data } = await useFetch('/api/words')
      this.currentWord = data.value?.[0] as Word
      this.currentLetterIndex = 0
      this.attempts = 0
      this.startTime = Date.now()
    },

    async submitAttempt(attempt: WordAttempt) {
      await useFetch('/api/words/attempts', {
        method: 'POST',
        body: attempt
      })
      this.score += attempt.points
    },

    calculatePoints(timeTaken: number, attempts: number): number {
      const basePoints = 100
      const timeDeduction = Math.floor(timeTaken / 5) * 10
      const attemptDeduction = (attempts - 1) * 15
      return Math.max(basePoints - timeDeduction - attemptDeduction, 10)
    }
  }
})