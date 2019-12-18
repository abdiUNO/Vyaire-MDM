import React from 'react';
import { Text, View } from 'react-native';
import { Link } from '../navigation';

const SearchResults = ({ customers }) => {
    return (
        <View
            style={{
                flex: 1,
                flexBasis: 'auto',
                width: '100%',
                height: '100%',
                flexDirection: 'column',
            }}>
            {customers.map(customer => (
                <Link to="/customers/324" key={customer.MdmNumber}>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingTop: 13,
                            paddingBottom: 13,
                            paddingHorizontal: 15,
                            borderTopWidth: 0,
                            borderBottomLeftRadius: 20,
                            borderBottomRightRadius: 20,
                            borderLeftWidth: 2,
                            borderRightWidth: 2,
                            borderBottomWidth: 2,
                            borderColor: '#8ea1c4',
                            flexWrap: 'wrap',
                            width: '100%',
                        }}>
                        <Text
                            style={{
                                fontSize: 14,
                                flexWrap: 'wrap',
                                fontWeight: 'bold',
                            }}>
                            {customer.Name}
                        </Text>
                    </View>
                </Link>
            ))}
        </View>
    );
};

export default SearchResults;
