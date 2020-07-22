import React from "react";
import { IUser } from "entities/IUser";
import { Status } from "enums/Status";
import { Link } from "react-router-dom";
import { getUser } from "util/session";
import { Pages } from "enums/Pages";

interface IAccountLinksState {
    user?: IUser,
    status: Status
}

interface IAccountLinksProps {

}

export class AccountLinks extends React.Component<IAccountLinksProps, IAccountLinksState>{
    state: IAccountLinksState;

    constructor(props: IAccountLinksProps) {
        super(props)
        const localStorageData = getUser();
        this.state = {
            user: localStorageData ? localStorageData.user : undefined,
            status: Status.LOADED
        }
    }

    render() {
        if (this.state.user) {
            return (

                <nav className="col-12@md padding-y-sm grid padding-x-sm">

                    <Link to={Pages.ACCOUNT} className="f-header__link">My Account</Link>
                </nav>
            )
        } else {
            return (
                <>
                <nav className="col-6@xs padding-y-sm grid ">

                    <Link to={Pages.LOGIN} className="f-header__link">Login</Link>
                </nav>
                <nav className="col-6@xs padding-y-sm grid ">
                    <Link to={Pages.SIGNUP} className="f-header__link">Sign Up</Link>
                </nav>
                </>
            )
        }
    }
}