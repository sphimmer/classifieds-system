import * as React from "react";
import { SearchBar } from "./searchbar";
import { ICategory } from "entities/ICategory";
import { Logo } from "./Logo";
import { AccountLinks } from "./AccountLinks";
import { Link } from "react-router-dom";
import { ButtonLink } from "./ButtonLink";
import { HeaderSearchField } from "./HeaderSearchField";
import { Size } from "enums/Size";
import { Pages } from "enums/Pages";



interface IHeaderProps {
    categories: ICategory[];
}

export class Header extends React.Component<IHeaderProps> {
    categories: ICategory[];

    constructor(props: IHeaderProps) {
        super(props)
        this.categories = props.categories;
    }

    componentDidMount() {
        let frontEnd = document.createElement('script');
        frontEnd.src = '/static/_2_flexi-headers.js'; // 👈 make sure to use the correct path
        frontEnd.id = '_2_flexi-header';
        document.body.appendChild(frontEnd);
    }

    componentWillUnmount() {
        document.getElementById('_2_flexi-header')!.remove()
    }
    render() {
        return (
            <header className="margin-bottom-md" >
                <div className="container grid text-component max-width-lg">
                    <div className="col-2@md padding-y-xs padding-x-sm">
                        <Logo size={Size.sm}/>
                    </div>
                    <div className="col-3@md header-border padding-top-sm padding-x-sm grid">
                        <HeaderSearchField/>
                    </div>
                    <div className="col-2@md header-border padding-top-sm padding-x-sm grid">
                        <a href="#0" className="f-header__link">
                            <span>Categories</span>
                            <svg className="f-header__dropdown-icon icon" aria-hidden="true" viewBox="0 0 12 12">
                                <path d="M6,9l4-5H2Z" /></svg>
                        </a>

                        <ul className="f-header__dropdown">
                            {this.categories.map((category) => {
                                return <li key={category.id}><a href="#0" className="f-header__dropdown-link">{category.name}</a></li>
                            })}

                        </ul>
                    </div>
                    <div className="col-2@md padding-top-sm header-border padding-x-sm grid">
                        <Link to={Pages.CREATE_LISTING} className="f-header__link">+ Create Listing</Link>

                    </div>
                    <div className="col-3@md padding-top-sm header-border padding-x-sm grid">
                        <AccountLinks />
                    </div>
                </div>
            </header>
            // <header className="f-header js-f-header position-relative grid">
            //     <div className="f-header__mobile-content container max-width-lg">
            //         <div className="col-3@md">
            //             <Logo />
            //         </div>


            //         <button className="reset anim-menu-btn js-anim-menu-btn f-header__nav-control js-tab-focus" aria-label="Toggle menu">
            //             <i className="anim-menu-btn__icon anim-menu-btn__icon--close" aria-hidden="true"></i>
            //         </button>
            //     </div>

            //     <div className="f-header__nav" role="navigation">
            //         <div className="f-header__nav-grid justify-between@md container max-width-lg">
            //             <div className="f-header__nav-logo-wrapper flex-grow flex-basis-0">
            //                 <Logo />
            //             </div>

            //             <ul className="f-header__list flex-grow flex-basis-0 justify-center@md">
            //                 <li className='f-header__item'><SearchBar search=""></SearchBar></li>
            //                 <li className="f-header__item"><ButtonLink to="/account/listings/create" >+ Create Listing</ButtonLink></li>
            //                 <li className="f-header__item"><a href="#0" className="f-header__link">
            //                     <span>Categories</span>
            //                     <svg className="f-header__dropdown-icon icon" aria-hidden="true" viewBox="0 0 12 12">
            //                         <path d="M6,9l4-5H2Z" /></svg>
            //                 </a>

            //                     <ul className="f-header__dropdown">
            //                         {this.categories.map((category) => {
            //                             return <li key={category.id}><a href="#0" className="f-header__dropdown-link">{category.name}</a></li>
            //                         })}

            //                     </ul>
            //                 </li>

            //             </ul>

            //             <AccountLinks />
            //         </div>
            //     </div>
            // </header>
        )
    }
}
