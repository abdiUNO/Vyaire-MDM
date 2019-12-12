import React from 'react';
import MDMApp from './src/Root';
import { StyleSheet, Text, View } from 'react-native';
import { DimensionProvider } from 'react-native-dimension-aware';

export default function App() {
    return (
        <DimensionProvider>
            <MDMApp />
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
