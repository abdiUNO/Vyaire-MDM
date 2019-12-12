import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import PageLoading from './components/PageLoading';
import { Router, Route, Switch } from './navigation';
import CreateCustomer from './containers/CreateCustomer';
import Header from './components/Header';
import HomePage from './containers/HomePage';

const Routes = () => {
    return (
        <View style={styles.container}>
            <Header onMenuIconPress={() => console.log('Menu Icon Pressed')} />
            <Switch>
                <Route exact path="/customer/new" component={CreateCustomer} />
                <Route exact path="/" component={HomePage} />
            </Switch>
        </View>
    );
};

export default function Root() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 850);
        return () => clearTimeout(timer);
    }, []);

    if (loading) return <PageLoading />;

    return (
        <Router>
            <Routes />
        </Router>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
        minHeight: 650,
        marginBottom: 50,
    },
});
