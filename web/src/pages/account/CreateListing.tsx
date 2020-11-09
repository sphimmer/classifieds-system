import React, { FormEvent, ChangeEvent } from "react";
import { Header } from "components/header";
import { AccountService } from "api/AccountService";
import { CategoryService } from "api/CategoryService";
import { ICategory } from "entities/ICategory";
import { Status } from "enums/Status";
import { AccountNav } from "components/AccountNav";
import { AccountNavSubPage } from "enums/AccountNavSubPage";
import { Footer } from "components/footer";
import { TextInput } from "components/form-components/TextInput";
import { IListing } from "entities/IListing";
import { TextArea } from "components/form-components/TextArea";
import { SelectCategory } from "components/form-components/SelectCategory";
import { Button } from "components/form-components/Button";
import { ListingService } from "api/ListingService";
import { ListingCondition } from "enums/ListingCondition";
import ImageUploader from "react-images-upload";
import { Redirect } from "react-router-dom";
import { Pages } from "enums/Pages";
import Container from "typedi";
import { GlobalState } from "services/GlobalState";
import { IUser } from "entities/IUser";
import { ILocation } from "entities/ILocation";
import { LoadingBar } from "components/LoadingBar";
import { PageHistory } from "services/PageHistory";
import { Listing } from "components/listing";
import { ListingRequest } from "entities/requests/ListingRequest";

interface ICreateListingProps {
    accountService: AccountService;
    categoryService: CategoryService;
    listingService: ListingService;
    location: Location
}

interface ICreateListingState {
    categories: ICategory[];
    status: Status,
    listing: IListing,
    imageFiles: File[],
    account: IUser,
    validationErrors: {
        title?: string,
        price?: string,
        condition?: string,
        description?: string,
        category?: string,
        images?: string
    }
}

export class CreateListing extends React.Component<ICreateListingProps, ICreateListingState> {
    categoryService: CategoryService;
    accountService: AccountService;
    state: ICreateListingState = {
        categories: [],
        status: Status.INIT,
        imageFiles: [],
        listing: {} as IListing,
        validationErrors: {},
        account: {} as IUser
    }

    formRef = React.createRef<SelectCategory>();
    globalState = Container.get(GlobalState);

    constructor(props: ICreateListingProps) {
        super(props);
        const pageHistory = Container.get(PageHistory);
        pageHistory.push(this.props.location.pathname);

        this.categoryService = props.categoryService;
        this.accountService = props.accountService;
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangePrice = this.onChangePrice.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.saveListing = this.saveListing.bind(this);
        this.onChangeCondition = this.onChangeCondition.bind(this);
        this.onChangeImage = this.onChangeImage.bind(this);
    }

    async componentDidMount() {

        const categories = await this.categoryService.getCategories();
        let status: Status;
        let location: ILocation;
        if (!this.globalState.isLoggedIn) {
            status = Status.NOT_AUTHENTICATED;
        } else {
            try {
                const account = await this.accountService.getFullProfile();
                location = account.location!;
                status = Status.LOADED;
            } catch (error) {
                status = Status.NOT_AUTHENTICATED;
            }

        }
        this.setState({ status: status, categories: categories, listing: { location: location! } as IListing })
    }

    async saveListing(event: FormEvent<HTMLElement>): Promise<boolean> {
        event.preventDefault();
        this.state.listing.category = this.formRef.current!.state.subcategory ? this.formRef.current!.state.subcategory! : this.formRef.current!.state.category!;
        this.setState(this.state);
        const isValid = this.validateFields();
        if (isValid) {
            const listing = this.state.listing;
            const imageUploadResponses = await this.props.listingService.uploadImages(this.state.imageFiles);
            const uploadSuccess = imageUploadResponses.map(resp => {
                if (resp.status !== 200) {
                    console.error("Error uploading file: " + resp.fileName);
                    console.error(resp)
                    return false;
                } else {
                    return true;
                }
            });
            if (uploadSuccess.includes(false)){
                this.setState({validationErrors: {images: "Error uploading image files"}});
            } else {
                const listingRequest = new ListingRequest(this.state.listing, imageUploadResponses);
                const response = await this.props.listingService.createListing(listingRequest)
                // TODO handle errors
                this.state.status = Status.SUCCESS;
                this.setState(this.state);
            }
            
        }
        return isValid;

        // this.props.listingService.createListing(this.state.listing);
    }

    validateDescription() {
        if (!this.state.listing.description) {
            this.state.validationErrors.description = "Please enter a valid description. Must be longer than 5 characters and less than 1,000 characters";
        } else if (this.state.listing.description.length < 5) {
            this.state.validationErrors.description = "Description must be longer than 5 charaters.";
        } else if (this.state.listing.description.length > 1500) {
            this.state.validationErrors.description = "Descriptioin must be less than 1,000 characters.";
        } else {
            this.state.validationErrors.description = undefined;
        }
        this.setState(this.state);
    }

    validateCondition() {
        if (!this.state.listing.condition || (this.state.listing.condition != ListingCondition.NEW && this.state.listing.condition != ListingCondition.USED)) {
            this.state.validationErrors.condition = "Please select New or Used condition";
        } else {
            this.state.validationErrors.condition = undefined;
        }
        this.setState(this.state);
    }

    validateFields(): boolean {
        this.validateTitle();
        this.validatePrice();
        this.validateCategory();
        this.validateDescription();
        this.validateCondition();
        this.validateImages();

        return !this.state.validationErrors.title
            && !this.state.validationErrors.price
            && !this.state.validationErrors.category
            && !this.state.validationErrors.description
            && !this.state.validationErrors.condition
            && !this.state.validationErrors.images
    }

