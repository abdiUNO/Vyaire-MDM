import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { Box } from './common';
import Loading from './Loading';

const withLoader = WrappedComponent => {
    return class extends Component {
        render() {
            const { loading, ...rest } = this.props;
            if (loading) return <Loading />;
            else return <WrappedComponent {...rest} />;
        }
    };
};

export default withLoader;
