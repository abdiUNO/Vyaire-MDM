import React from 'react';
import Helmet from 'react-helmet';
import withTitle from './withTitle';

const PageTitle = ({ title }) => {
    var defaultTitle = '⚛️ app';
    return (
        <Helmet>
            <title>{title ? title : defaultTitle}</title>
        </Helmet>
    );
};

export { PageTitle, withTitle };
