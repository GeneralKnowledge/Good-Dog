/** Client-only persistence for in-progress exercises (same device). */

export type ExerciseProgressPhase = "guide" | "feedback";

export type ExerciseProgressSnapshot = {
  dogId: string;
  planId: string;
  planItemId: string;
  exerciseId: string;
  phase: ExerciseProgressPhase;
  updatedAt: number;
};

const STORAGE_KEY = "good-dog-exercise-progress-v1";

type ProgressMap = Record<string, ExerciseProgressSnapshot>;

function readMap(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ProgressMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeMap(map: ProgressMap): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function saveExerciseProgress(
  snapshot: Omit<ExerciseProgressSnapshot, "updatedAt">,
): void {
  const map = readMap();
  map[snapshot.planItemId] = { ...snapshot, updatedAt: Date.now() };
  writeMap(map);
}

export function clearExerciseProgress(planItemId: string | undefined): void {
  if (!planItemId || typeof window === "undefined") return;
  const map = readMap();
  if (!map[planItemId]) return;
  delete map[planItemId];
  writeMap(map);
}

export function readExerciseProgress(
  planItemId: string | undefined,
): ExerciseProgressSnapshot | null {
  if (!planItemId) return null;
  return readMap()[planItemId] ?? null;
}

export function readExerciseProgressForPlan(
  planId: string,
): ExerciseProgressSnapshot | null {
  const entries = Object.values(readMap());
  return entries.find((e) => e.planId === planId) ?? null;
}
