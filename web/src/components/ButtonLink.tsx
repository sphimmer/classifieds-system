import { Link } from "react-router-dom";
import React from "react";

interface IButtonLinkProps{
    to: string
    children:any;
}

export class ButtonLink extends React.Component<IButtonLinkProps> {
    to: string;

    children:any;
    constructor(props: IButtonLinkProps){
        super(props)
        this.to = props.to;
        this.children = props.children;
    }
    render(){
        return(<Link to={this.to} className="f-header__btn btn btn-cta">{this.children}</Link>)
    }
}