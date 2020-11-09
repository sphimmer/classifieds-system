import React, { Props, ComponentProps } from "react";
import { Header } from "components/header";
import { CategoryService } from "api/CategoryService";
import Container from "typedi";
import { ICategory } from "entities/ICategory";
import { Location } from "history";
import { Pages } from "enums/Pages";
import { Status } from "enums/Status";
import { Footer } from "components/footer";
import { Listing } from "components/listing";
import { IListingResponse } from "entities/responses/IListingResponse";
import { PageHistory } from "services/PageHistory";
import { LoadingBar } from "components/LoadingBar";


interface ICategoryPageState {
    categories: ICategory[],
    listings: IListingResponse[],
    status: Status
    pathName: string
    pageCategory: ICategory
}

interface ICategoryPageProps {
    location: Location
}

export class CategoryPage extends React.Component<ICategoryPageProps, ICategoryPageState> {
    categoryService: CategoryService = Container.get(CategoryService);
    state: ICategoryPageState = {
        status: Status.LOADING,
        listings: [],
        categories: [],
        pathName: '',
        pageCategory: null!
    }

    pageHistory = Container.get(PageHistory);
    constructor(props: ICategoryPageProps){
        super(props)
        
        this.pageHistory.push(this.props.location.pathname);
    }

    componentDidUpdate() {
        if (this.state.pathName != this.props.location.pathname) {
            this.setState({ pathName: this.props.location.pathname });
            this.loadPage();
        }
        // console.log(this.props.location)
    }
    async componentDidMount() {
        const categories = await this.categoryService.getCategories();
        this.setState({ categories: categories, pathName: this.props.location.pathname });
        await this.loadPage();
    }

    private async loadPage() {
        this.setState({ status: Status.LOADING });
        this.pageHistory.push(this.props.location.pathname);
        try {
            const locationSlug = this.props.location.pathname.replace(Pages.CATEGORY, '');
            console.log(locationSlug);
            let pageCategory: ICategory | undefined = undefined;
            const pCategories = this.state.categories;
            for (let i = 0; i < pCategories.length; i++) {
                const pCat = pCategories[i];
                if (pCat.slug == locationSlug) {
                    pageCategory = pCat
                }
                if (pCat.subcategories) {
                    for (let s = 0; s < pCat.subcategories.length; s++) {
                        const sCat = pCat.subcategories[s];
                        if (sCat.slug == locationSlug) {
                            pageCategory = sCat;
                            break;
                        }

                    }
                }
                if (pageCategory) {
                    break;
                }

            }


            if (pageCategory) {
                const listings = await this.categoryService.getListingsByCategoryId(pageCategory.id)
                this.setState({ status: Status.LOADED, pageCategory: pageCategory, listings: listings });
            }


        } catch (error) {

        }
        console.log(this.props)
    }
    render() {
        if (this.state.status == Status.LOADED) {
            return (
                <>
                    <Header categories={this.state.categories} />
                    <div className="container max-width-lg">
                        <div className="grid gap-md">
                            <h1>{this.state.pageCategory.name}</h1>
                            {this.state.listings.map(listing => {
                                return <Listing key={listing.id} listing={listing} />
                            })}
                        </div>
                    </div>
                    <Footer categories={this.state.categories} />
                </>
            )
        } else {
            return (
                <>
                    <Header categories={[]} />
                    <div className="container grid gap-md">
                        <div className="col-2 offset-5"><LoadingBar /></div>
                    </div>
                    <Footer categories={[]} />

                </>
            )
        }

    }
}