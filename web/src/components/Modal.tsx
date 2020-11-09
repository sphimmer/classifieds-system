import React, { JSXElementConstructor } from "react";

interface IModalProps{
    title: string;
    buttonAction: () => void;
    children: React.ReactNode;
}

export class Modal extends React.Component <IModalProps>{
    
    componentDidMount() {
     
    }

    render() {
        return (
            <>


        <div className="modal modal--is-visible modal--animate-scale flex flex-center bg-contrast-higher bg-opacity-90% padding-md js-modal" id="modal-name-1">
            <div className="modal__content width-100% max-width-xs bg radius-md shadow-md" role="alertdialog" aria-labelledby="modal-title-1" aria-describedby="modal-description-1">
                <header className="bg-contrast-lower padding-y-sm padding-x-md flex items-center justify-between">
                    <h4 className="text-truncate" id="modal-title-1">{this.props.title}</h4>

                    {/* <button className="reset modal__close-btn modal__close-btn--inner hide@md js-modal__close js-tab-focus">
                        <svg className="icon" viewBox="0 0 20 20">
                            <title>Close modal window</title>
                            <g fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="2">
                                <line x1="3" y1="3" x2="17" y2="17" />
                                <line x1="17" y1="3" x2="3" y2="17" />
                            </g>
                        </svg>
                    </button> */}
                </header>

                <div className="padding-y-sm padding-x-md">
                    <div className="text-component">
                        {this.props.children}
                    </div>
                </div>
                

                <footer className="padding-md">
                    <div className="flex justify-end gap-xs">
                        {/* <button className="btn btn--subtle js-modal__close">Cancel</button> */}
                        <button onClick={this.props.buttonAction} className="btn btn--primary">OK</button>
                        
                    </div>
                </footer>
            </div>

            {/* <button className="reset modal__close-btn modal__close-btn--outer display@md js-modal__close js-tab-focus">
                <svg className="icon icon--sm" viewBox="0 0 24 24">
                    <title>Close modal window</title>
                    <g fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="2">
                        <line x1="3" y1="3" x2="21" y2="21" />
                        <line x1="21" y1="3" x2="3" y2="21" />
                    </g>
                </svg>
            </button> */}
        </div>
        
        </>)
    }
}