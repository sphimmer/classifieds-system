import React, { MouseEvent, ChangeEvent } from "react";
import { IListingResponse } from "entities/responses/IListingResponse";
import { ListingService } from "api/ListingService";
import Container from "typedi";
import { Pages } from "enums/Pages";
import { Header } from "components/header";
import { Footer } from "components/footer";
import { Status } from "enums/Status";
import { CategoryService } from "api/CategoryService";
import { PageHistory } from "services/PageHistory";
import { ICategory } from "entities/ICategory";
import { AccountNav } from "components/AccountNav";
import { AccountNavSubPage } from "enums/AccountNavSubPage";
import { TextInput } from "components/form-components/TextInput";
import { ListingCondition } from "enums/ListingCondition";
import { TextArea } from "components/form-components/TextArea";
import { SelectCategory } from "components/form-components/SelectCategory";
import ImageUploader from "react-images-upload";
import { IconX } from "components/form-components/IconX";
import { IListingImage } from "entities/responses/IListingImage";
import { Button } from "components/form-components/Button";
import { ListingUpdateRequest } from "entities/requests/ListingUpdateRequest";
import { Redirect } from "react-router-dom";

interface IEditListingProps {
    location: Location,
}

interface IEditListingState {
    status: Status,
    listing: IListingResponse,
    newImageFiles: File[],
    categories: ICategory[],
    validationErrors: {
        title?: string,
        price?: string,
        condition?: string,
        description?: string,
        category?: string,
        images?: string
    }
}
export class EditListing extends React.Component<IEditListingProps, IEditListingState>{
    state: IEditListingState = {
        status: Status.LOADING,
        listing: {} as IListingResponse,
        newImageFiles: [],
        categories: [],
        validationErrors: {}
    }
    formRef = React.createRef<SelectCategory>();

    private listingService: ListingService = Container.get(ListingService);
    private categoryService: CategoryService = Container.get(CategoryService);

    constructor(props: IEditListingProps) {
        super(props);
        this.delete = this.delete.bind(this)
        const pageHistory = Container.get(PageHistory);
        pageHistory.push(this.props.location.pathname);
        this.onChangeImage = this.onChangeImage.bind(this);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangePrice = this.onChangePrice.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.saveListing = this.saveListing.bind(this);
        this.onChangeCondition = this.onChangeCondition.bind(this);
        this.onChangeImage = this.onChangeImage.bind(this);
    }

    async delete(event: MouseEvent<HTMLButtonElement>) {
        const areYouSure = window.confirm("Are you sure you want to delete this listing? You cannot undo this.");
        if(areYouSure){
            const response = await this.listingService.deleteListing(this.state.listing.id);
            if (response) {
                window.location.replace(Pages.MY_LISTINGS);
            } else {
                alert("Error Deleting Lising")
            }
        }
    }

    async componentDidMount() {
        const listingId = this.props.location.pathname.split('/listings/')[1].split('/edit')[0];
        // alert(listingId)
        try {
            const categories = await this.categoryService.getCategories();
            const listing = await this.listingService.getListing(listingId);

            this.setState({ listing: listing, categories, status: Status.LOADED })
        } catch (error) {
            console.error(error);
        }
    }

