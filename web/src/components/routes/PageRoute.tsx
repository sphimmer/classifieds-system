import React from "react";
import { Route } from "react-router-dom";

export const PageRoute = ({ component: Component, isAuth, ...rest }: any) => (
    <Route
        {...rest}
        render={props =>
            <Component {...props} {...rest} />
        }
    />
);