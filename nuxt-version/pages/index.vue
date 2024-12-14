<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 py-8">
    <div class="container mx-auto px-4">
      <!-- Score Display -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-purple-800">Score: {{ gameStore.score }}</h2>
      </div>

      <!-- Word Display -->
      <div class="bg-white rounded-lg shadow-lg p-8 mb-8 max-w-2xl mx-auto">
        <div class="flex justify-center space-x-4">
          <div v-for="(letter, i) in gameStore.currentWord?.word.split('')" 
               :key="i"
               class="w-16 h-16 flex items-center justify-center text-3xl font-bold rounded-lg"
               :class="{'bg-green-200': i < gameStore.currentLetterIndex, 'bg-gray-100': i >= gameStore.currentLetterIndex}">
            {{ letter }}
          </div>
        </div>
        
        <!-- Phonetic Spelling -->
        <div class="text-center mt-4 text-gray-600">
          {{ gameStore.currentWord?.phoneticSpelling }}
        </div>
      </div>

      <!-- Letter Buttons -->
      <div class="grid grid-cols-7 gap-2 max-w-3xl mx-auto">
        <UButton v-for="letter in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')"
                :key="letter"
                @click="handleLetterClick(letter)"
                color="purple"
                variant="solid">
          {{ letter }}
        </UButton>
      </div>

      <!-- Attempts Counter -->
      <div class="text-center mt-8 text-gray-600">
        Attempts: {{ gameStore.attempts }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const gameStore = useGameStore()
const audio = useAudio()

onMounted(() => {
  gameStore.loadNewWord()
})

const handleLetterClick = (letter: string) => {
  if (!gameStore.currentWord) return

  const correctLetter = gameStore.currentWord.word[gameStore.currentLetterIndex].toLowerCase()
  
  if (letter.toLowerCase() === correctLetter) {
    audio.playLetterSound(letter)
    gameStore.currentLetterIndex++

    if (gameStore.currentLetterIndex === gameStore.currentWord.word.length) {
      handleWordCompletion()
    }
  } else {
    gameStore.attempts++
  }
}

const handleWordCompletion = async () => {
  if (!gameStore.currentWord || !gameStore.startTime) return

  const timeTaken = Math.floor((Date.now() - gameStore.startTime) / 1000)
  const points = gameStore.calculatePoints(timeTaken, gameStore.attempts)

  await gameStore.submitAttempt({
    wordId: gameStore.currentWord.id,
    attempts: gameStore.attempts,
    timeTaken,
    points
  })

  audio.playSuccessSound()
  gameStore.loadNewWord()
}
</script>