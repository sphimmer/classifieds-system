import { ICategory } from "entities/ICategory"
import React from "react"
import { Link } from "react-router-dom"
import { Pages } from "enums/Pages"

interface ICategoryLinksProps {
    categories: ICategory[]
    linkOnClick: () => void
}
export class CategoryLinks extends React.Component<ICategoryLinksProps> {
    constructor(props: ICategoryLinksProps) {
        super(props)
    }
    render() {
        return (
            <div className="grid gap-lg padding-y-md col-12@sm">
                {this.props.categories.map((category: ICategory) => {
                    return (
                        <div key={category.name} className="col@md">
                            <Link key={category.id} className="font-semibold" onClick={this.props.linkOnClick} to={Pages.CATEGORY + category.slug}>{category.name}</Link>
                            <ul className="padding-y-sm">
                                {category.subcategories!.map((subcategory: ICategory) => {
                                    return (
                                        <li key={subcategory.id} className="padding-y-xxxs"><Link onClick={this.props.linkOnClick} to={Pages.CATEGORY + subcategory.slug}>{subcategory.name}</Link></li>
                                    )
                                })}
                            </ul>
                        </div>
                    )
                })}
            </div>
        )
    }
}