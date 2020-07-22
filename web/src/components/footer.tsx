import * as React from "react";
import { CategoryService } from "../api/CategoryService";
import { Status } from "enums/Status";
import { ICategory } from "entities/ICategory";
import { Logo } from "./Logo";
import { Size } from "enums/Size";

interface IFooterState {
    categories: ICategory[],
    status: Status
}

interface IFooterProps {
    categories: ICategory[]
}


export class Footer extends React.Component<IFooterProps, IFooterState> {
    state: IFooterState;
    constructor(props: IFooterProps){
        super(props);
        if (props.categories.length > 0) {
            this.state = {categories: props.categories, status: Status.LOADED}
        } else {
            this.state = {categories: [], status: Status.LOADING}
        }
        
    }

    categoryService: CategoryService = new CategoryService();
    async componentDidMount () {
        if (this.state.status == Status.LOADING) {
            try {
                const categoryResponse = await this.categoryService.getCategories();
                console.log(categoryResponse);
                this.setState({categories: categoryResponse, status: Status.LOADED})
            } catch (error) {
                console.error(error)
                this.setState({status: Status.FAILED})
            }
        }
    }

    render() {
        if(this.state.status == Status.LOADING){
            return(
                <footer className="main-footer padding-y-lg">
                    <div className="container max-width-lg">
                        <div className="grid gap-lg">
                            <div className="col-3@lg order-1@lg flex@lg justify-front@lg">
                                <a href="#0" className="main-footer__logo">
                                    <svg width="104" height="30" viewBox="0 0 104 30"><title>Go to homepage</title><path d="M37.54 24.08V3.72h4.92v16.37h8.47v4zM60.47 24.37a7.82 7.82 0 01-5.73-2.25 8.36 8.36 0 01-2-5.62 8.32 8.32 0 012.08-5.71 8 8 0 015.64-2.18 8.07 8.07 0 015.68 2.2 8.49 8.49 0 012 5.69 8.63 8.63 0 01-1.78 5.38 7.6 7.6 0 01-5.89 2.49zm0-3.67c2.42 0 2.73-3 2.73-4.23s-.31-4.26-2.73-4.26-2.79 3-2.79 4.26.32 4.23 2.82 4.23zM95.49 24.37a7.82 7.82 0 01-5.73-2.25 8.36 8.36 0 01-2-5.62 8.32 8.32 0 012.08-5.71 8.4 8.4 0 0111.31 0 8.43 8.43 0 012 5.69 8.6 8.6 0 01-1.77 5.38 7.6 7.6 0 01-5.89 2.51zm0-3.67c2.42 0 2.73-3 2.73-4.23s-.31-4.26-2.73-4.26-2.8 3-2.8 4.26.31 4.23 2.83 4.23zM77.66 30c-5.74 0-7-3.25-7.23-4.52l4.6-.26c.41.91 1.17 1.41 2.76 1.41a2.45 2.45 0 002.82-2.53v-2.68a7 7 0 01-1.7 1.75 6.12 6.12 0 01-5.85-.08c-2.41-1.37-3-4.25-3-6.66 0-.89.12-3.67 1.45-5.42a5.67 5.67 0 014.64-2.4c1.2 0 3 .25 4.46 2.82V8.81h4.85v15.33a5.2 5.2 0 01-2.12 4.32A9.92 9.92 0 0177.66 30zm.15-9.66c2.53 0 2.81-2.69 2.81-3.91s-.31-4-2.81-4-2.81 2.8-2.81 4 .27 3.91 2.81 3.91zM55.56 3.72h9.81v2.41h-9.81z" fill="var(--color-contrast-higher)" /><circle cx="15" cy="15" r="15" fill="var(--color-primary)" /></svg>
                                </a>
                            </div>
                            </div>
    
                        <div className="main-footer__colophon border-top padding-top-xs margin-top-lg">
                            <div className="text-sm text-xs@md color-contrast-medium flex gap-xs">
                                <span>&copy; myWebsite</span>
                                <a href="#0" className="color-contrast-high">Terms</a>
                                <a href="#0" className="color-contrast-high">Privacy</a>
                            </div>
    
    
                        </div>
                    </div>
                </footer>
                            
            )
        } else if (this.state.status == Status.LOADED){
            return (
                <footer className="main-footer padding-y-lg">
                    <div className="container max-width-lg">
                        <div className="grid gap-lg">
                            <div className="col-3@lg order-1@lg flex@lg justify-front@lg">
                                <Logo size={Size.lg}/>
                            </div>
    
                            <nav className="col-9@lg order-2@lg">
                                <ul className="grid gap-lg">
                                    <li className="col-6@sm col-3@md">
                                        <h4 className="main-footer__legend">Popular Categories</h4>
                                        {
                                        this.state.categories.map((category)=>{
                                            return <div key={category.id} className="main-footer__item"><a href="#0" className="main-footer__link">{category.name}</a></div>
                                        })
                                        }
                                        
                                    </li>
    
                                    {/* <li className="col-6@sm col-3@md">
                                        <h4 className="main-footer__legend">Developers</h4>
                                        <div className="main-footer__item"><a href="#0" className="main-footer__link">Documentation</a></div>
                                        <div className="main-footer__item"><a href="#0" className="main-footer__link">API reference</a></div>
                                        <div className="main-footer__item"><a href="#0" className="main-footer__link">API status</a></div>
                                        <div className="main-footer__item"><a href="#0" className="main-footer__link">Open source</a></div>
                                    </li>
    
                                    <li className="col-6@sm col-3@md">
                                        <h4 className="main-footer__legend">Resources</h4>
                                        <div className="main-footer__item"><a href="#0" className="main-footer__link">Tutorials</a></div>
                                        <div className="main-footer__item"><a href="#0" className="main-footer__link">Docs</a></div>
                                        <div className="main-footer__item"><a href="#0" className="main-footer__link">Community</a></div>
                                        <div className="main-footer__item"><a href="#0" className="main-footer__link">Case studies</a></div>
                                        <div className="main-footer__item"><a href="#0" className="main-footer__link">Help center</a></div>
                                    </li>*/}
    
                                    <li className="col-6@sm col-3@md">
                                        <h4 className="main-footer__legend">Support</h4>
                                        <div className="main-footer__item"><a href="#0" className="main-footer__link">Contact</a></div>
                                        <div className="main-footer__item"><a href="#0" className="main-footer__link">Bill of Sale Template</a></div>
                                        <div className="main-footer__item"><a href="#0" className="main-footer__link">About</a></div>
                                        <div className="main-footer__item"><a href="#0" className="main-footer__link">Terms of Use</a></div>
                                        
                                    </li> 
                                </ul>
                            </nav>
                        </div>
    
                        <div className="main-footer__colophon border-top padding-top-xs margin-top-lg">
                            <div className="text-sm text-xs@md color-contrast-medium flex gap-xs">
                                <span>&copy; myWebsite</span>
                                <a href="#0" className="color-contrast-high">Terms</a>
                                <a href="#0" className="color-contrast-high">Privacy</a>
                            </div>
    
    
                        </div>
                    </div>
                </footer>
            )
        } else {
            return (
            <footer className="main-footer padding-y-lg">
                    <div className="container max-width-lg">
                        <div className="grid gap-lg">
                            <div className="col-3@lg order-1@lg flex@lg justify-front@lg">
                                <Logo size={Size.lg}/>
                            </div>
                            </div>
    
                        <div className="main-footer__colophon border-top padding-top-xs margin-top-lg">
                            <div className="text-sm text-xs@md color-contrast-medium flex gap-xs">
                                <span>&copy; myWebsite</span>
                                <a href="#0" className="color-contrast-high">Terms</a>
                                <a href="#0" className="color-contrast-high">Privacy</a>
                            </div>
    
    
                        </div>
                    </div>
                </footer>
            )
        }
        
    }
}