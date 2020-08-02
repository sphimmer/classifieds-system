import 'reflect-metadata';
import { Container } from 'typedi'
import React from "react";
import { ICategory } from "entities/ICategory";
import { CategoryLinks } from "./CategoryLinks";
import { CacheService } from 'api/CacheService';

interface IMegaMenuCategoriesProps {
    categories?: ICategory[];
    isVisible: boolean;
}

interface IMegaMenuCategoriesState{
    categories: ICategory[]
}

export class MegaMenuCategories extends React.Component<IMegaMenuCategoriesProps, IMegaMenuCategoriesState>{
    constructor(props: IMegaMenuCategoriesProps) {
        super(props)
    }

    componentDidMount(){
        if(!this.props.categories){
            const categories = Container.get(CacheService).getCategories();
            console.log(categories)
            console.log(this.props.categories)
            this.setState({categories: categories});
        } 
    }

    render() {
        if (this.props.isVisible) {
            return (
                <div className="container max-width-md position-absolute bg z-index-overlay shadow-lg radius-lg Absolute-Center">
                    <CategoryLinks categories={this.props.categories ? this.props.categories : this.state.categories} />
                </div>
            )
        } else {
            return (<></>)
        }
    }
}