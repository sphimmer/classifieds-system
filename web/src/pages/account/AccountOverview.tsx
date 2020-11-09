import React, { MouseEvent } from "react";
import { IAccountProps } from "entities/props/IAccountProps";
import { IAccountState } from "entities/states/IAccountState";
import { Status } from "enums/Status";
import { clearUserSession } from "util/session";
import { Redirect, Link } from "react-router-dom";
import { Pages } from "enums/Pages";
import { Header } from "components/header";
import { AccountNav } from "components/AccountNav";
import { AccountNavSubPage } from "enums/AccountNavSubPage";
import { Footer } from "components/footer";
import { LabeledText } from "components/LabeledText";
import { epochToDate } from "util/dates";
import { Button } from "components/form-components/Button";
import qs from "qs";
import Container from "typedi";
import { GlobalState } from "services/GlobalState";
import { ButtonLink } from "components/ButtonLink";
import { PageHistory } from "services/PageHistory";
import { LoadingBar } from "components/LoadingBar";
import moment from "moment";


export class AccountOverview extends React.Component<IAccountProps, IAccountState>{
    state: IAccountState = {} as IAccountState;
    globalState: GlobalState;

    constructor(props: IAccountProps) {
        super(props);
        const pageHistory = Container.get(PageHistory);
        pageHistory.push(this.props.location.pathname)
        this.globalState = Container.get(GlobalState);
        this.signOut = this.signOut.bind(this);
    }

    async componentDidMount() {
        this.state.categories = await this.props.categoryService.getCategories();
        if(this.globalState.isLoggedIn){
            try {
                const profileResponse = await this.props.accountService.getFullProfile();
    
                if (profileResponse) {
                    this.state.user = profileResponse;
                    this.state.status = Status.LOADED;
                } else {
                    this.globalState.setState(false);
                    this.state.status = Status.NOT_AUTHENTICATED;
                }
    
                this.setState(this.state);
            } catch (error) {
                this.globalState.setState(false);
                this.state.status = Status.NOT_AUTHENTICATED
                this.setState(this.state);
            }
        } else {
            this.globalState.setState(false);
            this.state.status = Status.NOT_AUTHENTICATED;
            this.setState(this.state);
        }
        
    }

    async signOut(event: MouseEvent<HTMLButtonElement>) {
        // event.preventDefault();
        clearUserSession();
        
        this.state.status = Status.NOT_AUTHENTICATED;
        this.setState(this.state);
        await this.props.accountService.logout()
    }

    render() {
        
        if (this.state.status === Status.NOT_AUTHENTICATED) {
            return (
                <div>
                    <Header categories={this.state.categories} loggedIn={this.globalState.isLoggedIn} />
                    <AccountNav activePage={AccountNavSubPage.OVERVIEW} />
                    <div className="container grid max-width-sm text-sm">
                        <div className="margin-bottom-sm">
                            <h3>Not Authenticated. Please Log in</h3>
                            <ButtonLink to={Pages.LOGIN}>Login</ButtonLink>
                        </div>
                    </div>
                    <Footer categories={this.state.categories} />
                </div>
            )
        } else if (this.state.status === Status.LOADED) {
            return (
                <div>
                    <Header categories={this.state.categories} loggedIn={this.globalState.isLoggedIn} />
                    <AccountNav activePage={AccountNavSubPage.OVERVIEW} />
                    <div className="container grid max-width-sm text-sm">
                        <div className="margin-bottom-sm">
                            <div className="col-12@sm">
                                <h3 className="padding-y-sm">MY ACCOUNT <Link to={Pages.PROFILE}><img className="width-sm inline" src="/images/user-edit-solid.svg" /></Link></h3>
                            </div>
                            {/* <div className="col-6@sm">
                                    
                                </div> */}
                            <div className="grid text-component">


                                <LabeledText className="col-3@sm" label="Name" text={this.state.user.name} />

                                <h4 className="border-bottom">Contact Information:</h4>
                                <LabeledText className="col-6@sm" label="Email" text={this.state.user.email} />
                                <LabeledText className="col-6@sm" label="Phone Number" text={this.state.user.phoneNumber} />

                                <h4 className="border-bottom">Location:</h4>
                                <LabeledText className="col-3@sm" label="City" text={this.state.user.location ? this.state.user.location.city : ""} />
                                <LabeledText className="col-3@sm" label="State" text={this.state.user.location ? this.state.user.location.state : ""} />
                                <LabeledText className="col-3@sm" label="Zip" text={this.state.user.location ? this.state.user.location.zip : ""} />

                                <h4 className="border-bottom">Member Data:</h4>
                                <LabeledText className="col-6@sm" label="Member Since" text={moment(this.state.user.dateCreated!).format('LL')} />
                                {/* <LabeledText className="col-6@sm" label="Number of Posts" text={this.state.user.listings!.length.toString()} /> */}


                                <div className="col-4@sm">
                                    <Button colorClass="btn btn--subtle" onClick={this.signOut} buttonText="Sign Out" />
                                </div>


                            </div>
                        </div>
                    </div>

                    <Footer categories={this.state.categories} />
                </div>
            )
        } else {
            return (
                <div>
                    <Header categories={[]} loggedIn={this.globalState.isLoggedIn} />
                    <AccountNav activePage={AccountNavSubPage.OVERVIEW} />
                    <div className="container grid gap-md">
                        <div className="col-2 offset-5"><LoadingBar /></div>
                    </div>
                    <Footer categories={[]} />
                </div>
            )
        }

    }
}