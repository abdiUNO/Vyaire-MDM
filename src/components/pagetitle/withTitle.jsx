import React from 'react';
import { PageTitle } from './index';

const withTitle = ({ component: Component, title }) => {
    return class Title extends React.Component {
        render() {
            return (
                <React.Fragment>
                    <PageTitle title={title} />
                    <Component {...this.props} />
                </React.Fragment>
            );
        }
    };
};

export default withTitle;
