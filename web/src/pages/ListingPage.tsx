import React from "react";
import Container from "typedi";
import { CategoryService } from "api/CategoryService";
import { ListingService } from "api/ListingService";
import { Location } from "history";
import { ICategory } from "entities/ICategory";
import { Status } from "enums/Status";
import { Header } from "components/header";
import { Footer } from "components/footer";
import { IListingResponse } from "entities/responses/IListingResponse";
import { Modal } from "components/Modal";
import { IContactInfo } from "entities/IContactInfo";
import { ButtonLink } from "components/ButtonLink";
import { Pages } from "enums/Pages";
import { PageHistory } from "services/PageHistory";
import moment from "moment";
import { LoadingBar } from "components/LoadingBar";
import { Gallery } from "components/Gallery";

interface IListingPageState {
    listing: IListingResponse,
    categories: ICategory[],
    status: Status,
    contactModalIsVisible: boolean,
    contactInfo?: IContactInfo;
}

interface IListingPageProps {
    location: Location;
}

export class ListingPage extends React.Component<IListingPageProps, IListingPageState>{
    categoryService: CategoryService = Container.get(CategoryService);
    listingService: ListingService = Container.get(ListingService);
    state: IListingPageState = {
        listing: {} as IListingResponse,
        categories: [],
        status: Status.LOADING,
        contactModalIsVisible: false
    }

    constructor(props: IListingPageProps) {
        super(props);
        const pageHistory = Container.get(PageHistory);
        pageHistory.push(this.props.location.pathname);
        this.getContactInfo = this.getContactInfo.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    async componentDidMount() {
        try {
            const pathSplitted = this.props.location.pathname.split('/listings/');
            const id = pathSplitted[1];
            const categories = await this.categoryService.getCategories();
            const listing = await this.listingService.getListing(id);
            this.setState({ status: Status.LOADED, categories: categories, listing: listing });
        } catch (error) {
            console.error(error);
        }
    }

    async getContactInfo() {
        try {
            const contact = await this.listingService.getListingContact(this.state.listing.id);
            this.setState({ contactInfo: contact, contactModalIsVisible: true });
        } catch (error) {
            this.setState({ contactModalIsVisible: true, contactInfo: undefined });
        }
    }

    closeModal() {
        this.setState({ contactModalIsVisible: false });
    }

    render() {
        if (this.state.status == Status.LOADED) {
            return (
                <>
                    <Header categories={this.state.categories} />
                    {/* <div className="container max-width-lg">
                        <div className="grid gap-md">

                            
                            <div className="grid gap-md col-6">

                                <div className="col-12">
                                    <h2 className="text-left padding-y-sm">{this.state.listing.title}</h2>
                                    <div className="grid gap-md col-12 margin-bottom-sm">
                                        <div className="col-4@sm">
                                            <label className="font-semibold">Asking Price:</label>
                                            <p>${this.state.listing.price}</p>
                                        </div>
                                        <div className="col-3@sm">
                                            <label className="font-semibold">Condition:</label>
                                            <p>{this.state.listing.condition}</p>
                                        </div>
                                        <div className="col-5@sm">
                                            <label className="font-semibold">Location: </label>
                                            <p>{this.state.listing.location.city}, {this.state.listing.location.state} {this.state.listing.location.zip}</p>
                                        </div>
                                    </div>

                                    <div className="col-12@sm margin-bottom-sm">
                                        <label className="font-semibold">Description: </label>
                                        <p>{this.state.listing.description}</p>
                                    </div>
                                    <button onClick={this.getContactInfo}  aria-controls="modal-name-1" className="btn btn-cta">Contact Seller</button>
                                </div>
                            </div>
                            <div className="col-6">
                                <img src={this.state.listing.images[0].path} width="100%" />
                            </div>
                        </div>
                    </div> */}

                    <div className="container max-width-lg">
                        <section className="product">
                            {/* <div className="margin-bottom-sm">
                        
                        </div> */}

                            <div className="grid gap-md">
                                <Gallery images={this.state.listing.images}/>

                                <div className="col-6@md col-5@lg">
                                    <div className="margin-bottom-xs">
                                        <h1>{this.state.listing.title}</h1>
                                        <p className="prod-card__details padding-y-xs">{this.state.listing.location ? this.state.listing.location.city + "," : ""} {this.state.listing.location ? this.state.listing.location.state : ""} | {moment(this.state.listing.dateCreated).fromNow()}</p>
                                        <p>{this.state.listing.condition}</p>
                                    </div>



                                    <div className="text-component v-space-sm margin-y-sm">
                                        <p className="text-md"><ins className="text-decoration-none">${this.state.listing.price}</ins></p>
                                        <p>{this.state.listing.description}</p>

                                    </div>

                                    <div className="flex gap-xs">


                                        <button onClick={this.getContactInfo} aria-controls="modal-name-1" className="btn btn-cta flex-grow">Contact Seller</button>
                                        {/* <button className="btn btn--primary flex-grow">Add to Cart</button> */}
                                    </div>
                                    <div className="margin-bottom-md">
                                        <div className="btns gap-xs btns--radio">
                                            <p className="prod-card__details padding-y-xs">Expires {moment(this.state.listing.dateExpires).fromNow()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {(this.state.contactModalIsVisible && this.state.contactInfo) &&
                        <Modal title="Seller's Contact Information" buttonAction={this.closeModal}>
                            <p><label>Email: </label> {this.state.contactInfo.email}</p>
                            <p><label>Phone Number: </label> {this.state.contactInfo.phoneNumber}</p>
                        </Modal>
                    }

                    {(this.state.contactModalIsVisible && !this.state.contactInfo) &&
                        <Modal title="Seller's Contact Information" buttonAction={this.closeModal}>
                            <p>Please log in or create an account to view seller's contact information.</p>
                            <ButtonLink to={Pages.LOGIN}>Login/Create an Account</ButtonLink>
                        </Modal>
                    }
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