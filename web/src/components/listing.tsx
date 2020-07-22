import * as React from 'react';
import { IListingResponse } from 'entities/responses/IListingResponse';

interface IListingProps {
    listing: IListingResponse;
}
export class Listing extends React.Component<IListingProps> {

    render() {
        return (
            <div className="prod-card col-3@md">
                {/* <span className="prod-card__badge" role="text">New <i className="sr-only">product</i></span> */}

                <a href="#0" className="prod-card__img-link" aria-label="Description of the link">
                    <figure className="prod-card__img media-wrapper media-wrapper--4:3">
                        <img src={this.props.listing.images[0].path} alt={this.props.listing.title} />
                    </figure>
                </a>

                <div className="prod-card__content text-left">
                    <a href="#0">{this.props.listing.title}</a>
                    <div className="">
                        <span className="prod-card__price">${this.props.listing.price}</span>
                        <p className="prod-card__details padding-y-xs">{this.props.listing.user!.location ? this.props.listing.user!.location.city+"," : ""} {this.props.listing.user!.location ? this.props.listing.user!.location.state : ""} | 1 hour</p>
                    </div>
                </div>
            </div>
        )
    }
}