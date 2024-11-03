import { JWTPayload } from "jose";

export interface AccessTokenPayload extends JWTPayload {
    id: number;
}
