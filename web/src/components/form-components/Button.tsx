import React, { MouseEvent } from "react";
import { Status } from "enums/Status";
import { LoadingBar } from "components/LoadingBar";

interface IButtonProps {
    buttonText: string;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => Promise<boolean | void>;
    colorClass?: string;
}

export class Button extends React.Component<IButtonProps> {
    state = {
        status: Status.INIT
    }
    constructor(props: IButtonProps) {
        super(props);
        this.onclick = this.onclick.bind(this)
    }

    async onclick(event: MouseEvent<HTMLButtonElement>) {
        this.setState({ status: Status.LOADING })
        if (this.props.onClick) {
            const success = await this.props.onClick(event)
            // alert(success)
            if(!success){
                this.setState({ status: Status.INIT })
            }
        }
    }

    render() {
        if (this.state.status == Status.INIT) {
            return (
                <div className="margin-bottom-sm">
                    <button onClick={this.onclick} className={this.props.colorClass ? this.props.colorClass + " btn btn--md width-100%" : "btn-cta btn btn--md width-100%"}>{this.props.buttonText}</button>
                </div>
            )
        } else if (this.state.status == Status.LOADING) {
            return (
                <div className="margin-bottom-sm text-center">
                    {/* <button disabled onClick={this.onclick} className="btn btn--md width-100%">{this.props.buttonText}</button> */}
                    <LoadingBar />
                </div>
            )
        }

    }
}