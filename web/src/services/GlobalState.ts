import { Service } from "typedi";
import { v4 as uuidv4 } from 'uuid';

@Service()
export class GlobalState {
    isLoggedIn: boolean = false;
    sessionId: string;
    pageLastVisited?: string;

    constructor(){
        const localStorageState = localStorage.getItem('state')
        if (localStorageState) {
            const state = JSON.parse(localStorageState);
            this.isLoggedIn = state.isLoggedIn;
            this.sessionId = state.sessionId;
        } else {
            this.isLoggedIn = false;
            this.sessionId = uuidv4();
            this.save();
        }
    }

    private save(){
        localStorage.setItem('state', JSON.stringify(this))
    }

    public load(){
        const localStorageState = localStorage.getItem('state')
        if (localStorageState) {
            const state = JSON.parse(localStorageState);
            this.isLoggedIn = state.isLoggedIn;
            this.sessionId = state.sessionId;
        }
    }

    setState(isLoggedIn: boolean, sessionId?: string){
        this.isLoggedIn = isLoggedIn;
        if(sessionId){ 
            this.sessionId = sessionId;
        }
        this.save();
    }
}