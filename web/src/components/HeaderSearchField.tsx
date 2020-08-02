import * as React from "react";


export class HeaderSearchField extends React.Component {
    render() {
        return (
            <div className="search-input search-input--icon-left grid">
                <input className="header-search-control width-100% " type="search" name="searchInputX" id="searchInputX" placeholder="Search..." aria-label="Search" />
                <button className="search-input__btn">
                    <svg className="icon" viewBox="0 0 24 24"><title>Submit</title><g strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" stroke="currentColor" fill="none" strokeMiterlimit="10"><line x1="22" y1="22" x2="15.656" y2="15.656"></line><circle cx="10" cy="10" r="8"></circle></g></svg>
                </button>
            </div>
        )
    }
}