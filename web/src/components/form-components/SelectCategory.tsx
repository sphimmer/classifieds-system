import React, { ChangeEvent } from "react";
import { ICategory } from "entities/ICategory";
import { CategoryService } from "api/CategoryService";
import Container from "typedi";

interface ISelectCategoryProps {
    categories: ICategory[];
    categoryService: CategoryService;
    ref: React.RefObject<SelectCategory>;
    errorMessage?: string;
    selectedCategory?: ICategory;
}

interface ISelectCategoryState {
    category?: ICategory;
    subcategory?: ICategory;
    selectedCategory?: ICategory;
}

export class SelectCategory extends React.Component<ISelectCategoryProps>{
    props: ISelectCategoryProps;
    state: ISelectCategoryState = {
        category: undefined,
        subcategory: undefined,
        selectedCategory: undefined
    };

    constructor(props: ISelectCategoryProps) {
        super(props);
        this.props = props;
        this.selectCatecory = this.selectCatecory.bind(this);
        this.selectSubCatecory = this.selectSubCatecory.bind(this);
        console.log(this.props.selectedCategory)
    }

    async componentDidMount() {
        if (this.props.selectedCategory) {
            const category = await this.props.categoryService.getCategory(this.props.selectedCategory.id)
            if(category.parentCategory){
                const parentCategory = await this.props.categoryService.getCategory(category.parentCategory.id)
                this.setState({ selectedCategory: category, category: parentCategory });
            } else {
                this.setState({selectedCategory: category, category: category});
            }
        }
    }

    async selectCatecory(event: ChangeEvent<HTMLSelectElement>) {
        const categoryId = event.target.value;
        console.log(categoryId);
        this.state.category = await this.props.categoryService.getCategory(categoryId);
        this.setState(this.state);
    }

    async selectSubCatecory(event: ChangeEvent<HTMLSelectElement>) {
        const subCategoryId = event.target.value;
        this.state.subcategory = this.state.category!.subcategories!.filter((category) => {
            return category.id === subCategoryId;
        })[0];
        this.setState(this.state);
    }

    render() {

        if(this.state.selectedCategory){
            return (
                <>
                    <div className="margin-bottom-md col-6@sm">
                        <label className="form-label margin-bottom-xxxs" htmlFor="selectThis">Select a Category:</label>
    
                        <div className="select">
                            <select onChange={this.selectCatecory} className="select__input form-control" name="selectThis" id="selectThis">
                                <option></option>
                                {
                                    this.props.categories.map((category) => {
                                        if(this.state.selectedCategory && this.state.selectedCategory.parentCategory && this.state.selectedCategory.parentCategory.id == category.id){
                                            return (
                                                <option selected value={category.id}>{category.name}</option>
                                            )
                                        } else if (this.state.selectedCategory && this.state.selectedCategory.id == category.id){
                                            return (
                                                <option selected value={category.id}>{category.name}</option>
                                            )
                                        } else {
                                            return (
                                                <option value={category.id}>{category.name}</option>
                                            )
                                        }
                                        
                                    })
                                }
                            </select>
    
                            <svg className="icon select__icon" aria-hidden="true" viewBox="0 0 16 16"><g strokeWidth="1" stroke="currentColor"><polyline fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" points="15.5,4.5 8,12 0.5,4.5 "></polyline></g></svg>
                        </div>
                        <p className="color-error" >{this.props.errorMessage}</p>
                    </div>
                    <div className="col-6@sm">
                        <label className="form-label margin-bottom-xxxs" htmlFor="selectThis">Select a Sub Category:</label>
    
                        <div className="select">
                            <select disabled={!this.state.category ? true : false} onChange={this.selectSubCatecory} className="select__input form-control" name="selectThis" id="selectThis">
                                <option></option>
                                {
    
                                    this.state.category !== undefined ? this.state.category.subcategories!.map((category) => {
                                        if (this.state.selectedCategory && this.state.selectedCategory.id == category.id) {
                                            return (
                                                <option selected value={category.id}>{category.name}</option>
                                            )
                                        } else {
                                            return (
                                                <option value={category.id}>{category.name}</option>
                                            )
                                        }
                                        
                                    }) : <option></option>
                                }
                            </select>
    
                            <svg className="icon select__icon" aria-hidden="true" viewBox="0 0 16 16"><g strokeWidth="1" stroke="currentColor"><polyline fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" points="15.5,4.5 8,12 0.5,4.5 "></polyline></g></svg>
                        </div>
                    </div>
                </>
            )
        } else {
            return (
                <>
                    <div className="margin-bottom-md col-6@sm">
                        <label className="form-label margin-bottom-xxxs" htmlFor="selectThis">Select a Category:</label>
    
                        <div className="select">
                            <select onChange={this.selectCatecory} className="select__input form-control" name="selectThis" id="selectThis">
                                <option></option>
                                {
                                    this.props.categories.map((category) => {
                                        return (
                                            <option value={category.id}>{category.name}</option>
                                        )
                                    })
                                }
                            </select>
    
                            <svg className="icon select__icon" aria-hidden="true" viewBox="0 0 16 16"><g strokeWidth="1" stroke="currentColor"><polyline fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" points="15.5,4.5 8,12 0.5,4.5 "></polyline></g></svg>
                        </div>
                        <p className="color-error" >{this.props.errorMessage}</p>
                    </div>
                    <div className="col-6@sm">
                        <label className="form-label margin-bottom-xxxs" htmlFor="selectThis">Select a Sub Category:</label>
    
                        <div className="select">
                            <select disabled={!this.state.category ? true : false} onChange={this.selectSubCatecory} className="select__input form-control" name="selectThis" id="selectThis">
                                <option></option>
                                {
    
                                    this.state.category !== undefined ? this.state.category.subcategories!.map((category) => {
                                        return (
                                            <option value={category.id}>{category.name}</option>
                                        )
                                    }) : <option></option>
                                }
                            </select>
    
                            <svg className="icon select__icon" aria-hidden="true" viewBox="0 0 16 16"><g strokeWidth="1" stroke="currentColor"><polyline fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" points="15.5,4.5 8,12 0.5,4.5 "></polyline></g></svg>
                        </div>
                    </div>
                </>
            )
        }

        
    }
}