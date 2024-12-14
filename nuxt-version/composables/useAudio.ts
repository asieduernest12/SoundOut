import { ref } from 'vue'

export const useAudio = () => {
  const audioContext = ref<AudioContext | null>(null)
  const oscillator = ref<OscillatorNode | null>(null)

  const initAudio = () => {
    audioContext.value = new AudioContext()
  }

  const playLetterSound = (letter: string) => {
    if (!audioContext.value) initAudio()
    
    const baseFrequency = 440
    const letterCode = letter.toLowerCase().charCodeAt(0) - 97
    const frequency = baseFrequency * Math.pow(2, letterCode / 12)

    oscillator.value?.stop()
    oscillator.value = audioContext.value!.createOscillator()
    const gainNode = audioContext.value!.createGain()

    oscillator.value.connect(gainNode)
    gainNode.connect(audioContext.value!.destination)

    oscillator.value.frequency.setValueAtTime(frequency, audioContext.value!.currentTime)
    gainNode.gain.setValueAtTime(0.5, audioContext.value!.currentTime)

    oscillator.value.start()
    oscillator.value.stop(audioContext.value!.currentTime + 0.2)
  }

  const playSuccessSound = () => {
    if (!audioContext.value) initAudio()

    const oscillator = audioContext.value!.createOscillator()
    const gainNode = audioContext.value!.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.value!.destination)

    oscillator.frequency.setValueAtTime(587.33, audioContext.value!.currentTime)
    gainNode.gain.setValueAtTime(0.5, audioContext.value!.currentTime)

    oscillator.start()
    oscillator.stop(audioContext.value!.currentTime + 0.5)
  }

  return {
    playLetterSound,
    playSuccessSound
  }
}