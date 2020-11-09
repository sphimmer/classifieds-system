import * as React from "react";
import { Pages } from "enums/Pages";
import { Status } from "enums/Status";
import { Redirect } from "react-router-dom";
import qs from "query-string";

interface IHeaderSearchFieldProps{
    searchTerm?: string

}

interface IHeaderSearchFieldState{
    searchTerm?: string,
    status: Status
}

export class HeaderSearchField extends React.Component<IHeaderSearchFieldProps, IHeaderSearchFieldState>{
    state: IHeaderSearchFieldState = {
        searchTerm: this.props.searchTerm,
        status: Status.INIT
    }

    constructor(props: IHeaderSearchFieldProps){
        super(props);
        this.setSearchTerm = this.setSearchTerm.bind(this)
        this.search = this.search.bind(this)
    }

    componentDidUpdate(){
        if (this.state.status == Status.SUCCESS) {
            this.setState({status: Status.INIT});            
        }
    }

    setSearchTerm(event: React.ChangeEvent<HTMLInputElement>){
        const searchTerm = qs.stringify({search: event.target.value})
        this.setState({searchTerm})
    }

    search(event: React.KeyboardEvent<HTMLInputElement>){
        if(event.key == "Enter" && this.state.searchTerm){
            this.setState({status: Status.SUCCESS})
        }
    }

    render() {
        if (this.state.status == Status.SUCCESS) {
            return(
                <Redirect push to={Pages.SEARCH + "?" + this.state.searchTerm}/>
            )
        } else {
            return (
            
                <div className="search-input search-input--icon-left grid">
                    <input className="header-search-control width-100%" onChange={this.setSearchTerm} onKeyDown={this.search} defaultValue={this.state.searchTerm ? qs.parse(this.state.searchTerm).search as string : this.props.searchTerm} type="search" name="searchInputX" id="searchInputX" placeholder="Search..." aria-label="Search" />
                    <button className="search-input__btn">
                        <svg className="icon" viewBox="0 0 24 24"><title>Submit</title><g strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" stroke="currentColor" fill="none" strokeMiterlimit="10"><line x1="22" y1="22" x2="15.656" y2="15.656"></line><circle cx="10" cy="10" r="8"></circle></g></svg>
                    </button>
                </div>
            )
        }
        
    }
}