import * as React from 'react';
import { IListingResponse } from 'entities/responses/IListingResponse';
import { Link } from 'react-router-dom';
import { Pages } from 'enums/Pages';
import moment from 'moment';

interface IListingProps {
    listing: IListingResponse;
    editable?: boolean
}
export class Listing extends React.Component<IListingProps> {

    render() {
        return (
            <div className="prod-card col-3@md">
                {this.props.editable &&
                    <div>
                        <Link to={Pages.EDIT_LISTING.replace(':id', this.props.listing.id)}>
                            <img className="width-sm inline" src="/images/edit-solid.svg" />
                        </Link>
                    </div>
                }
                {/* <span className="prod-card__badge" role="text">New <i className="sr-only">product</i></span> */}

                <Link to={Pages.LISTING.replace(':id', this.props.listing.id)} className="prod-card__img-link" aria-label="Description of the link">
                    <figure className="prod-card__img media-wrapper media-wrapper--4:3">
                        <img src={this.props.listing.thumbnailImage ? this.props.listing.thumbnailImage : ""} alt={this.props.listing.title} />
                    </figure>
                </Link>

                <div className="prod-card__content text-left">
                    <Link to={Pages.LISTING.replace(':id', this.props.listing.id)}>{this.props.listing.title}</Link>
                    <div className="">
                        <span className="prod-card__price">${this.props.listing.price}</span>
                        <p className="prod-card__details padding-y-xs">{this.props.listing.location ? this.props.listing.location.city + "," : ""} {this.props.listing.location ? this.props.listing.location.state : ""} | {moment(this.props.listing.dateCreated).fromNow()}</p>
                    </div>
                </div>
            </div>
        )
    }
}