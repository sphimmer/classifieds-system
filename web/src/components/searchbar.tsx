import * as React from "react";
import { Button } from "./form-components/Button";


export const SearchBar: React.FC = props => {
    return (
        <div className="contain-highlight grid padding-top-xs">

            <div className="col-10@xs padding-x-xs">
                <div className="search-input search-input--icon-left">
                    <input className="form-control width-100%" type="search" name="searchInputX" id="searchInputX" placeholder="What are you looking for?" aria-label="Search" />
                    <button className="search-input__btn">
                        <svg className="icon" viewBox="0 0 24 24"><title>Submit</title><g strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" stroke="currentColor" fill="none" strokeMiterlimit="10"><line x1="22" y1="22" x2="15.656" y2="15.656"></line><circle cx="10" cy="10" r="8"></circle></g></svg>
                    </button>
                </div>
            </div>
            <div className="col-2@xs padding-x-xs margin-top-xs margin-0@xs">
                <Button buttonText="Search" />
            </div>

        </div>
    )

}