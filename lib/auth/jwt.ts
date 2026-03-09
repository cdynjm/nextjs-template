import { SignJWT, JWTPayload } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

interface JwtPayload extends JWTPayload {
  email: string;
}

export async function signJwt(payload: JwtPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}