import React, { MouseEvent, ChangeEvent } from "react";
import { AccountService } from "api/AccountService";
import { Header } from "components/header";
import { Footer } from "components/footer";
import { Status } from "enums/Status";
import { CategoryService } from "api/CategoryService";
import { AccountNav } from "components/AccountNav";
import { Redirect } from "react-router-dom";
import { clearUserSession, getUser } from "util/session";
import { AccountNavSubPage } from "enums/AccountNavSubPage";
import { IUser } from "entities/IUser";
import { Button } from "components/form-components/Button";
import { TextInput } from "components/form-components/TextInput";
import { ErrorMessage } from "components/ErrorMessage";
import { ILocalStorage } from "entities/ILocalStorage";
import { Pages } from "enums/Pages";
import { IAccountProps } from "entities/props/IAccountProps";
import { IAccountState } from "entities/states/IAccountState";


export class MyProfile extends React.Component<IAccountProps, IAccountState>{
    categoryService: CategoryService;
    accountService: AccountService;
    state: IAccountState = {
        status: Status.LOADING,
        error: undefined!,
        categories: [],
        user: {} as IUser
    }
    constructor(props: IAccountProps) {
        super(props);
        this.categoryService = props.categoryService;
        this.accountService = props.accountService;
        
        this.updateMe = this.updateMe.bind(this);
        this.setLocationCity = this.setLocationCity.bind(this);
        this.setLocationState = this.setLocationState.bind(this);
        this.setLocationZip = this.setLocationZip.bind(this);
    }

    async componentDidMount() {
        try {
            const categoryResponse = await this.categoryService.getCategories();
            const user: ILocalStorage | null = await getUser();
            if (user) {
                const userResponse = await this.accountService.getFullProfile(user);
                this.setState({ categories: categoryResponse, status: Status.LOADED, user: userResponse })
            } else {
                this.state.status = Status.NOT_AUTHENTICATED;
                this.setState(this.state);
            }

        } catch (error) {
            if (error.message.includes("UNAUTHENTICATED")) {
                this.state.status = Status.NOT_AUTHENTICATED
            } else {
                this.state.status = Status.FAILED;
            }
            this.state.error = error.message;
            this.setState(this.state);
        }
    }

    async updateMe(event: MouseEvent<HTMLButtonElement>) {
        const response = await this.accountService.updateMe(this.state.user);
        if (response) {
            this.state.user = response;
            this.state.status = Status.SUCCESS;
            this.setState(this.state);
        }
    }

    setLocationCity(event: ChangeEvent<HTMLInputElement>) {
        if (!this.state.user.location) {
            this.state.user.location = { city: event.target.value, state: "", zip: "" }
        } else {
            this.state.user.location.city = event.target.value
        }
    }
    setLocationState(event: ChangeEvent<HTMLInputElement>) {
        if (!this.state.user.location) {
            this.state.user.location = { city: "", state: event.target.value, zip: "" }
        } else {
            this.state.user.location.state = event.target.value
        }
    }

    setLocationZip(event: ChangeEvent<HTMLInputElement>) {
        if (!this.state.user.location) {
            this.state.user.location = { city: "", state: "", zip: event.target.value }
        } else {
            this.state.user.location.zip = event.target.value
        }
    }

    render() {
        if (this.state.status == Status.LOADED) {
            return (

                <div>
                    <Header categories={this.state.categories} loggedIn={this.props.session ? true : false}/>
                    <AccountNav activePage={AccountNavSubPage.EDIT_PROFILE} />
                    <div className="container grid max-width-sm">
                        <div className="margin-bottom-sm">
                            <div className="grid gap-md text-sm">
                                <h4 className="padding-y-sm">Edit My Profile </h4>
                                <TextInput
                                    label="First Name"
                                    name="firstname"
                                    required={true}
                                    divClass="col-6@sm"
                                    id="firstname"
                                    onChange={(event) => { this.state.user.firstName = event.target.value }}
                                    defaultValue={this.state.user.firstName}
                                />
                                <TextInput
                                    label="Last Name"
                                    name="lastname"
                                    required={true}
                                    divClass="col-6@sm"
                                    id="lastname"
                                    onChange={(event) => { this.state.user.lastName = event.target.value }}
                                    defaultValue={this.state.user.lastName}
                                />

                                <TextInput
                                    label="Email"
                                    name="emaiil"
                                    required={true}
                                    divClass="col-6@sm"
                                    id="email"
                                    onChange={(event) => { this.state.user.email = event.target.value }}
                                    defaultValue={this.state.user.email}
                                />

                                <TextInput
                                    label="Phone Number"
                                    name="phonenumber"
                                    required={true}
                                    divClass="col-6@sm"
                                    id="phonenumber"
                                    onChange={(event) => { this.state.user.phoneNumber = event.target.value }}
                                    defaultValue={this.state.user.phoneNumber}
                                />

                                <TextInput
                                    label="City"
                                    name="city"
                                    required={true}
                                    divClass="col-4@sm"
                                    id="city"
                                    onChange={this.setLocationCity}
                                    defaultValue={this.state.user.location ? this.state.user.location.city : ""}
                                />

                                <TextInput
                                    label="State"
                                    name="state"
                                    required={true}
                                    divClass="col-4@sm"
                                    id="state"
                                    onChange={this.setLocationState}
                                    defaultValue={this.state.user.location ? this.state.user.location.state : ""}
                                />

                                <TextInput
                                    label="Zip"
                                    name="zip"
                                    required={true}
                                    divClass="col-4@sm"
                                    id="zip"
                                    onChange={this.setLocationZip}
                                    defaultValue={this.state.user.location ? this.state.user.location.zip : ""}
                                />
                            </div>
                        </div>

                        <div className="col-4@sm">
                            <Button onClick={this.updateMe} buttonText="Save Profile" />
                        </div>

                    </div>
                    <Footer categories={this.state.categories} />
                </div>

            )
        } else if (this.state.status == Status.LOADING) {
            return (
                <div>
                    <Header categories={[]} />
                    <AccountNav activePage={AccountNavSubPage.EDIT_PROFILE} />
                    <Footer categories={[]} />
                </div>
            )
        } else if (this.state.status == Status.NOT_AUTHENTICATED) {
            clearUserSession();
            return <Redirect to={Pages.LOGIN + "?error=You've been logged out, log in again."} />
        } else if (this.state.status === Status.SUCCESS){
            return <Redirect to={Pages.ACCOUNT} />
        } else {
            return (
                <div>
                    <Header categories={this.state.categories} />
                    <ErrorMessage>Ther was an error loading this page. {this.state.error}</ErrorMessage>
                    <Footer categories={this.state.categories} />
                </div>
            )
        }
    }
}