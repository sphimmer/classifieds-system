import * as React from "react";
import { ICategory } from "entities/ICategory";
import { Logo } from "./Logo";
import { Size } from "enums/Size";
import { CategoryLinks } from "./CategoryLinks";



interface IFooterProps {
    categories: ICategory[]
}


export class Footer extends React.Component<IFooterProps> {

    render() {

        return (
            <footer className="main-footer padding-y-lg">
                <div className="container max-width-lg">
                    <div className="grid gap-lg">
                        <div className="col-3@lg order-1@lg flex@lg justify-front@lg">
                            <Logo size={Size.lg} />
                        </div>

                        <nav className="col-6@lg order-2@lg text-xs">
                            <CategoryLinks linkOnClick={()=>{}} categories={this.props.categories} />
                        </nav>
                    </div>

                    <div className="main-footer__colophon border-top padding-top-xs margin-top-lg">
                        <div className="text-sm text-xs@md color-contrast-medium flex gap-xs">
                            <span>&copy; myWebsite</span>
                            <a href="#0" className="color-contrast-high">Terms</a>
                            <a href="#0" className="color-contrast-high">Privacy</a>
                        </div>


                    </div>
                </div>
            </footer>
        )


    }
}