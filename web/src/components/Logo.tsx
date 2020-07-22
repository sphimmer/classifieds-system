import React from "react";
import { Link } from "react-router-dom";
import { Size } from "enums/Size";
import { Pages } from "enums/Pages";

interface ILogoProps {
    size: Size
}

export class Logo extends React.Component<ILogoProps> {
    props: ILogoProps;
    constructor(props: ILogoProps) {
        super(props);
        this.props = props;
    }
    render() {
        return (
            < Link to={Pages.HOME} className={this.props.size < Size.lg ? "f-header__logo" : "f-footer__logo" } >
                <img src="/images/logo-01.png" />
            </ Link >
        )
    }
}