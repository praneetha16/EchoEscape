const titleAudio = new Audio("/audio/maestro_title.mp3")

export function playTitleSong() {
  titleAudio.currentTime = 0
  titleAudio.volume = 1
  titleAudio.play().catch(() => {})
}
