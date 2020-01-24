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

@withRouter
class App extends Component {
    state = {
        isToggled: false,
    };
    toggle = value => this.setState({ isToggled: value });

    componentDidUpdate(prevProps) {
        if (
            this.props.location !== prevProps.location &&
            this.state.isToggled === true
        ) {
            this.toggle(false);
        }
    }

    render() {
        const { isToggled } = this.state;
        return (
            <View style={styles.container}>
                <View style={{ zIndex: 3 }}>
                    <Header onMenuIconPress={() => this.toggle(!isToggled)} />
                </View>
                <View style={{ zIndex: 1, height: '100vh' }}>
                    <Menu
                        onMenuDismiss={() => this.toggle(false)}
                        style={{ position: 'absolute', zIndex: 1 }}
                        isToggled={isToggled}
                    />
                    <Routes />
                </View>
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
