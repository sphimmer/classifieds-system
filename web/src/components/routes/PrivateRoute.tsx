import React from "react";
import { Status } from "enums/Status";
import { ILocalStorage } from "entities/ILocalStorage";
import { Route, Redirect } from "react-router-dom";
import { Pages } from "enums/Pages";
import Container from "typedi";
import { GlobalState } from "services/GlobalState";

interface IPrivateRouteState {
    status: Status;
    localStorage: ILocalStorage | null;
}


export class PrivateRoute extends React.Component<any, IPrivateRouteState>{
    state: IPrivateRouteState = {
        status: Status.LOADING,
        localStorage: null
    }

    async componentDidMount() {
        const globalState = Container.get(GlobalState);
        if (globalState.isLoggedIn) {
            this.state.status = Status.SUCCESS;
        } else {
            this.state.status = Status.FAILED;
        }
        
        this.setState(this.state);
    }

    render() {
        const { component: Component, ...rest } = this.props;
        if (this.state.status === Status.LOADING) {
            return <>Loading...</>
        } else if (this.state.status === Status.SUCCESS) {
            return(<Route {...rest} render={(props) => (
                
                
                <Component {...props} {...rest} session={this.state.localStorage}/>
                    


            )} />)
        } else {
            return <Redirect to={Pages.ACCOUNT + '?error=Please log in to continue'} />
        }
    }
}