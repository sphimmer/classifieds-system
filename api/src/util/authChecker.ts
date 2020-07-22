import { checkJWT } from "./jwt";
import { AuthenticationError } from "apollo-server-koa";

export const authChecker = ({root, args, context, info}, roles): boolean => {
    const token = context.token;
    try {
        const verified = checkJWT(token)
        return true;
        
    } catch (error) {
        throw new AuthenticationError('Invalid token. Please log in again.')
    }    
}