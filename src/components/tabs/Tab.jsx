import React, { Component } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import TouchableOpacity from 'react-native-web/dist/exports/TouchableOpacity';

const ListItem = styled.Text`
    display: flex;
    flex: 1;
    font-family: Poppins;
    font-weight: 600;
    color: #ffffff;
    background-color: #234385;
    font-size: 18px;
    text-decoration: none;
    cursor: pointer;
    padding: 19px 30px;
    border: #234382 solid 1px;
    border-top-left-radius: 2.5px;
    border-top-right-radius: 2.5px;
`;

const ListItemActive = styled(ListItem)`
    color: #254680;
    border-bottom-color: #ffffff;
    position: relative;
    bottom: -1;
    z-index: 1;
    background-color: #ffffff;
`;

class Tab extends Component {
    onClick = () => {
        const { label, onClick } = this.props;
        onClick(label);
    };

    render() {
        const {
            onClick,
            props: { activeTab, label, style },
        } = this;

        return (
            <TouchableOpacity onPress={onClick} style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {activeTab === label ? (
                        <ListItemActive children={label} style={style} />
                    ) : (
                        <ListItem children={label} style={style} />
                    )}
                </View>
            </TouchableOpacity>
        );
    }
}

export default Tab;
