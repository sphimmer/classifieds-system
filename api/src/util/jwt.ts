import jwt, { decode, verify } from 'jsonwebtoken';
import { IUser } from '../interfaces/IUser';
import { JWT } from '../models/entities/JWT';

export const createJWT = (user: IUser): string => {
    const jwtObj = new JWT(user.id, user.email)
    
    return jwt.sign(JSON.stringify(jwtObj), process.env.JWT_SECRET);
}

export const checkJWT = (jwt: string): string | object => {
    return verify(jwt, process.env.JWT_SECRET);
}

export const decodeJWT = (encodedJWT: string): JWT => {
    const decodedJWT: JWT = decode(encodedJWT) as JWT;
    return decodedJWT;
} 
