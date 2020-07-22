import { ILocalStorage } from "entities/ILocalStorage";

export const saveUser = (userObj: ILocalStorage) => {
    clearUserSession();
    localStorage.setItem('user', JSON.stringify(userObj))
}

export const getUser = (): ILocalStorage | null => {
    const storedValue = localStorage.getItem('user');
    if (storedValue) {
        const user = JSON.parse(storedValue) as ILocalStorage;
        return user;
    } else {
        return null;
    }
}

export const clearUserSession = () => {
    localStorage.clear();
}