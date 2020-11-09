import React from "react";

interface IconXProps {
    action: () => void;
}

export class IconX extends React.Component<IconXProps> {
    render() {
        return (
            <div className="icon text-md cursor-pointer" >
                <img onClick={this.props.action} src="/images/times-circle-solid.svg" />
            </div>
        )
    }
}