import { and, eq, inArray } from "drizzle-orm";

import { db } from "../db";
import { candidates, elections, electionVoters, votes } from "../db/schema";

export const submitVote = async (
  electionId: string,
  voterId: string,
  candidateIds: string[],
) => {
  // מביאים את הבחירות
  const [election] = await db
    .select()
    .from(elections)
    .where(eq(elections.id, electionId))
    .limit(1);

  if (!election) {
    throw new Error("ELECTION_NOT_FOUND");
  }

  const now = new Date();

  if (now < election.startDate || now > election.endDate) {
    throw new Error("ELECTION_NOT_ACTIVE");
  }

  // בודקים שהמשתמש רשאי להצביע
  const [voter] = await db
    .select()
    .from(electionVoters)
    .where(
      and(
        eq(electionVoters.electionId, electionId),
        eq(electionVoters.userId, voterId),
      ),
    )
    .limit(1);

  if (!voter) {
    throw new Error("VOTER_NOT_ELIGIBLE");
  }

  if (voter.hasVoted) {
    throw new Error("ALREADY_VOTED");
  }

  // לפחות מועמד אחד
  if (candidateIds.length === 0) {
    throw new Error("NO_CANDIDATES_SELECTED");
  }

  // אי אפשר לבחור יותר מהמקסימום
  if (candidateIds.length > election.maxCandidatesToSelect) {
    throw new Error("TOO_MANY_CANDIDATES");
  }

  // מונע שליחה כפולה של אותו candidateId
  const uniqueCandidateIds = [...new Set(candidateIds)];

  if (uniqueCandidateIds.length !== candidateIds.length) {
    throw new Error("DUPLICATE_CANDIDATES");
  }

  // בודקים שכל המועמדים קיימים, פעילים ושייכים למפלגת הבחירות
  const activeCandidates = await db
    .select({
      id: candidates.id,
    })
    .from(candidates)
    .where(
      and(
        inArray(candidates.id, uniqueCandidateIds),
        eq(candidates.partyId, election.partyId),
        eq(candidates.status, "active"),
      ),
    );

  if (activeCandidates.length !== uniqueCandidateIds.length) {
    throw new Error("INVALID_CANDIDATES");
  }

  // שומרים את ההצבעות
  await db.insert(votes).values(
    uniqueCandidateIds.map((candidateId) => ({
      electionId,
      voterId,
      candidateId,
    })),
  );

  // מסמנים שהמשתמש כבר הצביע
  const [updatedVoter] = await db
    .update(electionVoters)
    .set({
      hasVoted: true,
      votedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(electionVoters.electionId, electionId),
        eq(electionVoters.userId, voterId),
      ),
    )
    .returning();

  return updatedVoter;
};
