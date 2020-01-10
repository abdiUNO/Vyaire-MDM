import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Tab from './Tab';
import styled from 'styled-components/native';

const TabsHeader = styled.View`
    z-index: 2;
    display: flex !important;
    flex-wrap: wrap;
    padding-left: 0px;
    padding-right: 0px;
`;

const TabsList = styled.View`
    display: flex !important;
    flex-direction: row;
    padding: 0px;
    border: 0px;
    border-radius: 7px;
    background-color: #fff;
    padding-right: 70%;
`;

class Tabs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab:
                this.props.children[this.props.selectedIndex].props.label ||
                this.props.children[0].props.label,
        };
    }

    onClickTabItem = tab => {
        this.setState({ activeTab: tab });
    };

    render() {
        const {
            onClickTabItem,
            props: { children, leftComponent },
            state: { activeTab },
        } = this;

        return (
            <View style={{ flex: 1 }}>
                <TabsHeader>
                    <TabsList>
                        {children.map(child => {
                            const { label } = child.props;

                            return (
                                <Tab
                                    activeTab={activeTab}
                                    style={child.props.style}
                                    key={label}
                                    label={label}
                                    onClick={onClickTabItem}
                                />
                            );
                        })}
                    </TabsList>
                </TabsHeader>

                <View style={{ flex: 1 }}>
                    {children.map(child => {
                        if (child.props.label !== activeTab) return undefined;
                        return child.props.children;
                    })}
                </View>
            </View>
        );
    }
}

export default Tabs;
