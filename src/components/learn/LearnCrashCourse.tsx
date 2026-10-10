import Link from "next/link";
import {
  getCrashCourse,
  getCrashCourseParts,
  getCrashCourseStages,
  getCrashLessonExerciseId,
} from "@/lib/domains/dog-training/kb-crash-course";
import { getExerciseById } from "@/lib/domains/dog-training";
import { getGuideByLessonId } from "@/lib/domains/dog-training/kb-import";

export function LearnCrashCourse({ dogId }: { dogId: string }) {
  const course = getCrashCourse();
  const parts = getCrashCourseParts().sort((a, b) => a.order - b.order);
  const stages = getCrashCourseStages().sort((a, b) => a.order - b.order);

  return (
    <section className="mt-4">
      <p className="text-sm leading-relaxed text-muted">{course.summary}</p>
      <p className="mt-2 text-xs text-muted">{course.alignment.disclaimer}</p>
      {parts.map((part) => {
        const partStages = stages.filter((s) => s.part === part.id);
        if (partStages.length === 0) return null;
        return (
          <div key={part.id} className="mt-6">
            <h3 className="heading-subsection">{part.title}</h3>
            <ul className="mt-3 flex flex-col gap-4">
              {partStages.map((stage) => (
                <li key={stage.id} className="rounded-xl border border-line px-3 py-3">
                  <p className="font-semibold">{stage.title}</p>
                  <p className="mt-1 text-sm text-muted">{stage.aim}</p>
                  <ul className="mt-3 flex flex-col gap-2">
                    {stage.lessons.map((lesson) => {
                      const guide = getGuideByLessonId(lesson.lessonId);
                      if (guide) {
                        return (
                          <li key={lesson.lessonId}>
                            <Link
                              href={`/learn/guides/${guide.lessonId}`}
                              className="text-sm font-medium text-brand-deep underline"
                            >
                              {lesson.title} (guide)
                            </Link>
                          </li>
                        );
                      }
                      const exId = getCrashLessonExerciseId(lesson.lessonId);
                      const exercise = exId ? getExerciseById(exId) : undefined;
                      if (exercise) {
                        return (
                          <li key={lesson.lessonId}>
                            <Link
                              href={`/exercise/${exercise.id}?dogId=${dogId}&versionId=${exercise.id}-v${exercise.contentVersion}`}
                              className="text-sm font-medium text-brand-deep underline"
                            >
                              {lesson.title}
                            </Link>
                          </li>
                        );
                      }
                      return (
                        <li key={lesson.lessonId} className="text-sm text-muted">
                          {lesson.title}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
