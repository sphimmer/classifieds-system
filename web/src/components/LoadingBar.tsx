import React from "react";

export class LoadingBar extends React.Component {
    render() {
        return (


            <div className="fill-loader fill-loader--v4" role="alert">
                <p className="fill-loader__label">Content is loading...</p>
                <div aria-hidden="true">
                    <div className="fill-loader__base"></div>
                    <div className="fill-loader__fill"></div>
                </div>
            </div>


        )
    }
}