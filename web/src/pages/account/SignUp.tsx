import React, { FormEvent, ChangeEvent } from "react";
import { IUser } from "entities/IUser";
import { AccountService } from "api/AccountService";
import { Link, Redirect } from "react-router-dom";
import { Status } from "enums/Status";
import { TextInput } from "components/form-components/TextInput";
import { Button } from "components/form-components/Button";
import { CategoryService } from "api/CategoryService";
import { ICategory } from "entities/ICategory";
import { Header } from "components/header";
import { Footer } from "components/footer";
import { Pages } from "enums/Pages";

interface ISignUpState {
    user: IUser;
    validationErrors: IUser;
    canSubmit: boolean;
    formError: string;
    status: Status
    categories: ICategory[]
}

interface ISignUpProps {
    accountService: AccountService;
    categoryService: CategoryService;
}

export class SignUp extends React.Component<ISignUpProps, ISignUpState> {
    accountService: AccountService;
    state: ISignUpState = {
        user: {
            firstName: "",
            lastName: "",
            email: "",
            password: ""
        },
        validationErrors: {
            firstName: "",
            lastName: "",
            email: "",
            password: ""
        },
        canSubmit: true,
        formError: null!,
        status: Status.LOADING,
        categories: []
    }
    

    constructor(props: ISignUpProps) {
        super(props);
        this.accountService = props.accountService
        this.addFirstName = this.addFirstName.bind(this);
        this.addLastName = this.addLastName.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.addEmail = this.addEmail.bind(this);
        this.addPassword = this.addPassword.bind(this);
    }

    async componentDidMount() {
        this.state.categories = await this.props.categoryService.getCategories()
        this.state.status = Status.LOADED;
        this.setState(this.state);
    }

    async submitForm(event: FormEvent<HTMLElement>) {

        event.preventDefault();
        const stateIsValid = false;
        if (this.validateFirstName(this.state.user.firstName) &&
            this.validateLastName(this.state.user.lastName) &&
            this.validateEmail(this.state.user.email) &&
            this.validatePassword(this.state.user.password)) {
            console.log(this.state)
            try {
                const response = await this.accountService.createAccount(this.state.user);
                if (response) {
                    this.state.status = Status.SUCCESS;
                    this.setState(this.state);
                } else {
                    this.state.formError = "Something wrong happened. Please try again later."
                    this.state.status = Status.FAILED;
                    this.setState(this.state);
                }
            } catch (error) {
                this.state.formError = error.message;
                this.setState(this.state);
            }

        }

    }

    addFirstName(event: ChangeEvent<HTMLInputElement>) {
        const firstName = event.target.value;
        this.validateFirstName(firstName);
    }

    addLastName(event: ChangeEvent<HTMLInputElement>) {
        const lastName = event.target.value;
        this.validateLastName(lastName);
    }

    addEmail(event: ChangeEvent<HTMLInputElement>) {
        const email = event.target.value;
        this.validateEmail(email);
    }

    addPassword(event: ChangeEvent<HTMLInputElement>) {
        const password = event.target.value;
        this.validatePassword(password)
    }

    validateFirstName(firstName: string) {
        const state = this.state;
        if (firstName.length < 1) {
            state.user.firstName = "";
            state.validationErrors.firstName = "Please enter your first name.";
            this.setState(state);
            return false;
        } else {
            state.user.firstName = firstName;
            state.validationErrors.firstName = "";
            this.setState(state);
            return true;
        }

    }

    validateLastName(lastName: string): boolean {
        const state = this.state;
        if (lastName.length < 1) {
            state.user.lastName = "";
            state.validationErrors.lastName = "Please enter your last name.";
            this.setState(state);
            return false;
        } else {
            state.user.lastName = lastName;
            state.validationErrors.lastName = "";
            this.setState(state);
            return true;
        }
    }

    validateEmail(email: string): boolean {
        const state = this.state;
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const isValid = re.test(String(email).toLowerCase())
        if (!isValid) {
            state.user.email = "";
            state.validationErrors.email = "Please provide a valid email address.";
        }
        if (isValid) {
            state.validationErrors.email = "";
            state.user.email = email
        }
        this.setState(state);
        return isValid
    }

    validatePassword(password: string): boolean {
        const state = this.state;

        if (password.length < 8) {
            state.user.password = "";
            state.validationErrors.password = "Password is invalid, must have a minimum length of 8"
            this.setState(state);
            return false;
        } else {
            state.user.password = password;
            state.validationErrors.password = ""
            this.setState(state);
            return true;
        }
    }

