import * as React from "react";
import * as ReactDOM from "react-dom";
import "styles.scss";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { Home } from "pages/Home";
import { Login } from "pages/account/Login";
import { SignUp } from "pages/account/SignUp";
import { AccountService } from "api/AccountService";
import { MyProfile } from "pages/account/MyProfile";
import { CategoryService } from "api/CategoryService";
import { MyListings } from "pages/account/MyListings";
import { CreateListing } from "pages/account/CreateListing";
import { ListingService } from "api/ListingService";
import { getUser } from "util/session";
import { Pages } from "enums/Pages";
import { LocationService } from "api/LocationService";
import { AccountOverview } from "pages/account/AccountOverview";

const PageRoute = ({ component: Component, isAuth, ...rest }: any) => (
    <Route
        {...rest}
        render={props =>
            <Component {...props} {...rest} />
        }
    />
);



const PrivateRoute = ({ component: Component, ...rest }: any) => (
    <Route {...rest} render={(props) => (
      getUser()
        ? <Component {...props} {...rest} />
        : <Redirect to={Pages.LOGIN + '?error=Please log in to continue'} />
    )} />
  )

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <PageRoute exact path={Pages.HOME} component={Home} />
            <PrivateRoute exact path={Pages.ACCOUNT} component={AccountOverview} accountService={new AccountService()} categoryService={new CategoryService()} />
            <PrivateRoute exact path={Pages.PROFILE} component={MyProfile} accountService={new AccountService()} categoryService={new CategoryService()} />
            <PrivateRoute exact path={Pages.MY_LISTINGS} component={MyListings} accountService={new AccountService()} categoryService={new CategoryService()} listingService={new ListingService()}/>
            <PrivateRoute exact path={Pages.CREATE_LISTING} component={CreateListing}  accountService={new AccountService()} categoryService={new CategoryService()} listingService={new ListingService}/>
            <PageRoute exact path={Pages.LOGIN}  component={Login} accountService={new AccountService()} categoryService={new CategoryService()}/>
            <PageRoute exact path={Pages.SIGNUP} component={SignUp} accountService={new AccountService()} categoryService={new CategoryService()}/>
        </Switch>
    </BrowserRouter>,
    document.getElementById("root")
);