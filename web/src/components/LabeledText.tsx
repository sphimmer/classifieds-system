import React from "react";

interface ILabeledTextProps {
    className: string
    label: string,
    text?: string,
}
export class LabeledText extends React.Component<ILabeledTextProps>{
    render() {
        return ( 
            <div className={this.props.className}>
                <label className="form-label margin-bottom-xxs font-semibold">{this.props.label}:</label>
                <p>{this.props.text}</p>
            </div>
        )
    }
}