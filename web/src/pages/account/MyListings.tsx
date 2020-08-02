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
import { ILocalStorage } from "entities/ILocalStorage";

interface IMyListingsProps {
    accountService: AccountService;
    categoryService: CategoryService;
    listingService: ListingService;
    session: ILocalStorage;
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
    constructor(props: IMyListingsProps) {
        super(props);
        this.accountService = props.accountService;
        this.categoryService = props.categoryService;
        this.listingService = props.listingService;
    }

    async componentDidMount() {
        
        
        if (this.props.session) {
            
            this.state.categories = await this.categoryService.getCategories();
            this.state.listings = await this.listingService.getMyListings();
            this.state.status = Status.LOADED;
        } else {
            this.state.status = Status.NOT_AUTHENTICATED;
        }
        
        this.setState(this.state);
    }

    render() {
        if (this.state.status == Status.LOADED && this.state.listings.length == 0) {
            return (
                <div>
                    <Header categories={this.state.categories} loggedIn={this.props.session ? true : false}/>
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
                    <Header categories={this.state.categories} loggedIn={this.props.session ? true : false} />
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
                                    return <Listing listing={listing} />
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
                    <Header categories={[]} />
                    <AccountNav activePage={AccountNavSubPage.LISTING} />
                    <Footer categories={[]} />
                </div>
            )
        }

    }
}