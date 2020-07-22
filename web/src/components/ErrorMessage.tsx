import React from "react";


export class ErrorMessage extends React.Component{
    render(){
        return(
            <div className="container grid max-width-lg text-component">
                <p>{this.props.children}</p>
            </div>
        )
    }
}