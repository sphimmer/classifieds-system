import React from "react";
import { AccountNav } from "components/AccountNav";
import { AccountNavSubPage } from "enums/AccountNavSubPage";
import { AccountService } from "api/AccountService";
import { CategoryService } from "api/CategoryService";
import { Header } from "components/header";
import { ICategory } from "entities/ICategory";
import { Footer } from "components/footer";
import { Status } from "enums/Status";
import { ButtonLink } from "components/ButtonLink";
import { Link, Redirect } from "react-router-dom";
import { ListingService } from "api/ListingService";
import { IListingResponse } from "entities/responses/IListingResponse";
import { Listing } from "components/listing";
import { Pages } from "enums/Pages";
import Container from "typedi";
import { GlobalState } from "services/GlobalState";
import { PageHistory } from "services/PageHistory";
import { LoadingBar } from "components/LoadingBar";

interface IMyListingsProps {
    accountService: AccountService;
    categoryService: CategoryService;
    listingService: ListingService;
    location: Location;
}

interface IMyListingsState {
    status: Status;
    categories: ICategory[];
    listings: IListingResponse[];
}
export class MyListings extends React.Component<IMyListingsProps, IMyListingsState>{
    accountService: AccountService;
    categoryService: CategoryService;
    listingService: ListingService;

    state: IMyListingsState = {
        status: Status.INIT,
        categories: [],
        listings: []
    }

    globalState = Container.get(GlobalState);

    constructor(props: IMyListingsProps) {
        super(props);
        const pageHistory = Container.get(PageHistory);
        pageHistory.push(this.props.location.pathname);
        this.accountService = props.accountService;
        this.categoryService = props.categoryService;
        this.listingService = props.listingService;
    }

    async componentDidMount() {
        let status: Status;
        
        if (this.globalState.isLoggedIn) {
            
            this.state.categories = await this.categoryService.getCategories();
            try {
                this.state.listings = await this.listingService.getMyListings();
                status = Status.LOADED;
            } catch (error) {
                status = Status.NOT_AUTHENTICATED;
            }
            
            
        } else {
            status = Status.NOT_AUTHENTICATED;
        }
        
        this.setState({status: status});
    }

    render() {
        if (this.state.status == Status.LOADED && this.state.listings.length == 0) {
            return (
                <div>
                    <Header categories={this.state.categories} loggedIn={this.globalState.isLoggedIn}/>
                    <AccountNav activePage={AccountNavSubPage.LISTING} />
                    <div className="container grid max-width-sm">
                        <div className="margin-bottom-sm">
                            <div className="grid gap-md">
                                
                                <h4 className="margin-top-md">You have don't have any listings. <Link to="/account/listings/create">Create a Listing</Link></h4>
                                
                            </div>
                        </div>
                    </div>

                <Footer categories={this.state.categories} />
                </div >
            )
        } else if (this.state.status == Status.LOADED && this.state.listings.length > 0) {
            return (
                <div>
                    <Header categories={this.state.categories} loggedIn={this.globalState.isLoggedIn} />
                    <AccountNav activePage={AccountNavSubPage.LISTING} />
                    <div className="container grid max-width-sm">
                        <div className="margin-bottom-sm">
                            <div className="grid gap-md">
                                <div className="col-6@sm">
                                    <h4 className="padding-y-sm">MY LISTINGS</h4>
                                </div>
                                <div className="col-6@sm padding-y-md">
                                    <ButtonLink to={Pages.CREATE_LISTING}>+ New Listing </ButtonLink>
                                </div>
                                {this.state.listings.map(listing => {
                                    return <Listing listing={listing} editable={true}/>
                                })}
                            </div>
                        </div>
                    </div>

                <Footer categories={this.state.categories} />
                </div >
            )
        } else if (this.state.status == Status.NOT_AUTHENTICATED){
            return(<Redirect to={Pages.LOGIN}/>)
        } else {
            return (
                <div>
                    <Header categories={[]} loggedIn={this.globalState.isLoggedIn} />
                    <AccountNav activePage={AccountNavSubPage.LISTING} />
                    <div className="container grid gap-md">
                        <div className="col-2 offset-5"><LoadingBar /></div>
                    </div>
                    <Footer categories={[]} />
                </div>
            )
        }

    }
}