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
export default Loading;
