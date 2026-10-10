import type { WhyTodayInput } from "@/lib/coaching";

export function explainPlanItem(input: WhyTodayInput): string {
  const {
    subjectName: dogName,
    role,
    preferredEasier,
    preferredHarder,
    isStarter,
    skillState,
  } = input;

  if (preferredEasier) {
    return `Let’s make this easier today and build up gradually with ${dogName}.`;
  }

  if (preferredHarder) {
    return `You’ve had some good practice with this skill, so we’re trying a tiny step forward.`;
  }

  if (isStarter && role === "engage") {
    return `A gentle warm-up to help ${dogName} tune in.`;
  }

  if (role === "everyday") {
    return `An easy activity that fits naturally into home life with ${dogName}.`;
  }

  if (skillState === "becoming_consistent") {
    return `We’re keeping this one steady so ${dogName} can build confidence.`;
  }

  if (skillState === "practising" || skillState === "introduced") {
    return `Useful practice for a skill you’re working on with ${dogName}.`;
  }

  if (role === "engage") {
    return `A short, friendly start to today’s session.`;
  }

  return `A practical next step for ${dogName} today.`;
}
