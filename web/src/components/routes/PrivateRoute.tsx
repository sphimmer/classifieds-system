import React from "react";
import { Status } from "enums/Status";
import { ILocalStorage } from "entities/ILocalStorage";
import { getUser } from "util/session";
import { Route, Redirect } from "react-router-dom";
import { Pages } from "enums/Pages";

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
        try {
            this.state.localStorage = await getUser()
            this.state.status = Status.SUCCESS;
        } catch (error) {
            console.error(error)
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
                
                this.state.localStorage
                    ? <Component {...props} {...rest} session={this.state.localStorage}/>
                    : <Redirect to={Pages.LOGIN + '?error=Please log in to continue'} />


            )} />)
        } else {
            return <Redirect to={Pages.LOGIN + '?error=Please log in to continue'} />
        }
    }
}