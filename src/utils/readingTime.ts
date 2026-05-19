const WORDS_PER_MINUTE = 220;

export function getReadingTimeMinutes(content: string) {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

export function formatReadingTime(minutes: number) {
  return `${minutes} dk okuma`;
}
