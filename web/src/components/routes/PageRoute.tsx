import React from "react";
import { Route } from "react-router-dom";
import Container from "typedi";
import { GlobalState } from "services/GlobalState";


export const PageRoute = ({ component: Component, isAuth, ...rest }: any) => {
    return (
        <Route
            {...rest}
            render={props =>

                <Component {...props} {...rest} key={props.match.params.search} />
            }
        />
    )
};