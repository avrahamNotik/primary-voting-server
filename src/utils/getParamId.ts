import type { Request } from "express";

export const getParamId = (req: Request): string | null => {
  const { id } = req.params;

  return typeof id === "string" ? id : null;
};
