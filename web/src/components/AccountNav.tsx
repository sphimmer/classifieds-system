import React from "react";
import { AccountNavSubPage } from "enums/AccountNavSubPage";
import { Link } from "react-router-dom";
import { Pages } from "enums/Pages";

interface IAccountNavProps{
    activePage: AccountNavSubPage
}



export class AccountNav extends React.Component<IAccountNavProps> {
    activePage: AccountNavSubPage;
    constructor(props: IAccountNavProps){
        super(props);
        this.activePage = props.activePage;

    }
    render() {

        return (
            <div className="bg-contrast-lower">
                <div className="container max-width-lg">
                    <div className="subnav  js-subnav">
                        <button className="reset btn btn--subtle margin-y-sm subnav__control js-subnav__control">
                            <span>Show Categories</span>
                            <svg className="icon icon--xxs margin-left-xxs" aria-hidden="true" viewBox="0 0 12 12">
                                <polyline points="0.5 3.5 6 9.5 11.5 3.5" fill="none" stroke-width="1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></polyline>
                            </svg>
                        </button>

                        <div className="subnav__wrapper js-subnav__wrapper">
                            <nav className="subnav__nav justify-center">
                                <button className="reset subnav__close-btn js-subnav__close-btn js-tab-focus" aria-label="Close navigation">
                                    <svg className="icon" viewBox="0 0 16 16">
                                        <g stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10">
                                            <line x1="13.5" y1="2.5" x2="2.5" y2="13.5"></line>
                                            <line x1="2.5" y1="2.5" x2="13.5" y2="13.5"></line>
                                        </g>
                                    </svg>
                                </button>

                                <ul className="subnav__list">
                                    <li className="subnav__item"><Link to={Pages.ACCOUNT} className="subnav__link" aria-current={this.activePage === AccountNavSubPage.OVERVIEW ? "page" : "false"}>My Account</Link></li>
                                    <li className="subnav__item"><Link to={Pages.MY_LISTINGS} className="subnav__link" aria-current={this.activePage === AccountNavSubPage.LISTING ? "page" : "false"}>My Listings</Link></li>
                                    <li className="subnav__item"><Link to={Pages.PROFILE} className="subnav__link" aria-current={this.activePage === AccountNavSubPage.EDIT_PROFILE ? "page" : "false"}>Edit Profile</Link></li>
                                    <li className="subnav__item"><Link to={Pages.PROFILE} className="subnav__link" aria-current={this.activePage === AccountNavSubPage.CHANGE_PASSWORD ? "page" : "false"}>Change Password</Link></li>
                                    {/* <li className="subnav__item"><a href="#0" className="subnav__link">Favorites</a></li> */}
                                    
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}