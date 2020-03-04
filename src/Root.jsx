import React, { useState, Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Animated,
    AsyncStorage,
    ActivityIndicator,
} from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import PageLoading from './components/PageLoading';
import { Router, Route, Switch, Redirect } from './navigation/router';
import Header from './components/header';
import Routes from './navigation/Routes';
import { withRouter } from 'react-router';
import theme from './theme';
import Login from './containers/Login.jsx';
import { connect } from 'react-redux';
import { authUser } from './appRedux/actions/Auth';
import Menu from './components/Menu';

import { PrivateRoute } from './components/PrivateRoute';

import Amplify, { Auth, Hub, Cache } from 'aws-amplify';
import config from './containers/amplify-config';

Amplify.configure(config);

const ProppedRoute = ({ render: C, props: childProps, ...rest }) => (
    <Route {...rest} render={rProps => <C {...rProps} {...childProps} />} />
);

export const MenuContext = React.createContext({
    isToggled: false,
    toggleMenu: () => {},
});

class App extends Component {
    toggle = (value = null) => {
        const isBoolean = value && typeof value === 'boolean';
        this.setState(state => ({
            isToggled: isBoolean ? value : !state.isToggled,
        }));
    };

    constructor(props) {
        super(props);

        // this.toggleMenu = () => {
        //     this.setState(state => ({
        //         isToggled: !state.isToggled,
        //     }));
        // };

        this.state = {
            isToggled: false,
            toggleMenu: this.toggle,
        };
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.location !== prevProps.location &&
            this.state.isToggled === true &&
            this.props.location.pathname !== '/search'
        ) {
            this.toggle(false);
        }
    }

    render() {
        const { isToggled } = this.state;
        return (
            <View style={styles.container}>
                <MenuContext.Provider value={this.state}>
                    <View style={{ zIndex: 3 }}>
                        <Header
                            currentUser={this.props.currentUser}
                            onLogout={() => {
                                Auth.signOut()
                                    .then(async () => {
                                        await AsyncStorage.clear();
                                    })
                                    .catch(err => console.log(err));
                            }}
                        />
                    </View>
                    <View style={{ zIndex: 1, height: '100vh' }}>
                        <Menu
                            style={{ position: 'absolute', zIndex: 1 }}
                            isToggled={isToggled}
                        />
                        <Routes />
                    </View>
                </MenuContext.Provider>
            </View>
        );
    }
}

const MainRoutes = ({ childProps }) => (
    <Switch>
        <ProppedRoute exact path="/login" render={Login} props={childProps} />
        <PrivateRoute path="/" render={App} props={childProps} />
    </Switch>
);

class Root extends React.Component {
    constructor(props) {
        super(props);

        Hub.listen('auth', data => {
            const { payload } = data;

            if (data.payload.event === 'signIn') {
                this.props.authUser();
            }
        });

        this.state = {
            fontLoaded: false,
        };

        this._bootstrapAsync();
    }

    // eslint-disable-next-line no-underscore-dangle
    async _bootstrapAsync() {
        this.props.authUser();
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
        const { loggedIn, loading } = this.props;

        const childProps = {
            isLoggedIn: loggedIn,
            onUserSignIn: this.props.authUser,
            currentUser: this.props.user,
            loading: this.props.loading,
        };

        if (!this.state.fontLoaded) return <PageLoading />;

        if (loading === true || loggedIn === null) {
            return (
                <View
                    style={{
                        flex: 1,
                        flexBasis: 'auto',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <ActivityIndicator />
                </View>
            );
        }

        return (
            <ThemeProvider theme={theme}>
                <Router hashType="noslash">
                    <Route path="/">
                        {!loggedIn && <Redirect to="/login" />}
                    </Route>
                    <MainRoutes childProps={childProps} />
                </Router>
            </ThemeProvider>
        );
    }
}

const mapStateToProps = state => {
    return {
        loggedIn: state.auth.loggedIn,
        user: state.auth.user,
        loggedOut: state.auth.loggedOut,
    };
};

export default connect(mapStateToProps, { authUser })(Root);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
