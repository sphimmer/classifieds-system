import React, { ChangeEvent } from "react";

interface ITextAreaProps {
    name: string
    label: string
    errorMessage?: string
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

export class TextArea extends React.Component<ITextAreaProps>{
    props: ITextAreaProps;
    constructor(props: ITextAreaProps) {
        super(props)
        this.props = props;
    }
    render() {
        return (
            <div>
                <label className="form-label margin-bottom-xxs" htmlFor={this.props.name}>{this.props.label}</label>
                <textarea className="form-control width-100%" name={this.props.name} onChange={this.props.onChange} maxLength={1500} minLength={5}>

                </textarea>
                <p className="color-error" >{this.props.errorMessage}</p>
            </div>
        )
    }
}