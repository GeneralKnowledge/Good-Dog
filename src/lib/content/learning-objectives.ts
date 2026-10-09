export interface LearningObjective {
  id: string;
  label: string;
  plainEnglish: string;
}

export const LEARNING_OBJECTIVES: LearningObjective[] = [
  {
    id: "name-response",
    label: "Name response",
    plainEnglish: "Checking in when they hear their name",
  },
  {
    id: "engagement",
    label: "Engagement",
    plainEnglish: "Choosing to pay attention to you",
  },
  {
    id: "reward-marker",
    label: "Reward marker",
    plainEnglish: "Understanding your ‘yes’ word",
  },
  {
    id: "sit",
    label: "Sit",
    plainEnglish: "Sitting comfortably when asked",
  },
  {
    id: "wait",
    label: "Brief wait",
    plainEnglish: "Pausing calmly for a moment",
  },
  {
    id: "mat-settle",
    label: "Mat settling",
    plainEnglish: "Settling on a mat",
  },
  {
    id: "calm-home",
    label: "Calm at home",
    plainEnglish: "Settling quietly around the house",
  },
  {
    id: "handling",
    label: "Comfortable handling",
    plainEnglish: "Being comfortable with gentle touch",
  },
  {
    id: "recall",
    label: "Recall foundations",
    plainEnglish: "Coming back when called",
  },
  {
    id: "lead-walking",
    label: "Lead walking",
    plainEnglish: "Walking more comfortably on lead",
  },
  {
    id: "check-in",
    label: "Check-ins",
    plainEnglish: "Checking in with you on walks",
  },
  {
    id: "leave-it",
    label: "Leave it",
    plainEnglish: "Turning away from mildly interesting things",
  },
  {
    id: "door-manners",
    label: "Door manners",
    plainEnglish: "Staying calm near doorways",
  },
  {
    id: "greetings",
    label: "Calm greetings",
    plainEnglish: "Greeting people more calmly",
  },
  {
    id: "rest-spot",
    label: "Rest spot",
    plainEnglish: "Using a quiet rest place",
  },
  {
    id: "puppy-confidence",
    label: "Everyday confidence",
    plainEnglish: "Getting used to everyday experiences",
  },
];

export function getObjectiveLabel(id: string): string {
  return (
    LEARNING_OBJECTIVES.find((o) => o.id === id)?.plainEnglish ??
    "A useful training skill"
  );
}
