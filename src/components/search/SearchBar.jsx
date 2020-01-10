import { Image, StyleSheet, View } from 'react-native';
import React from 'react';
import Input from '../common/Input';

const SearchBar = ({ onQuery, isQuerying, onBlur, onFocus }) => {
    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <Input
                onBlur={onBlur}
                onFocus={onFocus}
                containerstyle={[
                    styles.inputContainer,
                    isQuerying && styles.noBorders,
                ]}
                clear
                onChange={onQuery}
                required
                labelNumber={4}
                leftIcon={
                    <View style={{ paddingLeft: 14 }}>
                        <Image
                            source={require('../../../assets/search.png')}
                            style={styles.img}
                        />
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        marginLeft: 0,
        borderWidth: 2,
        minWidth: 400,
        borderRadius: 20,
        flex: 1,
        borderBottomWidth: 2,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    noBorders: {
        borderBottomWidth: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    img: {
        width: 20,
        height: 20,
    },
});

export default SearchBar;
