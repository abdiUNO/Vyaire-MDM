import { Image, View } from 'react-native';
import Input from './common/Input';
import React from 'react';

const SearchBar = ({ onQuery, isQuerying, onBlur, onFocus }) => {
    return (
        <View style={{ flex: 1, alignItems: 'center', bottom: 100 }}>
            <Input
                onBlur={onBlur}
                onFocus={onFocus}
                containerstyle={{
                    marginHorizontal: 0,
                    borderWidth: 2,
                    borderBottomWidth: isQuerying ? 0 : 2,
                    borderBottomLeftRadius: isQuerying ? 0 : 20,
                    borderBottomRightRadius: isQuerying ? 0 : 20,
                    minWidth: 400,
                    borderRadius: 20,
                    flex: 1,
                }}
                clear
                onChange={onQuery}
                required
                labelNumber={4}
                leftIcon={
                    <View style={{ paddingLeft: 14 }}>
                        <Image
                            source={require('../../assets/search.png')}
                            style={{
                                width: 20,
                                height: 20,
                            }}
                        />
                    </View>
                }
            />
        </View>
    );
};

export default SearchBar;
