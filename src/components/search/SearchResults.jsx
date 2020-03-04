import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';
import { Link } from '../../navigation/router';

class SearchResults extends PureComponent {
    render() {
        const { customers } = this.props;
        return (
            <View
                style={{
                    flex: 1,
                    flexBasis: 'auto',
                    width: '100%',
                    height: '100%',
                    flexDirection: 'column',
                    borderTopWidth: 0,
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    borderLeftWidth: 2,
                    borderRightWidth: 2,
                    borderBottomWidth: 2,
                    borderColor: '#8ea1c4',
                    backgroundColor: '#F3F9FA',
                }}>
                {customers.map(customer => (
                    <Link
                        to={{
                            pathname: `/search/results`,
                            state: customers,
                        }}
                        key={customer.MdmNumber || customer.WorkflowId}>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingTop: 19,

                                paddingHorizontal: 15,

                                flexWrap: 'wrap',
                                width: '100%',
                            }}>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    paddingBottom: 19,
                                    alignItems: 'center',
                                    borderBottomColor: '#D1D7E5',
                                    borderBottomWidth: 1,
                                }}>
                                <Text
                                    style={{
                                        flex: 1,
                                        fontSize: 14,
                                        color: '#2B4480',
                                        flexWrap: 'wrap',
                                        paddingLeft: 26,
                                        fontWeight: '500',
                                        fontFamily: 'Poppins',
                                    }}>
                                    {' '}
                                    {customer.Name}
                                </Text>
                            </View>
                        </View>
                    </Link>
                ))}
            </View>
        );
    }
}

export default SearchResults;
