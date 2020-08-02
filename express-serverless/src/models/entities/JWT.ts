import { IJWT } from "../../interfaces/IJWT"

export class JWT implements IJWT{
    constructor(userId: string, email: string){
        this.exp = Math.floor(Date.now() / 1000) + (60 * 1);
        this.sub = userId;
        this.email = email;
        this.iat = Math.floor(Date.now() / 1000);
    }
    
    iat: number;
    exp: number;
    sub: string;
    email: string;

}