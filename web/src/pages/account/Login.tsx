import React, { ChangeEvent, FormEvent } from "react";
import { IUser } from "entities/IUser";
import { Link, Redirect, RouteComponentProps } from "react-router-dom";
import { AccountService } from "api/AccountService";
import { Status } from "enums/Status";
import { Logo } from "components/Logo";
import { Button } from "components/form-components/Button";
import { Size } from "enums/Size";
import { Header } from "components/header";
import { ICategory } from "entities/ICategory";
import { CategoryService } from "api/CategoryService";
import { Footer } from "components/footer";
import { ErrorMessage } from "components/ErrorMessage";
import { Pages } from "enums/Pages";
import { parse, ParsedUrlQuery } from "querystring";

interface ILoginState {
    user: IUser
    formError: string
    formStatus: Status
}

interface ILoginProps extends RouteComponentProps{
    accountService: AccountService;
    categoryService: CategoryService;
}


export class Login extends React.Component<ILoginProps, ILoginState> {
    private accountService: AccountService;
    categories: ICategory[] = [];
    state: ILoginState = {
        user: {
            email: "",
            password: ""
        },
        formError: "",
        formStatus: Status.INIT
    } as ILoginState;

    constructor(props: ILoginProps) {
        super(props);
        this.accountService = props.accountService;
        this.addPassword = this.addPassword.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.addEmail = this.addEmail.bind(this);
        const urlParams: ParsedUrlQuery = parse(props.location.search)
        console.log(urlParams)
        if(urlParams['?error']){
            
            this.state.formError = urlParams['?error'] as string;
            this.setState(this.state);
        }
        console.log(this.state)
    }

    async componentDidMount(){
        this.categories = await this.props.categoryService.getCategories();
    }
    async submitForm(event: FormEvent<HTMLElement>) {
        this.state.formError = "";
        this.state.formStatus = Status.LOADING;
        this.setState(this.state);
        event.preventDefault()

        try {
            // console.log(this.state.user)
            const response = await this.accountService.login(this.state.user);
            this.state.formStatus = Status.SUCCESS;
            this.setState(this.state)
            // console.log(response);
        } catch (error) {
            this.state.formError = error.message;
            this.state.formStatus = Status.FAILED;
            this.setState(this.state);
        }


    }

    addEmail(event: ChangeEvent<HTMLInputElement>) {
        this.state.user.email = event.target.value;
    }

    addPassword(event: ChangeEvent<HTMLInputElement>) {
        this.state.user.password = event.target.value;
    }

    render() {
        if (this.state.formStatus != Status.SUCCESS) {

            return (
                <div>
                <Header categories={this.categories} />
                <div className="container max-width-sm grid text-component padding-y-lg">
                    
                    
                    <form className="login-form" onSubmit={this.submitForm}>
                        <div className="text-component text-center margin-bottom-sm">
                            <h1>Log in</h1>
                            <p>Provide your email and password to log in</p>
                        </div>

                        {/* <div className="grid gap-xs">
                        <div className="col-6@xs">
                            <button className="btn btn--subtle width-100%">
                                <svg aria-hidden="true" className="icon margin-right-xxxs" viewBox="0 0 16 16"><g><path d="M16,3c-0.6,0.3-1.2,0.4-1.9,0.5c0.7-0.4,1.2-1,1.4-1.8c-0.6,0.4-1.3,0.6-2.1,0.8c-0.6-0.6-1.5-1-2.4-1 C9.3,1.5,7.8,3,7.8,4.8c0,0.3,0,0.5,0.1,0.7C5.2,5.4,2.7,4.1,1.1,2.1c-0.3,0.5-0.4,1-0.4,1.7c0,1.1,0.6,2.1,1.5,2.7 c-0.5,0-1-0.2-1.5-0.4c0,0,0,0,0,0c0,1.6,1.1,2.9,2.6,3.2C3,9.4,2.7,9.4,2.4,9.4c-0.2,0-0.4,0-0.6-0.1c0.4,1.3,1.6,2.3,3.1,2.3 c-1.1,0.9-2.5,1.4-4.1,1.4c-0.3,0-0.5,0-0.8,0c1.5,0.9,3.2,1.5,5,1.5c6,0,9.3-5,9.3-9.3c0-0.1,0-0.3,0-0.4C15,4.3,15.6,3.7,16,3z"></path></g></svg>
                                <span>Login with Twitter</span>
                            </button>
                        </div>

                        <div className="col-6@xs">
                            <button className="btn btn--subtle width-100%">
                                <svg aria-hidden="true" className="icon margin-right-xxxs" viewBox="0 0 16 16"><g><path d="M15.3,0H0.7C0.3,0,0,0.3,0,0.7v14.7C0,15.7,0.3,16,0.7,16H8v-5H6V8h2V6c0-2.1,1.2-3,3-3 c0.9,0,1.8,0,2,0v3h-1c-0.6,0-1,0.4-1,1v1h2.6L13,11h-2v5h4.3c0.4,0,0.7-0.3,0.7-0.7V0.7C16,0.3,15.7,0,15.3,0z"></path></g></svg>
                                <span>Login with Facebook</span>
                            </button>
                        </div>
                    </div> */}

                        {/* <p className="text-center margin-y-sm">or</p> */}

                        <div className="margin-bottom-sm">
                            <label className="form-label margin-bottom-xxxs" htmlFor="inputEmail1">Email</label>
                            <input onChange={this.addEmail} className="form-control width-100%" type="email" name="inputEmail1" id="inputEmail1" placeholder="email@myemail.com" required />
                        </div>

                        <div className="margin-bottom-sm">
                            <div className="flex justify-between margin-bottom-xxxs">
                                <label className="form-label" htmlFor="inputPassword1">Password</label>
                                <span className="text-sm"><a href="#0">Forgot?</a></span>
                            </div>

                            <input onChange={this.addPassword} className="form-control width-100%" type="password" name="inputPassword1" id="inputPassword1" required />
                        </div>

                        <Button buttonText="Login" />
                        <p className="color-error">{this.state.formError}</p>

                        <div className="text-center">
                            <p className="text-sm">Don't have an account? <Link to={Pages.SIGNUP}>Get started</Link></p>
                        </div>
                    </form>
                </div>
                <Footer categories={this.categories}/>
                </div>
            )
        } else {
            return <Redirect to={Pages.HOME} />
        }
    }
}