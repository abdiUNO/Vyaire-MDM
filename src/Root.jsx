import React, { useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import PageLoading from './components/PageLoading';
import { Router } from './navigation/router';
import Header from './components/header';
import Menu from './components/Menu';
import Routes from './navigation/Routes';

const App = () => {
    const [isToggled, toggle] = useState(false);

    return (
        <View style={styles.container}>
            <View style={{ zIndex: 3 }}>
                <Header onMenuIconPress={() => toggle(!isToggled)} />
            </View>
            <View style={{ zIndex: 1, height: '100vh' }}>
                {isToggled && (
                    <Menu
                        onMenuDismiss={() => toggle(false)}
                        style={{ position: 'absolute', zIndex: 1 }}
                        isToggled={isToggled}
                    />
                )}
                <View>
                    <Routes />
                </View>
            </View>
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
                <App />
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
