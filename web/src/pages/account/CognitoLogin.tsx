import React from "react";
import { AccountService } from "api/AccountService";
import Container from "typedi";
import { GlobalState } from "services/GlobalState";
import { Location } from "history";
import { RouteComponentProps } from "react-router-dom";
import { History } from 'history';
import { PageHistory } from "services/PageHistory";

interface ICognitoLoginProps extends RouteComponentProps{
    previousPage: string;
    location: Location;
    history: History
}

export class CognitoLogin extends React.Component<ICognitoLoginProps>{

    async componentDidMount(){
        const state = Container.get(GlobalState);
        const pageHistory = Container.get(PageHistory);
        state.pageLastVisited = pageHistory.get(pageHistory.length - 1 );
        pageHistory.push(this.props.location.pathname);
        
        console.log(state);
        const base64State = btoa(JSON.stringify(state))
        console.log(base64State);
        const accountService = Container.get(AccountService)
        const result = await accountService.login(base64State)
        window.location.replace(result.data.loginPage);
    }

    render(){
        return(<></>)
    }   
}