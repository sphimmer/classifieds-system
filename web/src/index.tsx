import "reflect-metadata";
import { Container } from 'typedi';
import * as React from "react";
import * as ReactDOM from "react-dom";
import "styles.scss";
import { BrowserRouter, Switch } from "react-router-dom";
import { Home } from "pages/Home";
import { Login } from "pages/account/Login";
import { SignUp } from "pages/account/SignUp";
import { AccountService } from "api/AccountService";
import { MyProfile } from "pages/account/MyProfile";
import { CategoryService } from "api/CategoryService";
import { MyListings } from "pages/account/MyListings";
import { CreateListing } from "pages/account/CreateListing";
import { ListingService } from "api/ListingService";
import { Pages } from "enums/Pages";
import { AccountOverview } from "pages/account/AccountOverview";
import { PrivateRoute } from "components/routes/PrivateRoute";
import { PageRoute } from "components/routes/PageRoute";




ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <PageRoute exact path={Pages.HOME} component={Home} />
            <PrivateRoute exact path={Pages.ACCOUNT} component={AccountOverview} accountService={Container.get(AccountService)} categoryService={Container.get(CategoryService)} />
            <PrivateRoute exact path={Pages.PROFILE} component={MyProfile} accountService={Container.get(AccountService)} categoryService={Container.get(CategoryService)} />
            <PrivateRoute exact path={Pages.MY_LISTINGS} component={MyListings} accountService={Container.get(AccountService)} categoryService={Container.get(CategoryService)} listingService={Container.get(ListingService)} />
            <PrivateRoute exact path={Pages.CREATE_LISTING} component={CreateListing} accountService={Container.get(AccountService)} categoryService={Container.get(CategoryService)} listingService={Container.get(ListingService)} />
            <PageRoute exact path={Pages.LOGIN} component={Login} accountService={Container.get(AccountService)} categoryService={Container.get(CategoryService)} />
            <PageRoute exact path={Pages.SIGNUP} component={SignUp} accountService={Container.get(AccountService)} categoryService={Container.get(CategoryService)} />
        </Switch>
    </BrowserRouter>,
    document.getElementById("root")
);