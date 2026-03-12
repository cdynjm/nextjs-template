import { Session } from "next-auth";
import { User } from "./globals";

export interface AuthSession {
  user: User;
  token?: string;
  expires?: string;
}

export interface AuthProps {
  auth: {
    user: Session["user"];
  };
}