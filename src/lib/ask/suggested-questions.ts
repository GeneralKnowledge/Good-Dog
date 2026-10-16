/** Short prompts for Ask, aligned with today’s exercise category. */
const BY_CATEGORY: Record<string, string[]> = {
  walking: ["My dog pulls on the lead", "Loose lead walking at home"],
  recall: ["Come when called indoors", "Recall when distracted"],
  calm: ["Help my dog settle on a mat", "My dog finds it hard to relax"],
  manners: ["Jumping when people arrive", "Door manners"],
  engagement: ["My dog ignores me outside", "Getting my dog’s attention"],
  confidence: ["My dog is nervous of handling", "Building confidence with new things"],
  puppy: ["Puppy biting and mouthing", "Puppy scared of sounds"],
};

const DEFAULT_SUGGESTIONS = [
  "Everyday manners at home",
  "What if training feels too hard?",
  "When should I get professional help?",
];

export function suggestedAskQuestions(category: string | undefined): string[] {
  if (!category) return DEFAULT_SUGGESTIONS.slice(0, 3);
  const specific = BY_CATEGORY[category];
  if (!specific?.length) return DEFAULT_SUGGESTIONS.slice(0, 3);
  return specific.slice(0, 3);
}
