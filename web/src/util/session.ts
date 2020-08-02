import { ILocalStorage } from "entities/ILocalStorage";
import { verify } from 'jsonwebtoken';
import { APIService } from "api/APIService";
import { AccountService } from "api/AccountService";

export const saveUser = (userObj: ILocalStorage) => {
    clearUserSession();
    localStorage.setItem('user', JSON.stringify(userObj))
}

export const getUser = async (): Promise<ILocalStorage | null> => {
    const storedValue = localStorage.getItem('user');
    
    if (storedValue) {
        const api = new APIService();
        const accountService = new AccountService();
        const publicKey = await api.getPublicJwtKey()
        const user = JSON.parse(storedValue) as ILocalStorage;
        try {
            verify(user.jwt, publicKey);    
            return user;
        } catch (error) {
            console.error(error);
            if(error.name === 'TokenExpiredError'){
                console.log("session expired. refresh!")
                try {
                    const {jwt, freshUser} = await accountService.refreshSession(user.user.refreshToken!, user.jwt)
                    saveUser({jwt: jwt, user: freshUser});
                    return {jwt: jwt, user: freshUser}    
                } catch (error) {
                    console.error(error)
                    clearUserSession();
                    return null;
                }
                
            } else {

                console.error(error)
                clearUserSession();
                return null;
            }
        }
    } else {
        return null;
    }
}

export const clearUserSession = () => {
    localStorage.clear();
}