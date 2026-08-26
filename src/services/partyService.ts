import { eq } from "drizzle-orm";

import { db } from "../db";
import { parties } from "../db/schema";

export const getAllParties = async () => {
  return db.select().from(parties);
};

export const getPartyById = async (id: string) => {
  const [party] = await db
    .select()
    .from(parties)
    .where(eq(parties.id, id))
    .limit(1);

  return party;
};

export const createParty = async (data: {
  name: string;
  slogan: string;
  description: string;
  imageUrl?: string;
  platformPdfUrl?: string;
}) => {
  const [party] = await db.insert(parties).values(data).returning();

  return party;
};

export const updateParty = async (
  id: string,
  data: Partial<{
    name: string;
    slogan: string;
    description: string;
    imageUrl: string;
    platformPdfUrl: string;
  }>,
) => {
  const [party] = await db
    .update(parties)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(parties.id, id))
    .returning();

  return party;
};

export const deleteParty = async (id: string) => {
  const [party] = await db
    .delete(parties)
    .where(eq(parties.id, id))
    .returning();

  return party;
};
