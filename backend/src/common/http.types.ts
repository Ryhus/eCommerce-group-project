import type { Request } from "express";

export interface AccessUser {
  id: string;
  email: string;
}

export interface AppRequest extends Request {
  id: string;
  user?: AccessUser;
}
