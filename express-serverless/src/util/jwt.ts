import jwt, { decode, verify } from 'jsonwebtoken';
import { IUser } from '../interfaces/IUser';
import { JWT } from '../models/entities/JWT';
import fs from 'fs';
import cryptoRandomString from 'crypto-random-string';
import path from 'path';

export const createJWT = (user: IUser): string => {
    const jwtObj = new JWT(user.id, user.email)
    const cert = fs.readFileSync(path.join(__dirname, '../../jwtRS256.key'));
    
    return jwt.sign(JSON.stringify(jwtObj), cert.toString(), { algorithm: 'RS256' });
}

export const checkJWT = (jwt: string): string | object => {
    const cert = fs.readFileSync(path.join(__dirname, '../../jwtRS256.key.pub'));
    return verify(jwt, cert.toString());
}

export const decodeJWT = (encodedJWT: string): JWT => {
    const decodedJWT: JWT = decode(encodedJWT) as JWT;
    return decodedJWT;
} 

export const createRefreshToken = (): string => {
    return cryptoRandomString({length: 22})
}