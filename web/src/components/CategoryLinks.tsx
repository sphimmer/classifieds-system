import { ICategory } from "entities/ICategory"
import React from "react"
import { Link } from "react-router-dom"

interface ICategoryLinksProps {
    categories: ICategory[]
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
                        <div key={category.name} className="col">
                            <Link key={category.id} className="font-semibold text-decoration-none" to={"/category/" + category.name}>{category.name}</Link>
                            <ul className="padding-y-sm">
                                {category.subcategories!.map((subcategory: ICategory) => {
                                    return (
                                        <li key={subcategory.id} className="padding-y-xxxs"><Link to={"/category/" + category.name + "/" + subcategory.name}>{subcategory.name}</Link></li>
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