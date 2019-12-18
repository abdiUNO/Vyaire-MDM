import React, { Component, useState } from 'react';
import { Image, View } from 'react-native';
import { ScrollView } from 'react-native-web';
import Fuse from 'fuse.js';
import debounce from 'debounce';
import { connect } from 'react-redux';
import { Container, Flex } from '../components/common';
import CustomerActions from '../redux/CustomerRedux';

import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';

const fuseOptions = {
    shouldSort: true,
    threshold: 0.3,
    location: 0,
    distance: 200,
    keys: ['Name'],
};

class SearchPage extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            queryResults: [],
            isFocused: false,
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.props.getCustomer();
    }

    handleOnChangeText = debounce(text => {
        if (this._isMounted) {
            console.log(text);
            const _reports = this.props.customers.reduce(
                (acc, val) => acc.concat(val),
                []
            );
            const fuse = new Fuse(_reports, fuseOptions);
            this.setState({ queryResults: fuse.search(text) });
        }
    }, 150);

    handleOnBlur = debounce(() => {
        if (this._isMounted) this.setState({ isFocused: false });
    }, 100);

    render() {
        const { queryResults, isFocused } = this.state;
        return (
            <ScrollView style={{ flex: 1, flexBasis: 'auto' }}>
                <Container full fullVertical>
                    <Flex
                        justifyAround
                        alignCenter
                        height={'calc(100vh - 90px)'}>
                        <SearchBar
                            onFocus={() => this.setState({ isFocused: true })}
                            onBlur={this.handleOnBlur}
                            onQuery={this.handleOnChangeText}
                            isQuerying={queryResults.length > 0 && isFocused}
                        />
                        <View style={{ position: 'absolute' }}>
                            {queryResults.length > 0 && isFocused && (
                                <ScrollView
                                    style={{
                                        minWidth: '400px',
                                        position: 'relative',
                                        top: -55,
                                        backgroundColor: '#FFFFFF',
                                    }}>
                                    <SearchResults customers={queryResults} />
                                </ScrollView>
                            )}
                        </View>
                    </Flex>

                    <View
                        style={{
                            flex: 1,
                            position: 'absolute',
                            width: '100%',
                            height: 225,
                            bottom: 0,
                            right: 5,
                        }}>
                        <Image
                            resizeMode="contain"
                            style={{
                                flex: 1,
                                height: 225,
                                opacity: 0.75,
                                bottom: 0,
                                right: -100,
                            }}
                            source={require('../../assets/icons/wisp-cropped.png')}
                        />
                    </View>
                </Container>
            </ScrollView>
        );
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
}

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
