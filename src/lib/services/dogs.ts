import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { dogs, type Dog } from "@/lib/db/schema";
import type {
  AvailableTime,
  DogSubject,
  LifeStage,
  TrainingExperience,
} from "@/lib/domains/dog-training";

const LIFE_STAGES: LifeStage[] = [
  "young_puppy",
  "older_puppy",
  "adolescent",
  "adult",
  "senior",
];

const AVAILABLE_TIMES: AvailableTime[] = ["few_minutes", "about_10", "more"];

const TRAINING_EXPERIENCE: TrainingExperience[] = ["new", "some"];

export const DEFAULT_DOG_PROFILE = {
  name: "your dog",
  lifeStage: "adult" as LifeStage,
  primaryReason: "Everyday manners and a calmer life together",
  availableTime: "about_10" as AvailableTime,
  trainingExperience: "new" as TrainingExperience,
};

/** Primary dog profile for an owner (MVP: one dog per account). */
export function getDogForOwner(ownerId: string): Dog | undefined {
  return db.select().from(dogs).where(eq(dogs.ownerId, ownerId)).get();
}

function asLifeStage(value: string | null | undefined): LifeStage {
  if (value && (LIFE_STAGES as string[]).includes(value)) {
    return value as LifeStage;
  }
  return DEFAULT_DOG_PROFILE.lifeStage;
}

function asAvailableTime(value: string | null | undefined): AvailableTime {
  if (value && (AVAILABLE_TIMES as string[]).includes(value)) {
    return value as AvailableTime;
  }
  return DEFAULT_DOG_PROFILE.availableTime;
}

function asTrainingExperience(value: string | null | undefined): TrainingExperience {
  if (value && (TRAINING_EXPERIENCE as string[]).includes(value)) {
    return value as TrainingExperience;
  }
  return DEFAULT_DOG_PROFILE.trainingExperience;
}

/**
 * Map a stored dog row to a coaching subject, filling soft defaults when
 * fields are blank or unexpected so plan generation never crashes on sparse
 * guest / incomplete profiles.
 */
export function toDogSubject(dog: Dog): DogSubject {
  const name = dog.name?.trim() || DEFAULT_DOG_PROFILE.name;
  const primaryReason =
    dog.primaryReason?.trim() || DEFAULT_DOG_PROFILE.primaryReason;

  return {
    id: dog.id,
    name,
    lifeStage: asLifeStage(dog.lifeStage),
    availableTime: asAvailableTime(dog.availableTime),
    primaryReason,
    trainingExperience: asTrainingExperience(dog.trainingExperience),
  };
}
