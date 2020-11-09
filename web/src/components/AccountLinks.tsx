import React from "react";
import { Status } from "enums/Status";
import { Link } from "react-router-dom";
import { Pages } from "enums/Pages";
import { GlobalState } from "services/GlobalState";
import Container from "typedi";

interface IAccountLinksState {
    status: Status
}

interface IAccountLinksProps {
    loggedIn: boolean,
}

export class AccountLinks extends React.Component<IAccountLinksProps, IAccountLinksState>{
    state: IAccountLinksState = { status: Status.LOADING };
    globalState: GlobalState = Container.get(GlobalState);
    async componentDidMount() {

        this.state = {

            status: Status.LOADED
        }
        this.setState(this.state);
    }
    render() {
        if (this.globalState.isLoggedIn) {
            return (

                <nav className="col-12@md padding-y-sm grid padding-x-sm">

                    <Link to={Pages.ACCOUNT} className="f-header__link">My Account</Link>
                </nav>
            )
        } else {
            return (
                <>
                    <nav className="col-6@xs padding-y-sm grid ">

                        <a href={Pages.LOGIN} className="f-header__link">Login</a>
                    </nav>
                    <nav className="col-6@xs padding-y-sm grid ">
                        <Link to={Pages.SIGNUP} className="f-header__link">Sign Up</Link>
                    </nav>
                </>
            )
        }
    }
}