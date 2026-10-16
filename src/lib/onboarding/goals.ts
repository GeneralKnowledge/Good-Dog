export type OnboardingGoalId =
  | "calmer_walks"
  | "recall"
  | "calmer_home"
  | "everyday_manners"
  | "puppy_settle";

export type OnboardingGoal = {
  id: OnboardingGoalId;
  title: string;
  subtitle: string;
  /** Stored on the dog profile; matched by plan policy keywords. */
  primaryReason: string;
  dreamHeadline: string;
  dreamBody: string;
};

export const ONBOARDING_GOALS: OnboardingGoal[] = [
  {
    id: "calmer_walks",
    title: "Calmer walks",
    subtitle: "Less pulling, more connection on the lead",
    primaryReason: "Calmer walks and loose lead walking",
    dreamHeadline: "Walks that feel like a shared stroll, not a tug-of-war",
    dreamBody:
      "Short, reward-based practice builds a dog who checks in with you — and a lead that stays soft more often.",
  },
  {
    id: "recall",
    title: "Reliable recall",
    subtitle: "Coming back when it matters",
    primaryReason: "Recall and come when called outdoors",
    dreamHeadline: "A dog who turns back to you — even when the world is interesting",
    dreamBody:
      "We’ll start with easy wins at home and build trust before asking for more around distractions.",
  },
  {
    id: "calmer_home",
    title: "Calmer at the door",
    subtitle: "Greetings and excitement indoors",
    primaryReason: "Calmer greetings and manners at the door",
    dreamHeadline: "Less chaos when the door goes — more calm in the hallway",
    dreamBody:
      "Small daily reps teach your dog what to do instead of jumping or barging through.",
  },
  {
    id: "everyday_manners",
    title: "Everyday manners",
    subtitle: "The basics that make home life easier",
    primaryReason: "Everyday manners at home",
    dreamHeadline: "A dog who fits more easily into ordinary days",
    dreamBody:
      "Name response, settling, and polite habits — in bites your schedule can actually keep.",
  },
  {
    id: "puppy_settle",
    title: "Help my puppy settle",
    subtitle: "Confidence and calm for young dogs",
    primaryReason: "A calmer puppy who can settle",
    dreamHeadline: "A puppy who learns the world is safe — and rest is allowed",
    dreamBody:
      "Gentle exposure and settle skills, paced for young dogs, without rushing maturity.",
  },
];

export function getOnboardingGoal(id: OnboardingGoalId): OnboardingGoal | undefined {
  return ONBOARDING_GOALS.find((g) => g.id === id);
}
