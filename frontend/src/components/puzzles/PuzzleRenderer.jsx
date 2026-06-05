import EmojiSongChallenge  from "./EmojiSongChallenge"
import FinishTheLyrics     from "./FinishTheLyrics"
import LostInTranslation   from "./LostInTranslation"
import PictureTunePuzzle   from "./PictureTunePuzzle"
import RapidFireRound      from "./RapidFireRound"
import BeatMatch           from "./BeatMatch"
import MissingWordLyrics   from "./MissingWordLyrics"
import FiveSecondClip      from "./FiveSecondClip"

// Types that manage their own submission UI (no external answer input)
export const COMPLEX_TYPES = new Set(["beat_match", "rapid_fire", "missing_word"])

export default function PuzzleRenderer({ puzzle, onDirectComplete, timerActive }) {
  if (!puzzle) return null

  const props = { puzzle, timerActive, onDirectComplete }

  switch (puzzle.type) {
    case "emoji_song":        return <EmojiSongChallenge {...props} />
    case "finish_lyrics":     return <FinishTheLyrics {...props} />
    case "lost_translation":  return <LostInTranslation {...props} />
    case "picture_tune":      return <PictureTunePuzzle {...props} />
    case "rapid_fire":        return <RapidFireRound {...props} />
    case "beat_match":        return <BeatMatch {...props} />
    case "missing_word":      return <MissingWordLyrics {...props} />
    case "five_second_clip":  return <FiveSecondClip {...props} />
    default:                  return null
  }
}
