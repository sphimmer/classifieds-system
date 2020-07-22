import React from "react";
import { Header } from "../components/header";
import { Listing } from "components/listing";
import { Footer } from "components/footer";
import { CategoryService } from "api/CategoryService";
import { ICategory } from "entities/ICategory";
import { Status } from "enums/Status";
import { SearchBar } from "components/searchbar";

interface IHomeState {
    categories: ICategory[];
    status: Status;
}

interface IHomeProps {

}

export class Home extends React.Component<IHomeProps, IHomeState>{
    
    categoryService: CategoryService = new CategoryService();
    state: IHomeState
    constructor(props: any) {
        super(props)
        
        this.state = {categories: [], status: Status.LOADING};
    }


    async componentDidMount() {
        try {
            const categoryResponse = await this.categoryService.getCategories();
            this.setState({categories: categoryResponse, status: Status.LOADED})
        } catch (error) {
            this.state.status = Status.FAILED;
            this.setState(this.state);
        }
    }
    render() {
        if (this.state.status == Status.LOADED) {
            return (
            
                <div>
                    <Header categories={this.state.categories} />
                    <div className="container max-width-lg">
                        <div className="col-12@xs">
                            <SearchBar />
                        </div>
                        <h2 className="text-center padding-y-sm">RECENT LISTINGS</h2>
                        <div className="grid gap-md col-12">
    
                            {/* <Listing />
                            <Listing />
                            <Listing />
                            <Listing />

                            <Listing />
                            <Listing />
                            <Listing />
                            <Listing /> */}
    
                        </div>
                        <div className="gap-md col-12">
                            <h3>Ad gutter</h3>
                        </div>
                    </div>
    
                    <Footer categories={this.state.categories}/>
                </div>
            )
        } else {
            return <div>Loading...</div>
        }
        
    }

}