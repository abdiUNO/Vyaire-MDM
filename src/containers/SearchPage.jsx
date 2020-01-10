import React, { Component, useState } from 'react';
import { Animated, Easing, Image, View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-web';
import debounce from 'debounce';
import { connect } from 'react-redux';
import shallowCompare from 'react-addons-shallow-compare'; // ES6
import { Container, Flex, Text } from '../components/common';
import CustomerActions from '../redux/CustomerRedux';
import { Link } from '../navigation/router';
import { SearchBar, SearchResults } from '../components/search';
const { spring } = Animated;

class SearchPage extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        const opacity = new Animated.Value(0);
        const translateY = opacity.interpolate({
            inputRange: [0, 1],
            outputRange: [200, 0],
        });

        this.state = {
            queryResults: [],
            isFocused: false,
            animation: { posY: translateY, opacity },
        };

        this.config = {
            delay: 75,
            duration: 400,
            toValue: 1,
            easing: Easing.bounce(),
        };

        this.anim = spring(this.state.animation.opacity, this.config);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    componentDidMount() {
        this._isMounted = true;
        this.props.getCustomer();
        this.anim.start();
    }

    handleOnChangeText = debounce(text => {
        if (this._isMounted) {
            fetch(
                `https://oaa4qq34j6.execute-api.us-east-2.amazonaws.com/dev/customer/${text}/searchv2`,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            )
                .then(response => response.json())
                .then(res => {
                    this.setState({ queryResults: res.customers || [] });
                });
        } else {
            if (this.state.queryResults.length > 0)
                this.setState({ queryResults: [] });
        }
    }, 100);

    handleOnBlur = debounce(() => {
        if (this._isMounted) this.setState({ isFocused: false });
    }, 100);

    render() {
        const { queryResults, isFocused } = this.state;
        return (
            <ScrollView keyboardShouldPersistTaps>
                <Container full fullVertical>
                    <Flex
                        alignCenter
                        style={{
                            flex: 1,
                            flexDirection: 'column',
                            marginTop: '30vh',
                            bottom: 0,
                        }}>
                        <Animated.View
                            style={{
                                transform: [
                                    {
                                        translateY: this.state.animation.posY,
                                    },
                                ],
                                opacity: this.state.animation.opacity.value,
                            }}>
                            <View style={styles.linkContainer}>
                                <Link to="/advance-search">
                                    <Text
                                        style={styles.linkText}
                                        fontWeight="medium"
                                        fontSize="12">
                                        Advance Search
                                    </Text>
                                </Link>
                            </View>
                            <View>
                                <SearchBar
                                    onFocus={() =>
                                        this.setState({ isFocused: true })
                                    }
                                    onBlur={this.handleOnBlur}
                                    onQuery={this.handleOnChangeText}
                                    isQuerying={
                                        queryResults.length > 0 && isFocused
                                    }
                                />
                            </View>
                        </Animated.View>
                        <View>
                            {queryResults.length > 0 && isFocused && (
                                <ScrollView
                                    keyboardShouldPersistTaps
                                    style={{
                                        minWidth: '400px',
                                        backgroundColor: '#FFFFFF',
                                    }}>
                                    <SearchResults customers={queryResults} />
                                </ScrollView>
                            )}
                        </View>
                    </Flex>
                </Container>
            </ScrollView>
        );
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
}

const styles = StyleSheet.create({
    linkContainer: {
        flex: 1,
        position: 'relative',
        right: -275,
        marginBottom: 16,
    },
    linkText: {
        textAlign: 'right',
        color: '#4195C7',
        paddingHorizontal: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#4195C7',
        borderBottomStyle: 'solid',
    },
});

const mapStateToProps = state => {
    return {
        customers: state.customers.data,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getCustomer: () => dispatch(CustomerActions.customerRequest()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
