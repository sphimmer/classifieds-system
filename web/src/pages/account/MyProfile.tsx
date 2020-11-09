import React, { MouseEvent, ChangeEvent } from "react";
import { AccountService } from "api/AccountService";
import { Header } from "components/header";
import { Footer } from "components/footer";
import { Status } from "enums/Status";
import { CategoryService } from "api/CategoryService";
import { AccountNav } from "components/AccountNav";
import { Redirect } from "react-router-dom";
import { clearUserSession } from "util/session";
import { AccountNavSubPage } from "enums/AccountNavSubPage";
import { IUser } from "entities/IUser";
import { Button } from "components/form-components/Button";
import { TextInput } from "components/form-components/TextInput";
import { ErrorMessage } from "components/ErrorMessage";
import { Pages } from "enums/Pages";
import { IAccountProps } from "entities/props/IAccountProps";
import { IAccountState } from "entities/states/IAccountState";
import Container from "typedi";
import { GlobalState } from "services/GlobalState";
import { LocationService } from "api/LocationService";
import { ILocation } from "entities/ILocation";
import { PageHistory } from "services/PageHistory";
import { LoadingBar } from "components/LoadingBar";


export class MyProfile extends React.Component<IAccountProps, IAccountState>{
    categoryService: CategoryService;
    accountService: AccountService;
    locationService: LocationService = Container.get(LocationService);
    state: IAccountState = {
        status: Status.LOADING,
        error: undefined!,
        categories: [],
        user: {} as IUser
    }
    globalState = Container.get(GlobalState);
    constructor(props: IAccountProps) {
        super(props);
        this.categoryService = props.categoryService;
        this.accountService = props.accountService;
        const pageHistory = Container.get(PageHistory);
        pageHistory.push(this.props.location.pathname);
        this.updateMe = this.updateMe.bind(this);
        this.setLocationCity = this.setLocationCity.bind(this);
        this.setLocationState = this.setLocationState.bind(this);
        this.setLocationZip = this.setLocationZip.bind(this);
    }

    async componentDidMount() {
        try {
            let state = this.state;
            const categoryResponse = await this.categoryService.getCategories();
            state.categories = categoryResponse;
            const globalState = Container.get(GlobalState);

            const profileResponse = await this.props.accountService.getFullProfile();
            console.info(profileResponse);

            if (profileResponse) {
                globalState.isLoggedIn = true;
                state.user = profileResponse;
                state.status = Status.LOADED;
            } else {
                state.status = Status.NOT_AUTHENTICATED;
            }

            this.setState(state);

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

    async getLocationId(location: ILocation): Promise<string>{
        let locationId: string;
        const locationResult = await this.locationService.getLocations(this.state.user.location);
        console.log(locationResult);
        if(locationResult.length == 1){
            locationId = locationResult[0].id!
        } else if (locationResult.length > 1){
            // error, choose a specifc location
            locationId = "";
        } else{
            const newLocation = await this.locationService.postLocation(location)
            console.log(newLocation)
            locationId = newLocation.id!;
        }

        return locationId;
    }

    async updateMe(event: MouseEvent<HTMLButtonElement>) {
        const user = this.state.user
        if(user.location){
            user.location.id = await this.getLocationId(user.location)
        }
        console.log(user)
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
                    <Header categories={this.state.categories} loggedIn={this.globalState.isLoggedIn} />
                    <AccountNav activePage={AccountNavSubPage.EDIT_PROFILE} />
                    <div className="container grid max-width-sm">
                        <div className="margin-bottom-sm">
                            <div className="grid gap-md text-sm">
                                <h4 className="padding-y-sm">Edit My Profile </h4>
                                
                                <TextInput
                                    label="Name"
                                    name="name"
                                    required={true}
                                    divClass="col-6@sm"
                                    id="name"
                                    onChange={(event) => { this.state.user.name = event.target.value }}
                                    defaultValue={this.state.user.name}
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
                    <Header categories={[]} loggedIn={this.globalState.isLoggedIn} />
                    <AccountNav activePage={AccountNavSubPage.EDIT_PROFILE} />
                    <div className="container grid gap-md">
                        <div className="col-2 offset-5"><LoadingBar /></div>
                    </div>
                    <Footer categories={[]} />
                </div>
            )
        } else if (this.state.status == Status.NOT_AUTHENTICATED) {
            clearUserSession();
            return <Redirect to={Pages.LOGIN + "?error=You've been logged out, log in again."} />
        } else if (this.state.status === Status.SUCCESS) {
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