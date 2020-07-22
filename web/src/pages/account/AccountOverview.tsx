import React, { MouseEvent } from "react";
import { IAccountProps } from "entities/props/IAccountProps";
import { IAccountState } from "entities/states/IAccountState";
import { Status } from "enums/Status";
import { getUser, clearUserSession } from "util/session";
import { Redirect } from "react-router-dom";
import { Pages } from "enums/Pages";
import { Header } from "components/header";
import { AccountNav } from "components/AccountNav";
import { AccountNavSubPage } from "enums/AccountNavSubPage";
import { Footer } from "components/footer";
import { LabeledText } from "components/LabeledText";
import { epochToDate } from "util/dates";
import { Button } from "components/form-components/Button";


export class AccountOverview extends React.Component<IAccountProps, IAccountState>{
    state: IAccountState = {} as IAccountState;
    constructor(props: IAccountProps) {
        super(props);
        this.signOut = this.signOut.bind(this);
    }

    async componentDidMount() {
        this.state.categories = await this.props.categoryService.getCategories();
        const user = getUser()
        if (user) {
            try {
                this.state.user = await this.props.accountService.getFullProfile(user);
                this.state.status = Status.LOADED;
            } catch (error) {
                this.state.status = Status.NOT_AUTHENTICATED;
            }

        } else {
            this.state.status = Status.NOT_AUTHENTICATED;
        }
        this.setState(this.state)

    }

    signOut(event: MouseEvent<HTMLButtonElement>) {
        // event.preventDefault();
        clearUserSession();
        this.state.status = Status.NOT_AUTHENTICATED;
        this.setState(this.state);
    }

    render() {
        if (this.state.status === Status.NOT_AUTHENTICATED) {
            return (<Redirect to={Pages.LOGIN + "?error=You've been logged out. Please log in."} />)
        } else if (this.state.status === Status.LOADED) {
            return (
                <div>
                    <Header categories={this.state.categories} />
                    <AccountNav activePage={AccountNavSubPage.OVERVIEW} />
                    <div className="container grid max-width-sm">
                        <div className="margin-bottom-sm">
                            <div className="grid text-component">
                                <h3 className="padding-y-sm">My Account <i className="fas fa-pencil-alt"></i></h3>

                                <LabeledText className="col-3@sm" label="First Name" text={this.state.user.firstName} />
                                <LabeledText className="col-3@sm" label="Last Name" text={this.state.user.lastName} />
                                <h4 className="border-bottom">Contact Information:</h4>
                                <LabeledText className="col-6@sm" label="Email" text={this.state.user.email} />
                                <LabeledText className="col-6@sm" label="Phone Number" text={this.state.user.phoneNumber} />
                                
                                <h4 className="border-bottom">Location:</h4>
                                <LabeledText className="col-3@sm" label="City" text={this.state.user.location!.city} />
                                <LabeledText className="col-3@sm" label="State" text={this.state.user.location!.state} />
                                <LabeledText className="col-3@sm" label="Zip" text={this.state.user.location!.zip} />
                                
                                <h4 className="border-bottom">Member Data:</h4>
                                <LabeledText className="col-6@sm" label="Member Since" text={epochToDate(this.state.user.dateCreated!)} />
                                <LabeledText className="col-6@sm" label="Number of Posts" text={this.state.user.listings!.length.toString()} />


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
            return (<>Loading...</>)
        }

    }
}