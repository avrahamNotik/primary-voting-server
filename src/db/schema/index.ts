import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "member",
  "candidate",
]);

export const candidateStatusEnum = pgEnum("candidate_status", [
  "active",
  "rejected",
]);

/*
 * =========================
 * Users
 * =========================
 */

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  givenName: text("given_name").notNull(),

  familyName: text("family_name").notNull(),

  email: text("email").notNull().unique(),

  passwordHash: text("password_hash").notNull(),

  role: userRoleEnum("role").notNull().default("member"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

/*
 * =========================
 * Parties
 * =========================
 */

export const parties = pgTable("parties", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),

  slogan: text("slogan").notNull(),

  description: text("description").notNull(),

  imageUrl: text("image_url"),

  platformPdfUrl: text("platform_pdf_url"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

/*
 * =========================
 * Elections
 * =========================
 */

export const elections = pgTable(
  "elections",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    partyId: uuid("party_id")
      .notNull()
      .references(() => parties.id, {
        onDelete: "cascade",
      }),

    startDate: timestamp("start_date", {
      withTimezone: true,
    }).notNull(),

    endDate: timestamp("end_date", {
      withTimezone: true,
    }).notNull(),

    maxCandidatesToSelect: integer("max_candidates_to_select")
      .notNull()
      .default(1),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    partyElectionUnique: unique("party_election_unique").on(table.partyId),
  }),
);

/*
 * =========================
 * Candidates
 * =========================
 */

export const candidates = pgTable(
  "candidates",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    partyId: uuid("party_id")
      .notNull()
      .references(() => parties.id, {
        onDelete: "cascade",
      }),

    slogan: text("slogan").notNull(),

    description: text("description").notNull(),

    imageUrl: text("image_url"),

    platformPdfUrl: text("platform_pdf_url"),

    status: candidateStatusEnum("status").notNull().default("active"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userCandidateUnique: unique("user_candidate_unique").on(table.userId),
  }),
);

/*
 * =========================
 * Election Voters
 * =========================
 *
 * Contains every user who is eligible to vote
 * in a specific election.
 *
 * hasVoted tells us whether the user has already
 * submitted their vote.
 */

export const electionVoters = pgTable(
  "election_voters",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    electionId: uuid("election_id")
      .notNull()
      .references(() => elections.id, {
        onDelete: "cascade",
      }),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    hasVoted: boolean("has_voted").notNull().default(false),

    votedAt: timestamp("voted_at", {
      withTimezone: true,
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    electionUserUnique: unique("election_user_unique").on(
      table.electionId,
      table.userId,
    ),
  }),
);

/*
 * =========================
 * Votes
 * =========================
 *
 * One row represents one candidate selected
 * by one voter in one election.
 */

export const votes = pgTable(
  "votes",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    electionId: uuid("election_id")
      .notNull()
      .references(() => elections.id, {
        onDelete: "cascade",
      }),

    voterId: uuid("voter_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    candidateId: uuid("candidate_id")
      .notNull()
      .references(() => candidates.id, {
        onDelete: "cascade",
      }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    voterCandidateUnique: unique("voter_candidate_unique").on(
      table.electionId,
      table.voterId,
      table.candidateId,
    ),
  }),
);
