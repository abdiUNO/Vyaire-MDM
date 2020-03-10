import React, { Component, useState } from 'react';
import { Animated, Easing, Image, View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-web';
import debounce from 'debounce';
import { connect } from 'react-redux';
import shallowCompare from 'react-addons-shallow-compare'; // ES6
import { Container, Flex, Text } from '../components/common';
import { Link } from '../navigation/router';
import { SearchBar, SearchResults } from '../components/search';
const { spring } = Animated;
import { searchCustomer } from '../appRedux/actions/Customer';
import { MenuContext } from '../Root';

export class Page extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        const opacity = new Animated.Value(0);
        const translateY = opacity.interpolate({
            inputRange: [0, 1],
            outputRange: [200, 0],
        });

        this.state = {
            customerdata: this.props.customerdata,
            searchResult:this.props.searchResult,
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
        if (!this.props.isToggled) this.props.toggleMenu(true);

        this._isMounted = true;
        this.anim.start();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.customerdata != this.props.customerdata) {
            this.setState({ customerdata: newProps.customerdata });
        }
        if (newProps.searchResult != this.props.searchResult) {
            this.setState({ searchResult: newProps.searchResult });
        }
    }

    trySagaOnchange = (e, text) => {
        var postdata={customerSearchType: 1,
            searchhits: {
                from: 0,
                size: 10,
            },
            userId: 'credit.user',
            typeaheadkeyword: e,
        }
        this.props.searchCustomer(postdata);
    };

    handleOnBlur = debounce(() => {
        if (this._isMounted) this.setState({ isFocused: false });
    }, 100);

    render() {
        const {searchResult, customerdata, isFocused } = this.state;
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
                                    onQuery={this.trySagaOnchange}
                                    isQuerying={
                                        customerdata.length > 0 && isFocused
                                    }
                                />
                            </View>
                        </Animated.View>
                        <View>
                            {customerdata.length > 0 && isFocused && (
                                <ScrollView
                                    keyboardShouldPersistTaps
                                    style={{
                                        minWidth: '400px',
                                        backgroundColor: '#FFFFFF',
                                    }}>
                                    <SearchResults searchResult={searchResult} customers={customerdata} />
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

class SearchPage extends Component {
    render() {
        return (
            <MenuContext.Consumer>
                {({ isToggled, toggleMenu }) => {
                    return (
                        <Page
                            {...this.props}
                            toggleMenu={toggleMenu}
                            isToggled={isToggled}
                        />
                    );
                }}
            </MenuContext.Consumer>
        );
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

const mapStateToProps = ({ customer }) => {
    const { searchResult,customerdata, fetching } = customer;
    return { searchResult,customerdata, fetching };
};

export default connect(mapStateToProps, { searchCustomer })(SearchPage);
