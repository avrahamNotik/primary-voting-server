import { eq } from "drizzle-orm";

import { db } from "../db";
import { elections } from "../db/schema";

export const getAllElections = async () => {
  return db.select().from(elections);
};

export const getElectionById = async (id: string) => {
  const [election] = await db
    .select()
    .from(elections)
    .where(eq(elections.id, id))
    .limit(1);

  return election;
};

export const createElection = async (data: {
  partyId: string;
  startDate: Date;
  endDate: Date;
  maxCandidatesToSelect: number;
}) => {
  const [election] = await db.insert(elections).values(data).returning();

  return election;
};

export const updateElection = async (
  id: string,
  data: Partial<{
    partyId: string;
    startDate: Date;
    endDate: Date;
    maxCandidatesToSelect: number;
  }>,
) => {
  const [election] = await db
    .update(elections)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(elections.id, id))
    .returning();

  return election;
};

export const deleteElection = async (id: string) => {
  const [election] = await db
    .delete(elections)
    .where(eq(elections.id, id))
    .returning();

  return election;
};
