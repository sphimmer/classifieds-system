import React, { MouseEvent } from "react";

interface IButtonProps {
    buttonText: string;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    colorClass?: string;
}

export class Button extends React.Component<IButtonProps> {
    constructor(props: IButtonProps) {
        super(props);
    }

    render() {
        return (
            <div className="margin-bottom-sm">
                <button onClick= {this.props.onClick ? this.props.onClick : (event: MouseEvent<HTMLButtonElement>) => {}} className={this.props.colorClass ? this.props.colorClass + " btn btn--md width-100%" : "btn-cta btn btn--md width-100%" }>{this.props.buttonText}</button>
            </div>
        )
    }
}