
import { ICategory } from "entities/ICategory";
import { Logo } from "./Logo";
import { AccountLinks } from "./AccountLinks";
import { Link } from "react-router-dom";
import { HeaderSearchField } from "./HeaderSearchField";
import { Size } from "enums/Size";
import { Pages } from "enums/Pages";

import React, { MouseEvent } from "react";
import { CategoryLinks } from "./CategoryLinks";




interface IHeaderProps {
    categories: ICategory[];
    loggedIn?: boolean;
    searchTerm?: string;
}

interface IHeaderState {
    showCategoryMenu: boolean;
}

export class Header extends React.Component<IHeaderProps, IHeaderState> {

    state: IHeaderState = {
        showCategoryMenu: false
    }

    constructor(props: IHeaderProps) {
        super(props);
        console.log(this.props)
        this.toggleCategoryMenu = this.toggleCategoryMenu.bind(this);
        this.closeCategoryMenu = this.closeCategoryMenu.bind(this)
    }

    toggleCategoryMenu(event: MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        console.log(this.state.showCategoryMenu)
        const show = this.state.showCategoryMenu;
        this.setState({ showCategoryMenu: !show });
    }

    closeCategoryMenu() {
        console.log("close")
        this.setState({ showCategoryMenu: false });
    }

    componentDidMount() {
        let frontEnd = document.createElement('script');
        frontEnd.src = '/static/_2_flexi-headers.js'; // 👈 make sure to use the correct path
        frontEnd.id = '_2_flexi-header';
        frontEnd.type = "JavaScript";
        document.body.appendChild(frontEnd);
    }

    componentWillUnmount() {
        document.getElementById('_2_flexi-header')!.remove()
    }

    render() {
        const menu = (
            <>
                <div className="col-2@md padding-y-xs padding-x-sm">
                    <Logo size={Size.lg} />
                </div>
                <div className="col-3@md header-border padding-top-sm padding-x-sm grid">
                    <HeaderSearchField searchTerm={this.props.searchTerm} />
                </div>
                <div className="col-2@md header-border padding-top-sm padding-x-sm grid">
                    <a href="#categories" onClick={this.toggleCategoryMenu} className="f-header__link">
                        <span>Categories</span>
                        <svg className="f-header__dropdown-icon icon" aria-hidden="true" viewBox="0 0 12 12">
                            <path d="M6,9l4-5H2Z" /></svg>
                    </a>
                </div>
                <div className="col-2@md padding-top-sm header-border padding-x-sm grid">
                    <Link to={Pages.CREATE_LISTING} className="f-header__link">+ Create Listing</Link>

                </div>
                <div className="col-3@md padding-top-sm header-border padding-x-sm grid">
                    <AccountLinks loggedIn={this.props.loggedIn ? true : false} />
                </div>
            </>
        )
        if (!this.state.showCategoryMenu) {
            return (
                <header className="margin-bottom-md" >
                    <div className="container grid text-component max-width-lg">{menu}</div>
                </header>);
        } else if (this.state.showCategoryMenu) {
            return (
                <header className="margin-bottom-md" >
                    <div className="container grid text-component max-width-lg">
                        {menu}

                    </div>
                    <div className="container max-width-md grid position-absolute bg z-index-overlay shadow-lg radius-lg Absolute-Center">
                        <div className="col-1 offset-11"><button onClick={this.closeCategoryMenu}>X</button></div>
                        <CategoryLinks linkOnClick={this.closeCategoryMenu} categories={this.props.categories} />
                    </div>
                </header>


            )

        } else {

        }


    }
}