    async saveListing(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        const listing = this.state.listing;
        listing.category = this.formRef.current!.state.subcategory ? this.formRef.current!.state.subcategory! : this.formRef.current!.state.category!;
        await this.setState({ listing });
        const isValid = this.validateFields();
        if (isValid) {
            if (this.state.newImageFiles.length > 0) {
                const imageUploadResponses = await this.listingService.uploadImages(this.state.newImageFiles);
                const uploadSuccess = imageUploadResponses.map(resp => {
                    if (resp.status !== 200) {
                        console.error("Error uploading file: " + resp.fileName);
                        console.error(resp)
                        return false;
                    } else {
                        return true;
                    }
                });

                if (uploadSuccess.includes(false)) {
                    this.setState({ validationErrors: { images: "Error uploading image files" } });
                } else {
                    imageUploadResponses.forEach(resp => { listing.images.push({ path: resp.uploadPath }); });
                    // console.log(newImages)
                    // listing.images.concat(newImages)
                    console.log(listing)
                    const listingRequest = new ListingUpdateRequest(listing);
                    const response = await this.listingService.updateListing(listingRequest)
                    this.setState({ status: Status.SUCCESS });
                }
            } else {
                const listingRequest = new ListingUpdateRequest(listing);
                const response = await this.listingService.updateListing(listingRequest)
                this.setState({ status: Status.SUCCESS });
            }



        }
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
        if (!this.state.listing.price || this.state.listing.price < 0) {
            this.state.validationErrors.price = "Set a price for the item in US Dollars.";
        } else {
            this.state.validationErrors.price = undefined;
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
        if (this.state.newImageFiles.length < 1 && this.state.listing.images.length < 1) {
            this.state.validationErrors.images = "Please provide at least 1 image";
        } else {
            this.state.validationErrors.images = undefined;
        }
        this.setState(this.state)
    }

    async onChangeImage(files: File[]) {
        // const listing = this.state.listing;
        // listing.images = files;
        await this.setState({ newImageFiles: files });
        this.validateImages();
    }

    removeImage(imageToRemove: IListingImage) {
        const listing = this.state.listing;
        listing.images = listing.images.filter(existingImage => {
            if (imageToRemove.path != existingImage.path) {
                return existingImage
            }
        })
        console.log(listing.images);
        this.setState({ listing });
    }

    render() {
        if (this.state.status == Status.LOADING) {
            return (
                <>
                    <Header categories={[]} />
                    {/* <button>{this.props.listing.id}</button> */}
                    <Footer categories={[]} />
                </>
            )
        } else if (this.state.status == Status.LOADED) {
            return (<>
                <Header categories={this.state.categories} />
                <AccountNav activePage={AccountNavSubPage.LISTING} />
                <div className="container max-width-lg">
                    <div className="grid gap-md col-12">
                        <form className="sign-up-form" >
                            <div className="container max-width-sm">
                                <div className="margin-bottom-sm">
                                    <div className="grid gap-md">
                                        <div className="col-9@sm">
                                            <h4 className="padding-y-sm">Edit Listing</h4>

                                        </div>
                                        <div className="col-3@sm margin-top-sm">
                                            <Button onClick={this.delete} buttonText="Delete Listing" colorClass="btn--accent" />

                                        </div>
                                        <div className="col-12@sm">
                                            <label className="form-label margin-bottom-xxxs">Listing Id</label>
                                            <p>{this.state.listing.id}</p>
                                        </div>
                                        <TextInput
                                            label="Listing Title"
                                            name="title"
                                            required={true}
                                            divClass="col-12@sm"
                                            id="title"
                                            onChange={this.onChangeTitle}
                                            errorMessage={this.state.validationErrors.title}
                                            defaultValue={this.state.listing.title}
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
                                            defaultValue={this.state.listing.price.toString()}
                                        />
                                        <div className="margin-bottom-md col-6@sm">
                                            <label className="form-label margin-bottom-xxxs" htmlFor="selectThis">Select Condition:</label>

                                            <div className="select">
                                                <select onChange={this.onChangeCondition} className="select__input form-control" name="selectThis" id="selectThis">
                                                    <option></option>
                                                    <option selected={this.state.listing.condition == ListingCondition.USED} value={ListingCondition.USED}>{ListingCondition.USED}</option>
                                                    <option selected={this.state.listing.condition == ListingCondition.NEW} value={ListingCondition.NEW}>{ListingCondition.NEW}</option>

                                                </select>
                                                <svg className="icon select__icon" aria-hidden="true" viewBox="0 0 16 16"><g stroke-width="1" stroke="currentColor"><polyline fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="15.5,4.5 8,12 0.5,4.5 "></polyline></g></svg>
                                            </div>
                                            <p className="color-error" >{this.state.validationErrors.condition}</p>
                                        </div>

                                        <TextArea name="description" label="Description" onChange={this.onChangeDescription} errorMessage={this.state.validationErrors.description}>
                                            {this.state.listing.description}
                                        </TextArea>



                                        <SelectCategory selectedCategory={this.state.listing.category} ref={this.formRef} categories={this.state.categories} categoryService={this.categoryService} errorMessage={this.state.validationErrors.category} />

                                        {
                                            this.state.listing.images.map((image) => {
                                                return (
                                                    <div className="col-4@md">

                                                        <IconX action={() => { this.removeImage(image) }} />
                                                        <img src={image.path} />

                                                    </div>
                                                )
                                            })
                                        }
                                        <h4>Upload Additional Images</h4>
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

                                        {/* <div className="col-9@sm"> */}
                                            <Button onClick={this.saveListing} buttonText="Save Listing" />

                                        {/* </div> */}


                                    </div>
                                </div>
                            </div>
                        </form >

                    </div>
                </div>
                <Footer categories={this.state.categories} />
            </>)
        } else if (this.state.status === Status.SUCCESS) {
            return <Redirect to={Pages.MY_LISTINGS} />
        } else {
            return (<></>)
        }

    }
}