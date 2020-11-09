import React from "react";
import { ICategory } from "entities/ICategory";
import { IListingResponse } from "entities/responses/IListingResponse";
import { CategoryService } from "api/CategoryService";
import Container from "typedi";
import { ListingService } from "api/ListingService";
import qs from "query-string";
import { Header } from "components/header";
import { GlobalState } from "services/GlobalState";
import { Footer } from "components/footer";
import { Listing } from "components/listing";
import { Status } from "enums/Status";


interface ISearchPageProps {
    location: Location
}

interface ISearchPageState {
    categories: ICategory[],
    searchResult: IListingResponse[],
    searchTerm?: string,
    status: Status
}

export class SearchPage extends React.Component<ISearchPageProps, ISearchPageState>{
    state: ISearchPageState = {
        categories: [],
        searchResult: [],
        searchTerm: undefined,
        status: Status.INIT
    }
    categoryService: CategoryService = Container.get(CategoryService);
    listingService: ListingService = Container.get(ListingService);
    globalState = Container.get(GlobalState);

    async componentDidUpdate() {

        const urlParams = qs.parse(this.props.location.search);
        console.log(urlParams);
        let listings: IListingResponse[] = [];
        let searchTerm: string = ""
        if (urlParams !== undefined && urlParams.search !== undefined) {
            searchTerm = urlParams.search as string;
            if(searchTerm != this.state.searchTerm){
                listings = await this.listingService.searchListings(searchTerm);
                console.log(listings)
                this.setState({ searchResult: listings, searchTerm })
            }
            

        }
    }

    async componentDidMount() {
        try {
            const categories = await this.categoryService.getCategories();
            const urlParams = qs.parse(this.props.location.search);
            console.log(urlParams);
            let listings: IListingResponse[] = [];
            let searchTerm: string = ""
            if (urlParams !== undefined && urlParams.search !== undefined) {
                searchTerm = urlParams.search as string;
                listings = await this.listingService.searchListings(searchTerm);
                console.log(listings)
            }
            this.setState({ categories, searchResult: listings, searchTerm, status: Status.SUCCESS })
        } catch (error) {
            console.error(error)
        }
    }

    render() {
        return (

            <div>
                <Header searchTerm={this.state.searchTerm} categories={this.state.categories} loggedIn={this.globalState.isLoggedIn} />
                <div className="container max-width-lg padding-y-lg">
                    <h1 className="margin-bottom-xs">Search Results for: {this.state.searchTerm}</h1>
                    <div className="grid gap-md">
                        {/* <SearchBar /> */}

                        {this.state.searchResult.length == 0 &&
                            <p>Sorry, we couldn't find any listings with that phrase. Try searching for something else</p>
                        }
                        {this.state.searchResult.map(listing => {
                            return <Listing key={listing.id} listing={listing} />
                        })}
                    </div>
                </div>
                <Footer categories={this.state.categories} />
            </div>
        )
    }
}