import "reflect-metadata";
import { Container } from 'typedi';
import * as React from "react";
import * as ReactDOM from "react-dom";
import "styles.scss";
import { BrowserRouter, Switch } from "react-router-dom";
import { Home } from "pages/Home";
// import { Login } from "pages/account/Login";
// import { SignUp } from "pages/account/SignUp";
import { AccountService } from "api/AccountService";
import { MyProfile } from "pages/account/MyProfile";
import { CategoryService } from "api/CategoryService";
import { MyListings } from "pages/account/MyListings";
import { CreateListing } from "pages/account/CreateListing";
import { ListingService } from "api/ListingService";
import { Pages } from "enums/Pages";
import { AccountOverview } from "pages/account/AccountOverview";
import { PageRoute } from "components/routes/PageRoute";
import { CognitoLogin } from "pages/account/CognitoLogin";
import { GlobalState } from "services/GlobalState";
import { CategoryPage } from "pages/CategoryPage";
import { ListingPage } from "pages/ListingPage";
import { EditListing } from "pages/account/EditListing";
import { SearchPage } from "pages/Search";
const state = Container.get(GlobalState);
console.log(state);
// console.log(location.search)
ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <PageRoute exact path={Pages.HOME} component={Home} />
            <PageRoute exact path={Pages.ACCOUNT} component={AccountOverview} accountService={Container.get(AccountService)} categoryService={Container.get(CategoryService)} />
            <PageRoute exact path={Pages.PROFILE} component={MyProfile} accountService={Container.get(AccountService)} categoryService={Container.get(CategoryService)} />
            <PageRoute exact path={Pages.MY_LISTINGS} component={MyListings} accountService={Container.get(AccountService)} categoryService={Container.get(CategoryService)} listingService={Container.get(ListingService)} />
            <PageRoute exact path={Pages.CREATE_LISTING} component={CreateListing} accountService={Container.get(AccountService)} categoryService={Container.get(CategoryService)} listingService={Container.get(ListingService)} />
            <PageRoute exact path={Pages.LOGIN} component={CognitoLogin} />
            <PageRoute path={Pages.CATEGORY} component={CategoryPage} />
            <PageRoute path={Pages.LISTING} component={ListingPage}/>
            <PageRoute exact path={Pages.EDIT_LISTING} component={EditListing} />
            <PageRoute path={Pages.SEARCH} component={SearchPage} />
            {/* <PageRoute exact path={Pages.SIGNUP} component={SignUp} accountService={Container.get(AccountService)} categoryService={Container.get(CategoryService)} /> */}
        </Switch>
    </BrowserRouter>,
    document.getElementById("root")
);