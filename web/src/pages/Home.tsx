import React from "react";
import { Header } from "../components/header";
import { Footer } from "components/footer";
import { CategoryService } from "api/CategoryService";
import { ICategory } from "entities/ICategory";
import { Status } from "enums/Status";
import { ILocalStorage } from "entities/ILocalStorage";
import qs from 'qs';
import Container from "typedi";
import { GlobalState } from "services/GlobalState";
import { PageHistory } from "services/PageHistory";
import { Pages } from "enums/Pages";
import { ListingService } from "api/ListingService";
import { IListingResponse } from "entities/responses/IListingResponse";
import { Listing } from "components/listing";

interface IHomeState {
    categories: ICategory[];
    listings: IListingResponse[];
    status: Status;
    user?: ILocalStorage | null;
}

interface IHomeProps {
    session: ILocalStorage | null
    location: Location
}

export class Home extends React.Component<IHomeProps, IHomeState>{

    categoryService: CategoryService = Container.get(CategoryService);
    listingService: ListingService = Container.get(ListingService);
    state: IHomeState;
    globalState = Container.get(GlobalState);
    constructor(props: any) {
        super(props);
        const urlParams = qs.parse(this.props.location.search);
        console.log(urlParams);
        if(urlParams['?state']){
            const newGlobalState = JSON.parse(atob(urlParams['?state'] as string));
            this.globalState.pageLastVisited = newGlobalState.pageLastVisited;
            this.globalState.setState(newGlobalState.isLoggedIn, newGlobalState.sessionId);
            if(this.globalState.pageLastVisited && this.globalState.pageLastVisited != Pages.LOGIN){
                window.location.replace(this.globalState.pageLastVisited);
            }
            
        }
        const pageHistory = Container.get(PageHistory);
        pageHistory.push(this.props.location.pathname);

        this.state = { categories: [], status: Status.LOADING, listings: []};
        
    }

    async componentDidMount() {
        try {
            const categoryResponse = await this.categoryService.getCategories();
            const listings = await this.listingService.searchListings(null!);
            this.setState({ categories: categoryResponse, status: Status.LOADED, listings: listings})
        } catch (error) {
            this.state.status = Status.FAILED;
            this.setState(this.state);
        }
    }
    render() {

        return (

            <div>
                <Header categories={this.state.categories} loggedIn={this.globalState.isLoggedIn} />
                <div className="container max-width-lg">
                    {/* <div className="col-12@xs">
                        <SearchBar />
                    </div> */}
                    <h2 className="text-center padding-y-sm">RECENT LISTINGS</h2>
                    <div className="grid gap-md col-12">
                    {this.state.listings.map(listing => {
                                    return <Listing listing={listing} />
                                })}
                        {/* <Listing />
                            <Listing />
                            <Listing />
                            <Listing />

                            <Listing />
                            <Listing />
                            <Listing />
                            <Listing /> */}

                    </div>
                    {/* <div className="gap-md col-12">
                        <h3>Ad gutter</h3>
                    </div> */}
                </div>

                <Footer categories={this.state.categories} />
            </div>
        )


    }

}