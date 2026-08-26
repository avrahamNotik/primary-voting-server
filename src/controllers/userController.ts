import type { Request, Response } from "express";

import { getUserById, loginUser, registerUser } from "../services/userService";
import { AuthRequest } from "../middleware/authMiddleware";

export const registerUserController = async (req: Request, res: Response) => {
  try {
    const { givenName, familyName, email, password, role } = req.body;

    if (!givenName || !familyName || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Missing required fields",
      });

      return;
    }

    if (role && role !== "member" && role !== "candidate") {
      res.status(400).json({
        success: false,
        message: "Invalid role",
      });

      return;
    }

    const user = await registerUser({
      givenName,
      familyName,
      email,
      password,
      role: role ?? "member",
    });

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
      res.status(409).json({
        success: false,
        message: "Email already exists",
      });

      return;
    }

    console.error("Register error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });

      return;
    }

    const result = await loginUser(email, password);

    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      user: result.user,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });

      return;
    }

    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getMeController = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const user = await getUserById(req.user.userId);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      res.status(404).json({
        success: false,
        message: "User not found",
      });

      return;
    }

    console.error("Get me error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logoutUserController = (_req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
