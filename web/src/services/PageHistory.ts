import { Service } from "typedi";

@Service()
export class PageHistory{
    private pages: string[] = [];
    public length: number = 0;

    constructor(){
        this.load()
    }

    push(page: string){
        this.pages.push(page)
        if(this.pages.length > 20){
            this.pages = this.pages.slice(this.pages.length - 20)
        }
        this.length = this.pages.length
        
        this.save()
    }

    get(index: number){
        return this.pages[index]
    }

    private save(){
        localStorage.setItem('pageHistory', JSON.stringify(this))
    }

    public load(){
        const localStorageHistory = localStorage.getItem('pageHistory')
        if (localStorageHistory) {
            const history = JSON.parse(localStorageHistory);
            this.pages = history.pages;
            this.length = this.pages.length;
        }
    }

}