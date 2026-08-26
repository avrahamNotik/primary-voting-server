import { eq } from "drizzle-orm";

import { deleteFile } from "./fileService";

import { db } from "../db";
import { candidates } from "../db/schema";

export const getAllCandidates = async () => {
  return db.select().from(candidates);
};

export const getCandidateById = async (id: string) => {
  const [candidate] = await db
    .select()
    .from(candidates)
    .where(eq(candidates.id, id))
    .limit(1);

  return candidate;
};

export const createCandidate = async (data: {
  userId: string;
  partyId: string;
  slogan: string;
  description: string;
  imageUrl?: string;
  platformPdfUrl?: string;
}) => {
  const [candidate] = await db.insert(candidates).values(data).returning();

  return candidate;
};

export const updateCandidate = async (
  id: string,
  data: Partial<{
    slogan: string;
    description: string;
    imageUrl: string;
    platformPdfUrl: string;
  }>,
) => {
  // מביאים את המועמד לפני העדכון
  const existingCandidate = await getCandidateById(id);

  if (!existingCandidate) {
    return undefined;
  }

  // מעדכנים את ה-DB קודם
  const [candidate] = await db
    .update(candidates)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(candidates.id, id))
    .returning();

  if (!candidate) {
    return undefined;
  }

  // אם הועלתה תמונה חדשה - מוחקים את הישנה
  if (data.imageUrl && data.imageUrl !== existingCandidate.imageUrl) {
    await deleteFile(existingCandidate.imageUrl);
  }

  // אם הועלה PDF חדש - מוחקים את הישן
  if (
    data.platformPdfUrl &&
    data.platformPdfUrl !== existingCandidate.platformPdfUrl
  ) {
    await deleteFile(existingCandidate.platformPdfUrl);
  }

  return candidate;
};

export const rejectCandidate = async (id: string) => {
  const [candidate] = await db
    .update(candidates)
    .set({
      status: "rejected",
      updatedAt: new Date(),
    })
    .where(eq(candidates.id, id))
    .returning();

  return candidate;
};

export const restoreCandidate = async (id: string) => {
  const [candidate] = await db
    .update(candidates)
    .set({
      status: "active",
      updatedAt: new Date(),
    })
    .where(eq(candidates.id, id))
    .returning();

  return candidate;
};

export const deleteCandidate = async (id: string) => {
  const [candidate] = await db
    .delete(candidates)
    .where(eq(candidates.id, id))
    .returning();

  return candidate;
};