    render() {
        if (this.state.status == Status.SUCCESS) {
            return (
                <Redirect to="/account" />
            )
        } else {
            return (
                <div>
                    <Header categories={this.state.categories} />
                    <div className="container max-width-sm grid text-component padding-y-lg">

                        <form className="sign-up-form" onSubmit={this.submitForm}>
                            <div className="text-component text-center margin-bottom-sm">
                                <h1>Create an account</h1>
                                <p>Create an account to unlock all the features including creating listings and contacting sellers</p>
                                <p>Already have an account? <Link to={Pages.LOGIN}>Login</Link></p>
                            </div>

                            {/* <div className="grid gap-xs">
                        <div className="col-6@xs">
                            <button className="btn btn--subtle width-100%">
                                <svg aria-hidden="true" className="icon margin-right-xxxs" viewBox="0 0 16 16"><g><path d="M16,3c-0.6,0.3-1.2,0.4-1.9,0.5c0.7-0.4,1.2-1,1.4-1.8c-0.6,0.4-1.3,0.6-2.1,0.8c-0.6-0.6-1.5-1-2.4-1 C9.3,1.5,7.8,3,7.8,4.8c0,0.3,0,0.5,0.1,0.7C5.2,5.4,2.7,4.1,1.1,2.1c-0.3,0.5-0.4,1-0.4,1.7c0,1.1,0.6,2.1,1.5,2.7 c-0.5,0-1-0.2-1.5-0.4c0,0,0,0,0,0c0,1.6,1.1,2.9,2.6,3.2C3,9.4,2.7,9.4,2.4,9.4c-0.2,0-0.4,0-0.6-0.1c0.4,1.3,1.6,2.3,3.1,2.3 c-1.1,0.9-2.5,1.4-4.1,1.4c-0.3,0-0.5,0-0.8,0c1.5,0.9,3.2,1.5,5,1.5c6,0,9.3-5,9.3-9.3c0-0.1,0-0.3,0-0.4C15,4.3,15.6,3.7,16,3z"></path></g></svg>
                                <span>Join using Twitter</span>
                            </button>
                        </div>

                        <div className="col-6@xs">
                            <button className="btn btn--subtle width-100%">
                                <svg aria-hidden="true" className="icon margin-right-xxxs" viewBox="0 0 16 16"><g><path d="M15.3,0H0.7C0.3,0,0,0.3,0,0.7v14.7C0,15.7,0.3,16,0.7,16H8v-5H6V8h2V6c0-2.1,1.2-3,3-3 c0.9,0,1.8,0,2,0v3h-1c-0.6,0-1,0.4-1,1v1h2.6L13,11h-2v5h4.3c0.4,0,0.7-0.3,0.7-0.7V0.7C16,0.3,15.7,0,15.3,0z"></path></g></svg>
                                <span>Join using Facebook</span>
                            </button>
                        </div>
                    </div> 

                    <p className="text-center margin-y-sm">or</p> */}

                            <div className="margin-bottom-sm">
                                <div className="grid gap-xs">
                                    <TextInput
                                        divClass="col-6@md"
                                        label="First name"
                                        name="inputFirstName"
                                        id="inputFirstName"
                                        onChange={this.addFirstName}
                                        required={true}
                                        errorMessage={this.state.validationErrors.firstName}
                                    />

                                    <TextInput
                                        divClass="col-6@md"
                                        label="Last Name"
                                        name="inputLastName"
                                        id="inputLastName"
                                        onChange={this.addLastName}
                                        required={true}
                                        errorMessage={this.state.validationErrors.lastName}
                                    />

                                </div>
                            </div>

                            <TextInput
                                divClass="margin-bottom-sm"
                                type="email"
                                label="Email"
                                name="inputEmail"
                                id="inputEmail"
                                onChange={this.addEmail}
                                required={true}
                                errorMessage={this.state.validationErrors.email}
                                placeholder="email@myemail.com"
                            />

                            <TextInput
                                divClass="margin-bottom-md"
                                type="password"
                                label="Password"
                                name="inputPassword"
                                id="inputPassword"
                                onChange={this.addPassword}
                                required={true}
                                errorMessage={this.state.validationErrors.password}
                            />

                            {/* <div className="margin-bottom-md">
                        <input className="checkbox" type="checkbox" id="checkNewsletter" />
                        <label htmlFor="checkNewsletter">Send me updates about </label>
                    </div> */}

                            <Button buttonText="Join" />
                            <p className="color-error">{this.state.formError}</p>


                            <div className="text-center">
                                <p className="text-xs color-contrast-medium">By joining, you agree to our <a href="#0">Terms</a> and <a href="#0">Privacy Policy</a>.</p>
                            </div>
                        </form>
                    </div>
                    <Footer categories={this.state.categories} />
                </div>
            )
        }
    }
}