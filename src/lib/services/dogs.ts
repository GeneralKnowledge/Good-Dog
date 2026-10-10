import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { dogs, type Dog } from "@/lib/db/schema";

/** Primary dog profile for an owner (MVP: one dog per account). */
export function getDogForOwner(ownerId: string): Dog | undefined {
  return db.select().from(dogs).where(eq(dogs.ownerId, ownerId)).get();
}
