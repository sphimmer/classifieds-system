import { decode, verify } from 'jsonwebtoken';
import Axios from 'axios';
import { IJwks } from '../interfaces/IJwks';
import { IJWT } from '../interfaces/IJWT';
import jwkToPem from 'jwk-to-pem';
import { UnauthorizedError } from '../errors/UnauthorizedError';

export const verifyCognitoJwt = async (cognitoJwt: string): Promise<IJWT> => {
    const decodedJWT = decode(cognitoJwt, {complete: true}) as any;
    const response = await Axios.get<IJwks>(process.env.JWKS);
    const jwk = response.data.keys.filter((jwk) => {
        return jwk.kid === decodedJWT.header.kid;
    });
    const pem = jwkToPem({kty: 'RSA', n: jwk[0].n, e: jwk[0].e, });
    try {
        const verifiedJwt = verify(cognitoJwt, pem);
        return verifiedJwt as IJWT;
    } catch (error) {
        console.error(error);
        return null;
    }
}