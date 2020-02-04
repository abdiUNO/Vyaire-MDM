import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { Box } from './common';

class Loading extends Component {
    render() {
        return (
            <Box
                display="flex"
                flex={1}
                flexDirection="row"
                justifyContent="center"
                minHeight="100vh">
                <Box
                    display="flex"
                    flex={1}
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    maxHeight="650px">
                    <ActivityIndicator />
                </Box>
            </Box>
        );
    }
}

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
