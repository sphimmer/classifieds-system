import React, { MouseEvent } from "react";
import { IListingImage } from "entities/responses/IListingImage";
import { Status } from "enums/Status";
import { LoadingBar } from "./LoadingBar";

interface IGalleryProps {
    images: IListingImage[];
}

interface IGalleryState {
    mainImage: IListingImage;
    status: Status;
}

export class Gallery extends React.Component<IGalleryProps, IGalleryState>{
    state: IGalleryState = {
        mainImage: { path: "" },
        status: Status.LOADING
    }

    constructor(props: IGalleryProps) {
        super(props);
        this.setMainImage = this.setMainImage.bind(this);
    }

    componentDidMount() {
        const mainImage: IListingImage = this.props.images[0];
        this.setState({ mainImage, status: Status.LOADED });
    }

    async setMainImage(event: MouseEvent<HTMLImageElement>){
        console.log(event.currentTarget.src)
        this.setState({mainImage: {path: event.currentTarget.src}})
    }

    render() {
        if (this.state.status == Status.LOADING) {
            return(
                <div className="col-6@md grid gap-sm col-7@lg">
                    <LoadingBar/>
                </div>
            )
        } else if (this.state.status == Status.LOADED){
            return (
                <div className="col-6@md grid gap-sm col-7@lg">
                    <figure className="image-zoom js-image-zoom ">
                        <img className="image-zoom__preview js-image-zoom__preview" src={this.state.mainImage.path} alt="Preview image description" />
                        {/* <figcaption className="sr-only">Picture of {this.props.title}</figcaption> */}
                    </figure>
                    {this.props.images.map((image: IListingImage) => {
                        return (
                            <div className="col-2@sm">
                                <img className="cursor-pointer" onClick={this.setMainImage} src={image.path} />
                            </div>
                        )
                    })}
                </div>
            )
        }
        
    }
}