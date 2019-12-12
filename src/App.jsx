import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { Route, Switch, Redirect } from './Routing';
import CreateCustomer from './containers/CreateCustomer';
import Header from './components/Header';

const Test = () => (
    <ScrollView style={{ flex: 1 }}>
        <View
            style={{
                paddingVertical: 100,
                paddingHorizontal: 50,
                alignItems: 'center',
            }}>
            <Text>TEST TEST TEST</Text>
        </View>
    </ScrollView>
);

const App = () => {
    return (
        <View style={styles.container}>
            <Header onMenuIconPress={() => console.log('Menu Icon Pressed')} />
            <Switch>
                <Route exact path="/customer/new" component={CreateCustomer} />
                <Route exact path="/customer/update" component={Test} />
                <Redirect from="/" to="/customer/new" />
            </Switch>
        </View>
    );
};

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        minHeight: 650,
        marginBottom: 50,
    },
    bold: {
        fontWeight: 'bold',
    },
    menuContainer: {
        width: 250,
        borderRightWidth: 1,
        borderRightColor: 'grey',
        paddingTop: 15,
        marginLeft: 10,
    },
    userIcon: {
        width: 30,
        height: 30,
    },
});
