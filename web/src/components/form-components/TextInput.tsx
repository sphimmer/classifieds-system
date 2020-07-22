import React, { ChangeEvent } from "react";

interface ITextInputProps {
    label: string;
    divClass: string;
    name: string;
    id: string;
    required: boolean;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    errorMessage?: string;
    type?: string;
    placeholder?: string;
    defaultValue?: string;
}

export class TextInput extends React.Component<ITextInputProps>{

    constructor(props: ITextInputProps) {
        super(props)
    }

    render() {
        return (
            <div className={this.props.divClass}>
                <label className="form-label margin-bottom-xxxs" htmlFor={this.props.name}>{this.props.label}</label>
                <input 
                    onChange={this.props.onChange} 
                    className="form-control width-100%" 
                    type={this.props.type ? this.props.type : "text"} 
                    name={this.props.name} 
                    id={this.props.id} 
                    required={this.props.required ? true : false}
                    placeholder={this.props.placeholder ? this.props.placeholder : undefined}
                    defaultValue={this.props.defaultValue ? this.props.defaultValue : undefined}
                />
                <p className="color-error" >{this.props.errorMessage}</p>
            </div>
        )
    }
}