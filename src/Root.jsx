import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Image } from 'react-native';
import PageLoading from './components/PageLoading';
import { Router, Route, Switch } from './navigation';
import CreateCustomer from './containers/CreateCustomerPage';
import Header from './components/Header';
import HomePage from './containers/HomePage';
import SearchPage from './containers/SearchPage';

const Routes = () => {
    return (
        <View style={styles.container}>
            <Header onMenuIconPress={() => console.log('Menu Icon Pressed')} />
            <Switch>
                <Route exact path="/customers/324" component={CreateCustomer} />
                <Route exact path="/search" component={SearchPage} />
                <Route exact path="/" component={HomePage} />
            </Switch>
        </View>
    );
};

class Root extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fontLoaded: false,
        };
    }

    async componentDidMount() {
        await Image.prefetch(require('../assets/icons/custom-master.jpeg'));
        await Image.prefetch(require('../assets/icons/vendor-master.jpeg'));
        await Image.prefetch(require('../assets/icons/material-master.jpeg'));

        setTimeout(() => {
            this.setState({ fontLoaded: true });
        }, 850);
    }

    render() {
        if (!this.state.fontLoaded) return <PageLoading />;

        return (
            <Router>
                <Routes />
            </Router>
        );
    }
}

export default Root;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
