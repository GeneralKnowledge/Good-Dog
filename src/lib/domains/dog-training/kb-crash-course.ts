import crashCourseBundle from "./content/kb-import/good-dog-crash-course.json";

export type CrashCourseStage = {
  id: string;
  part: string;
  order: number;
  title: string;
  aim: string;
  lessons: Array<{ lessonId: string; title: string; kind: string }>;
  coverage?: string;
};

const LESSON_EXERCISE_MAP: Record<string, string> = {
  "lesson-intro-marker": "ex-reward-marker",
  "lesson-name-attention": "ex-name-response",
  "lesson-first-sit": "ex-sit-comfort",
  "lesson-down-basics": "ex-down-comfort",
  "lesson-settle-mat": "ex-mat-settle",
  "lesson-stay-basics": "ex-wait-brief",
  "lesson-hand-touch": "ex-kb-hand-touch",
  "lesson-spin-trick": "ex-kb-spin-trick",
  "lesson-recall-basics": "ex-recall-foundation",
  "lesson-emergency-recall": "ex-kb-emergency-recall",
  "lesson-loose-lead": "ex-lead-intro",
  "lesson-leave-it-basics": "ex-leave-it-easy",
  "lesson-rspca-leave": "ex-kb-rspca-leave",
  "lesson-jumping-up": "ex-greeting-calm",
  "lesson-drop-it-swap": "ex-kb-drop-it-swap",
  "lesson-mouthing-redirect": "ex-puppy-mouthing",
};

export function getCrashCourse() {
  return crashCourseBundle;
}

export function getCrashCourseParts() {
  return crashCourseBundle.parts as Array<{ id: string; order: number; title: string }>;
}

export function getCrashCourseStages(): CrashCourseStage[] {
  return crashCourseBundle.stages as CrashCourseStage[];
}

export function getCrashLessonExerciseId(lessonId: string): string | undefined {
  return LESSON_EXERCISE_MAP[lessonId];
}
