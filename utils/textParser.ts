/**
 * Parse text into words and track sentence boundaries
 */

export interface ParsedContent {
  words: string[];
  sentences: string[];
  title: string;
  wordCount: number;
}

/**
 * Split text into individual words, preserving punctuation attached to words
 */
export function splitIntoWords(text: string): string[] {
  return text
    .split(/\s+/)
    .map(word => word.trim())
    .filter(word => word.length > 0);
}

/**
 * Split text into sentences
 */
export function splitIntoSentences(text: string): string[] {
  // Split on sentence-ending punctuation followed by space or end
  return text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

/**
 * Find which sentence a word index belongs to
 */
export function findSentenceForWordIndex(
  wordIndex: number,
  words: string[],
  sentences: string[]
): number {
  let currentWordCount = 0;

  for (let i = 0; i < sentences.length; i++) {
    const sentenceWords = splitIntoWords(sentences[i]);
    currentWordCount += sentenceWords.length;

    if (wordIndex < currentWordCount) {
      return i;
    }
  }

  return sentences.length - 1;
}

/**
 * Get recent context (previous sentences) for a word index
 */
export function getRecentContext(
  wordIndex: number,
  words: string[],
  sentences: string[],
  numSentences: number = 2
): string[] {
  const currentSentenceIndex = findSentenceForWordIndex(wordIndex, words, sentences);
  const startIndex = Math.max(0, currentSentenceIndex - numSentences);

  return sentences.slice(startIndex, currentSentenceIndex + 1);
}

/**
 * Clean and normalize text from web content
 */
export function cleanText(text: string): string {
  return text
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    // Remove extra line breaks
    .replace(/\n+/g, ' ')
    // Trim
    .trim();
}

/**
 * Extract a title from text (first sentence or first N words)
 */
export function extractTitle(text: string, maxWords: number = 8): string {
  const sentences = splitIntoSentences(text);
  if (sentences.length > 0) {
    const firstSentence = sentences[0];
    const words = splitIntoWords(firstSentence);
    if (words.length <= maxWords) {
      return firstSentence;
    }
    return words.slice(0, maxWords).join(' ') + '...';
  }
  return 'Untitled';
}

/**
 * Parse raw text content into structured format
 */
export function parseContent(text: string, title?: string): ParsedContent {
  const cleanedText = cleanText(text);
  const words = splitIntoWords(cleanedText);
  const sentences = splitIntoSentences(cleanedText);

  return {
    words,
    sentences,
    title: title || extractTitle(cleanedText),
    wordCount: words.length,
  };
}
