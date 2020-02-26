// @flow
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// type Props = {
//   authStatus: boolean,
//   component: Function,
//   location: Object
// }

export const PrivateRoute = ({ render: C, props: childProps, ...rest }) => {
    return (
        <Route
            {...rest}
            render={rProps =>
                childProps.isLoggedIn ? (
                    <C {...rProps} {...childProps} />
                ) : (
                    <Redirect
                        to={`/login?redirect=${rProps.location.pathname}${rProps.location.search}`}
                    />
                )
            }
        />
    );
};
