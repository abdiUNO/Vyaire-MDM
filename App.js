import React from 'react';
import MDMApp from './src/Root';
import { StyleSheet, Text, View } from 'react-native';
import { DimensionProvider } from 'react-native-dimension-aware';
import { Provider } from 'react-redux';
import createStore from './src/appRedux/store';

const store = createStore();

export default function App() {
    return (
        <DimensionProvider>
            <Provider store={store}>
                <MDMApp />
            </Provider>
        </DimensionProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
