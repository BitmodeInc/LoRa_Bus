import "jose";

declare module "jose" {
  export interface JWTPayload {
    adminId: number;
    // role: number;
  }
}
