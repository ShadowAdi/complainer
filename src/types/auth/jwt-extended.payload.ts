import jwt, { JwtPayload } from "jsonwebtoken";

export interface JwtUserPayload extends JwtPayload {
  username: string;
  id: string;
}