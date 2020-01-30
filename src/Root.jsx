import React, { useState, Component } from 'react';
import { StyleSheet, View, Image, Animated } from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import PageLoading from './components/PageLoading';
import { Router } from './navigation/router';
import Header from './components/header';
import Menu from './components/Menu';
import Routes from './navigation/Routes';
import { withRouter } from 'react-router';
import theme from './theme';

export const MenuContext = React.createContext({
    isToggled: false,
    toggleMenu: () => {},
});

@withRouter
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
                        <Header />
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
            <ThemeProvider theme={theme}>
                <Router>
                    <App />
                </Router>
            </ThemeProvider>
        );
    }
}

export default Root;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