    validateTitle() {
        if (!this.state.listing.title || this.state.listing.title.length < 2) {
            this.state.validationErrors.title = "Please set a valid title. Must have a length of 2 or more.";
        } else {
            this.state.validationErrors.title = undefined;
        }
        this.setState(this.state)
    }

    async onChangeTitle(event: ChangeEvent<HTMLInputElement>) {
        this.state.listing.title = event.target.value;
        this.setState(this.state);
        this.validateTitle();
    }

    validatePrice() {
        if (this.state.listing.price >= 0) {
            this.state.validationErrors.price = undefined;
        } else {
            this.state.validationErrors.price = "Set a price for the item in US Dollars.";
        }
    }

    async onChangePrice(event: ChangeEvent<HTMLInputElement>) {
        const price = parseFloat(event.target.value);
        this.state.listing.price = price;
        this.setState(this.state);
        this.validatePrice();
    }

    async onChangeDescription(event: ChangeEvent<HTMLTextAreaElement>) {
        this.state.listing.description = event.target.value;
        this.setState(this.state);
        this.validateDescription();
    }

    async onChangeCondition(event: ChangeEvent<HTMLSelectElement>) {
        const targetValue = event.target.value;

        if (targetValue == ListingCondition.USED) {
            this.state.listing.condition = ListingCondition.USED;
        } else if (targetValue == ListingCondition.NEW) {
            this.state.listing.condition = ListingCondition.NEW;
        } else {
            this.state.listing.condition = ListingCondition.USED;
        }
        this.setState(this.state);
        this.validateCondition();
    }

    validateCategory() {
        if (!this.state.listing.category) {
            this.state.validationErrors.category = "Please select a category.";
        } else {
            this.state.validationErrors.category = undefined;
        }
        this.setState(this.state);
    }

    validateImages() {
        // console.log(this.state.listing.images)
        if ((!this.state.imageFiles || this.state.imageFiles.length < 1)) {
            this.state.validationErrors.images = "Please provide at least 1 image";
        } else {
            this.state.validationErrors.images = undefined;
        }
        this.setState(this.state)
    }

    async onChangeImage(files: File[], pictures: string[]) {
        // this.state.listing.images = files;
        console.log(files);
        await this.setState({ imageFiles: files });
        this.validateImages();
    }

    render() {
        if (this.state.status == Status.LOADED) {
            return (
                <div>
                    <Header categories={this.state.categories} loggedIn={this.globalState.isLoggedIn} />
                    <AccountNav activePage={AccountNavSubPage.LISTING} />
                    <form className="sign-up-form" >
                        <div className="container max-width-sm">
                            <div className="margin-bottom-sm">
                                <div className="grid gap-md">
                                    <h4 className="padding-y-sm">Post An Item for Sale</h4>

                                    <TextInput
                                        label="Listing Title"
                                        name="title"
                                        required={true}
                                        divClass="col-12@sm"
                                        id="title"
                                        onChange={this.onChangeTitle}
                                        errorMessage={this.state.validationErrors.title}
                                    />
                                    <TextInput
                                        label="Price $"
                                        name="title"
                                        required={true}
                                        divClass="col-6@sm"
                                        id="title"
                                        onChange={this.onChangePrice}
                                        type="number"
                                        errorMessage={this.state.validationErrors.price}
                                    />
                                    <div className="margin-bottom-md col-6@sm">
                                        <label className="form-label margin-bottom-xxxs" htmlFor="selectThis">Select Condition:</label>

                                        <div className="select">
                                            <select onChange={this.onChangeCondition} className="select__input form-control" name="selectThis" id="selectThis">
                                                <option></option>
                                                <option value={ListingCondition.USED}>{ListingCondition.USED}</option>
                                                <option value={ListingCondition.NEW}>{ListingCondition.NEW}</option>

                                            </select>
                                            <svg className="icon select__icon" aria-hidden="true" viewBox="0 0 16 16"><g stroke-width="1" stroke="currentColor"><polyline fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="15.5,4.5 8,12 0.5,4.5 "></polyline></g></svg>
                                        </div>
                                        <p className="color-error" >{this.state.validationErrors.condition}</p>
                                    </div>

                                    <TextArea name="description" label="Description" onChange={this.onChangeDescription} errorMessage={this.state.validationErrors.description} />

                                    <SelectCategory ref={this.formRef} categories={this.state.categories} categoryService={this.categoryService} errorMessage={this.state.validationErrors.category} />

                                    <ImageUploader
                                        withIcon={true}
                                        buttonText="Choose images"
                                        onChange={this.onChangeImage}
                                        imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                                        maxFileSize={5242880}
                                        buttonClassName="btn btn--primary"
                                        withPreview={true}
                                        errorClass="color-error"
                                    />

                                    <p className="color-error" >{this.state.validationErrors.images}</p>

                                    <Button onClick={this.saveListing} buttonText="Create Listing" />
                                </div>
                            </div>
                        </div>
                    </form >
                    <Footer categories={this.state.categories} />
                </div >
            )

        } else if (this.state.status === Status.SUCCESS) {
            return <Redirect to={Pages.MY_LISTINGS} />
        } else if (this.state.status == Status.NOT_AUTHENTICATED) {
            return <Redirect to={Pages.LOGIN + "?error=Please Login to create a listing."} />
        } else if (this.state.status == Status.INIT) {
            return (
                <div>
                    <Header categories={[]} />
                    <AccountNav activePage={AccountNavSubPage.LISTING} />
                    <div className="container grid gap-md">
                        <div className="col-2 offset-5"><LoadingBar /></div>
                    </div>
                    <Footer categories={[]} />
                </div>
            )
        }
    }
}