import bcrypt from "bcrypt";

import { eq } from "drizzle-orm";

import { db } from "../db";
import { users } from "../db/schema";
import { generateAccessToken } from "../config/auth";

interface RegisterUserData {
  givenName: string;
  familyName: string;
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterUserData) => {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const [user] = await db
    .insert(users)
    .values({
      givenName: data.givenName,
      familyName: data.familyName,
      email: data.email,
      passwordHash,
    })
    .returning({
      id: users.id,
      givenName: users.givenName,
      familyName: users.familyName,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatch) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    role: user.role,
  });

  return {
    accessToken,
    user: {
      id: user.id,
      givenName: user.givenName,
      familyName: user.familyName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  };
};

export const getUserById = async (userId: string) => {
  const [user] = await db
    .select({
      id: users.id,
      givenName: users.givenName,
      familyName: users.familyName,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return user;
};
