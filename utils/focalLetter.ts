/**
 * Calculate the Optimal Recognition Point (ORP) for a word.
 * This is the letter the eye should focus on for fastest recognition.
 *
 * Research shows the ORP is typically around 1/3 into the word,
 * slightly left of center.
 */
export function getFocalIndex(word: string): number {
  const len = word.length;

  if (len <= 1) return 0;
  if (len <= 3) return 0; // First letter for short words
  if (len <= 5) return 1; // Second letter
  if (len <= 9) return 2; // Third letter
  if (len <= 13) return 3; // Fourth letter
  return Math.floor(len * 0.25); // ~25% into longer words
}

/**
 * Split a word into three parts: before focal, focal letter, after focal
 */
export function splitAtFocal(word: string): {
  before: string;
  focal: string;
  after: string;
} {
  const focalIndex = getFocalIndex(word);
  return {
    before: word.slice(0, focalIndex),
    focal: word[focalIndex] || '',
    after: word.slice(focalIndex + 1),
  };
}
