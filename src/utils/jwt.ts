import fs from 'fs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ApiError } from './api';
import { HttpStatusCode } from 'axios';
import crypto from 'crypto';

var JWTPublicKey: string = "";
var JWTPrivateKey: string = "";

export function generateECKeyPair() {
    const keyPair = crypto.generateKeyPairSync('ec', {
        namedCurve: 'secp521r1', 
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });
    fs.writeFileSync('jwt.key', keyPair.privateKey,{encoding: 'utf-8'});
    fs.writeFileSync('jwt.key.pub', keyPair.publicKey, {encoding: 'utf-8'});
}

if (!fs.existsSync('jwt.key') || !fs.existsSync('jwt.key.pub')) {
    console.warn("Could not find find jwt.key, generating new key pair...");
    generateECKeyPair();
    console.warn("New ES512 keys have been generated");
}
JWTPublicKey = fs.readFileSync('jwt.key.pub', {encoding: 'utf-8'});
JWTPrivateKey = fs.readFileSync('jwt.key', {encoding: 'utf-8'});



export type AuthTokenPair = {
    "refresh_token": string,
    "resource_token": string
}

export async function createJWTPair(userId: number, jwtid: string): Promise<AuthTokenPair> {
    if (!JWTPrivateKey) throw new Error("Could not sign JWT, due to lack of keys, run 'npm run keygen' to create new keys");
    return new Promise<AuthTokenPair>((resolve, reject)=>{
        // Violation of https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.2 teeheehee
        jwt.sign({sub: userId, use: "REFRESH"}, JWTPrivateKey, {algorithm: 'ES512', expiresIn: "7d", jwtid}, (err, refreshJWT)=>{
            if (err || !refreshJWT) return reject(err);

            jwt.sign({sub: userId, use: "RESOURCE"}, JWTPrivateKey, {algorithm: 'ES512', expiresIn: "2.1m"}, (err, resourceJWT)=>{
                if (err || !resourceJWT) return reject(err);

                resolve({"refresh_token": refreshJWT, "resource_token": resourceJWT});
            });
        });
    })
}

export function verifyRefreshJWT(token?: string): {userId: number, jwtId: string, expires: number} {
    try {
        if (!token || !/^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/.test(token)) throw "";

        var payload = jwt.verify(token, JWTPublicKey, {algorithms: ['ES512']}) as JwtPayload;
        if (typeof payload.sub !== 'number' || typeof payload.jti !== 'string' || typeof payload.exp !== 'number' || payload.use !== "REFRESH") throw "";

        return {userId: payload.sub, jwtId: payload.jti, expires: payload.exp};
    } catch (err) {
        console.error(err);
        throw new ApiError("Invalid Auth Token", HttpStatusCode.Unauthorized);
    }
}

export function verifyResourceJWT(token?: string): number {
    try {
        if (!token || !/^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/.test(token)) throw "";
        
        var payload = jwt.verify(token, JWTPublicKey, {algorithms: ['ES512']}) as JwtPayload;
        if (typeof payload.sub !== 'number' || payload.use !== "RESOURCE") throw "";

        return payload.sub;
    } catch (err) {
        console.error(err);
        throw new ApiError("Invalid Auth Token", HttpStatusCode.Unauthorized);
    }
}