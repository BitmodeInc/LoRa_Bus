import hkdf from "@panva/hkdf";
import { calculateJwkThumbprint, base64url, EncryptJWT, jwtDecrypt } from "jose";
import { ACCESS_TOKEN_SECRET_KEY, SECRET_SALT, ACCESS_TOKEN_MAX_AGE } from "../config";
import { AccessTokenPayload } from "../types/jwt";

type Digest = Parameters<typeof calculateJwkThumbprint>[1];

const alg = "dir";
const enc = "A256CBC-HS512";
const salt = SECRET_SALT;

let secret: Uint8Array;
let thumbprint: string;

const initializeEncryptionSecret = async () => {
    if (!secret) {
        secret = await hkdf(
            "sha512",
            ACCESS_TOKEN_SECRET_KEY,
            salt,
            `User_Service at ExamCheckingProject Generated Encryption Key (${salt})`,
            64,
        );
        thumbprint = await calculateJwkThumbprint(
            { kty: "oct", k: base64url.encode(secret) },
            `sha${secret.byteLength << 3}` as Digest,
        );
    }
};

export const jwtEncode = async (token: AccessTokenPayload) => {
    await initializeEncryptionSecret();
    return await new EncryptJWT(token)
        .setProtectedHeader({ alg, enc, kid: thumbprint })
        .setIssuedAt()
        .setExpirationTime(Date.now() / 1000 + ACCESS_TOKEN_MAX_AGE / 1000)
        .setJti(crypto.randomUUID())
        .encrypt(secret);
};

export const jwtDecode = async (token: string) => {
    if (!token) return null;
    await initializeEncryptionSecret();
    try {
        const { payload } = await jwtDecrypt(
            token,
            async ({ kid, enc }) => {
                if (kid === undefined || kid === thumbprint) return secret;
                throw new Error("no matching decryption secret");
            },
            {
                clockTolerance: 15,
                keyManagementAlgorithms: [alg],
                contentEncryptionAlgorithms: [enc],
            },
        );
        return payload as AccessTokenPayload;
    } catch (error) {
        return null;
    }
};
